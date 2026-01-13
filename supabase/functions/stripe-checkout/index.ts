import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CheckoutRequest {
  action: "create_checkout" | "create_portal" | "get_subscription" | "cancel_subscription";
  workspaceId: string;
  planId?: string;
  billingCycle?: "monthly" | "yearly";
  successUrl?: string;
  cancelUrl?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    console.log("Validating token:", token.substring(0, 50) + "...");
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log("Auth result:", { userId: user?.id, error: authError?.message });
    
    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: "Invalid token", 
        details: authError?.message || "User not found",
        code: "AUTH_ERROR"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: CheckoutRequest = await req.json();
    const { action, workspaceId, planId, billingCycle, successUrl, cancelUrl } = body;

    // Verify user has access to workspace
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return new Response(JSON.stringify({ error: "Not authorized to manage billing" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get or create workspace subscription record
    let { data: subscription } = await supabase
      .from("workspace_subscriptions")
      .select("*")
      .eq("workspace_id", workspaceId)
      .single();

    if (!subscription) {
      const { data: newSub } = await supabase
        .from("workspace_subscriptions")
        .insert({ workspace_id: workspaceId, plan_id: "free" })
        .select()
        .single();
      subscription = newSub;
    }

    // Handle different actions
    switch (action) {
      case "create_checkout": {
        if (!planId || planId === "free") {
          return new Response(JSON.stringify({ error: "Cannot checkout for free plan" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get plan details
        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (!plan) {
          return new Response(JSON.stringify({ error: "Plan not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const priceId = billingCycle === "yearly" 
          ? plan.stripe_price_id_yearly 
          : plan.stripe_price_id_monthly;

        if (!priceId) {
          return new Response(JSON.stringify({ error: "Stripe price not configured for this plan" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get or create Stripe customer
        let customerId = subscription?.stripe_customer_id;
        
        if (!customerId) {
          // Get workspace details
          const { data: workspace } = await supabase
            .from("workspaces")
            .select("name")
            .eq("id", workspaceId)
            .single();

          const customer = await stripe.customers.create({
            email: user.email,
            name: workspace?.name || user.email,
            metadata: {
              workspace_id: workspaceId,
              user_id: user.id,
            },
          });
          customerId = customer.id;

          // Save customer ID
          await supabase
            .from("workspace_subscriptions")
            .update({ stripe_customer_id: customerId })
            .eq("workspace_id", workspaceId);
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: successUrl || `${req.headers.get("origin")}/settings/plan?success=true`,
          cancel_url: cancelUrl || `${req.headers.get("origin")}/settings/plan?canceled=true`,
          metadata: {
            workspace_id: workspaceId,
            plan_id: planId,
            billing_cycle: billingCycle || "monthly",
          },
          subscription_data: {
            metadata: {
              workspace_id: workspaceId,
              plan_id: planId,
            },
          },
        });

        return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_portal": {
        if (!subscription?.stripe_customer_id) {
          return new Response(JSON.stringify({ error: "No billing account found" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.stripe_customer_id,
          return_url: successUrl || `${req.headers.get("origin")}/settings/plan`,
        });

        return new Response(JSON.stringify({ url: portalSession.url }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_subscription": {
        // Get current subscription details
        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", subscription?.plan_id || "free")
          .single();

        const { data: usage } = await supabase
          .from("workspace_usage")
          .select("*")
          .eq("workspace_id", workspaceId)
          .single();

        return new Response(JSON.stringify({
          subscription,
          plan,
          usage: usage || {
            project_count: 0,
            team_member_count: 0,
            credential_count: 0,
            integration_count: 0,
            storage_used_bytes: 0,
          },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "cancel_subscription": {
        if (!subscription?.stripe_subscription_id) {
          return new Response(JSON.stringify({ error: "No active subscription" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Cancel at period end
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
        });

        // Update local record
        await supabase
          .from("workspace_subscriptions")
          .update({ cancel_at_period_end: true })
          .eq("workspace_id", workspaceId);

        return new Response(JSON.stringify({ success: true, message: "Subscription will cancel at period end" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
