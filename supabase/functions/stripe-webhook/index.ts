import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspace_id;
        const planId = session.metadata?.plan_id;
        const billingCycle = session.metadata?.billing_cycle || "monthly";

        if (workspaceId && planId && session.subscription) {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update workspace subscription
          await supabase
            .from("workspace_subscriptions")
            .update({
              plan_id: planId,
              stripe_subscription_id: subscription.id,
              stripe_subscription_status: subscription.status,
              billing_cycle: billingCycle,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq("workspace_id", workspaceId);

          // Log billing event
          await supabase.from("billing_history").insert({
            workspace_id: workspaceId,
            event_type: "subscription_created",
            description: `Upgraded to ${planId} plan`,
            stripe_invoice_id: session.invoice as string,
            amount_cents: session.amount_total,
            currency: session.currency || "usd",
            new_plan_id: planId,
            metadata: { session_id: session.id },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const workspaceId = subscription.metadata?.workspace_id;

        if (workspaceId) {
          const previousPlanId = event.data.previous_attributes?.metadata?.plan_id;
          const newPlanId = subscription.metadata?.plan_id;

          await supabase
            .from("workspace_subscriptions")
            .update({
              plan_id: newPlanId || subscription.metadata?.plan_id,
              stripe_subscription_status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq("workspace_id", workspaceId);

          // Log if plan changed
          if (previousPlanId && previousPlanId !== newPlanId) {
            await supabase.from("billing_history").insert({
              workspace_id: workspaceId,
              event_type: "subscription_updated",
              description: `Plan changed from ${previousPlanId} to ${newPlanId}`,
              previous_plan_id: previousPlanId,
              new_plan_id: newPlanId,
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const workspaceId = subscription.metadata?.workspace_id;

        if (workspaceId) {
          // Downgrade to free plan
          await supabase
            .from("workspace_subscriptions")
            .update({
              plan_id: "free",
              stripe_subscription_status: "canceled",
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("workspace_id", workspaceId);

          await supabase.from("billing_history").insert({
            workspace_id: workspaceId,
            event_type: "subscription_canceled",
            description: "Subscription canceled, downgraded to free plan",
            previous_plan_id: subscription.metadata?.plan_id,
            new_plan_id: "free",
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const workspaceId = subscription.metadata?.workspace_id;

          if (workspaceId) {
            await supabase.from("billing_history").insert({
              workspace_id: workspaceId,
              event_type: "payment_succeeded",
              description: `Payment of $${(invoice.amount_paid / 100).toFixed(2)} succeeded`,
              stripe_invoice_id: invoice.id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount_cents: invoice.amount_paid,
              currency: invoice.currency,
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const workspaceId = subscription.metadata?.workspace_id;

          if (workspaceId) {
            // Update subscription status
            await supabase
              .from("workspace_subscriptions")
              .update({
                stripe_subscription_status: "past_due",
                updated_at: new Date().toISOString(),
              })
              .eq("workspace_id", workspaceId);

            await supabase.from("billing_history").insert({
              workspace_id: workspaceId,
              event_type: "payment_failed",
              description: `Payment of $${(invoice.amount_due / 100).toFixed(2)} failed`,
              stripe_invoice_id: invoice.id,
              amount_cents: invoice.amount_due,
              currency: invoice.currency,
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
