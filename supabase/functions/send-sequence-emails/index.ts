import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://nerlude.io";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailSequence {
  id: string;
  user_id: string;
  email: string;
  user_name: string | null;
  next_email_step: number;
}

// Email templates for each step in the sequence
const emailTemplates: Record<number, { subject: string; getHtml: (name: string) => string }> = {
  // Day 1: Getting Started
  2: {
    subject: "Your first mission: Create a project 🎯",
    getHtml: (name: string) => {
      const firstName = name?.split(" ")[0] || "there";
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center;">
              <a href="${APP_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a;">nerlude</span><span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #FF0073;">.</span>
              </a>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">
                Hey ${firstName}, ready for your first mission? 🎯
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                Quick question: <strong>How many SaaS tools power your main product?</strong>
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                If you're like most developers, it's probably 5-15 different services. 
                Hosting, database, auth, payments, analytics, email... the list goes on! 😅
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%); border-radius: 20px; padding: 32px; text-align: center;">
                <p style="margin: 0 0 16px; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                  Today's Mission
                </p>
                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #ffffff;">
                  Create Your First Project
                </h2>
                <p style="margin: 0 0 24px; font-size: 15px; color: #d1d5db; line-height: 1.6;">
                  Pick your main product or side project. Give it a name, pick an emoji, and you're set!
                </p>
                <a href="${APP_URL}/projects/new" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #1a1a1a; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 100px;">
                  Create Project →
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0; font-size: 15px; color: #6b7280; text-align: center; line-height: 1.6;">
                ⏱️ Takes about 30 seconds. Seriously, that's it!
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Made with ❤️ by the Nerlude team
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          <a href="${APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
    },
  },

  // Day 3: Add Your First Service
  3: {
    subject: "The magic happens when you add services ✨",
    getHtml: (name: string) => {
      const firstName = name?.split(" ")[0] || "there";
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center;">
              <a href="${APP_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a;">nerlude</span><span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #FF0073;">.</span>
              </a>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">
                ${firstName}, let's talk about the good stuff ✨
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                You know what's frustrating? When you need an API key and you're like...
              </p>
              <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 15px; color: #991b1b; font-style: italic;">
                  "Wait, where did I put that Stripe secret key? Was it in the .env file? Notion? That random Slack message from 6 months ago?" 🤦
                </p>
              </div>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                <strong>Never again.</strong> With Nerlude, every credential has a home.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                Here's what you can add:
              </h3>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #dbeafe; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px; margin-right: 12px;">🚀</span>
                    <span style="font-size: 15px; color: #4a4a4a;">Vercel, Netlify, Railway, Render</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #dcfce7; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px; margin-right: 12px;">🗄️</span>
                    <span style="font-size: 15px; color: #4a4a4a;">Supabase, PlanetScale, MongoDB, Redis</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #fef3c7; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px; margin-right: 12px;">💳</span>
                    <span style="font-size: 15px; color: #4a4a4a;">Stripe, Paddle, LemonSqueezy</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #fce7f3; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px; margin-right: 12px;">📧</span>
                    <span style="font-size: 15px; color: #4a4a4a;">Resend, SendGrid, Postmark</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #e0e7ff; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px; margin-right: 12px;">🔐</span>
                    <span style="font-size: 15px; color: #4a4a4a;">...and 40+ more services!</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding: 0 48px 32px;">
              <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 100px;">
                Add Your First Service →
              </a>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Made with ❤️ by the Nerlude team
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          <a href="${APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
    },
  },

  // Day 5: Organize with Stacks
  4: {
    subject: "Pro tip: Group your services into Stacks 📚",
    getHtml: (name: string) => {
      const firstName = name?.split(" ")[0] || "there";
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center;">
              <a href="${APP_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a;">nerlude</span><span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #FF0073;">.</span>
              </a>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">
                Level up your organization game 📚
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                Hey ${firstName}! Quick power-user tip for you...
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                <strong>Stacks</strong> let you group related services together. Think of them as folders for your infrastructure.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 24px;">
                <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #0369a1;">
                  Example Stacks you could create:
                </h3>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 15px; color: #4a4a4a;">🔵 <strong>Backend</strong> — Supabase + Redis + Upstash</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 15px; color: #4a4a4a;">🟢 <strong>Frontend</strong> — Vercel + Cloudflare</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 15px; color: #4a4a4a;">🟡 <strong>Payments</strong> — Stripe + Paddle</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 15px; color: #4a4a4a;">🟣 <strong>Analytics</strong> — Mixpanel + PostHog + Sentry</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                When you organize services into stacks, you can see costs per stack, manage credentials together, and onboard teammates faster. 🚀
              </p>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding: 0 48px 32px;">
              <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 100px;">
                Create a Stack →
              </a>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Made with ❤️ by the Nerlude team
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          <a href="${APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
    },
  },

  // Day 7: Invite Your Team
  5: {
    subject: "One last thing: Your team will love this 👥",
    getHtml: (name: string) => {
      const firstName = name?.split(" ")[0] || "there";
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center;">
              <a href="${APP_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a;">nerlude</span><span style="font-family: 'Museo Moderno', sans-serif; font-size: 24px; font-weight: 700; color: #FF0073;">.</span>
              </a>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">
                ${firstName}, you've been crushing it! 🏆
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                This is our last onboarding email (we promise we're not clingy 😄).
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #4a4a4a;">
                But before we go, there's one more superpower we haven't told you about...
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 20px; padding: 32px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
                <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1a1a1a;">
                  Invite Your Team
                </h2>
                <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                  Share access to projects without sharing passwords. 
                  Set roles, control permissions, and onboard contractors in seconds.
                </p>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                Why teams love Nerlude:
              </h3>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 15px; color: #4a4a4a;">✅ No more "can you send me the API key?" messages</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 15px; color: #4a4a4a;">✅ Revoke access instantly when someone leaves</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 15px; color: #4a4a4a;">✅ Audit log shows who accessed what</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 15px; color: #4a4a4a;">✅ Different roles for different access levels</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding: 0 48px 32px;">
              <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 100px;">
                Invite Teammates →
              </a>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 15px; color: #166534; line-height: 1.6;">
                  🎉 <strong>That's it!</strong> You're now a Nerlude pro. If you ever need help, just reply to any of our emails. We're real humans and we love chatting!
                </p>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Made with ❤️ by the Nerlude team
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          <a href="${APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all users who have pending emails to send
    const now = new Date().toISOString();
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_sequences")
      .select("id, user_id, email, user_name, next_email_step")
      .eq("is_active", true)
      .not("next_email_at", "is", null)
      .lte("next_email_at", now)
      .limit(50); // Process in batches

    if (fetchError) {
      throw new Error(`Failed to fetch pending emails: ${fetchError.message}`);
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No pending emails to send", count: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${pendingEmails.length} pending emails`);

    const results: { email: string; step: number; success: boolean; error?: string }[] = [];

    for (const sequence of pendingEmails as EmailSequence[]) {
      const template = emailTemplates[sequence.next_email_step];
      
      if (!template) {
        console.error(`No template for step ${sequence.next_email_step}`);
        continue;
      }

      try {
        // Send the email
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Cyriac from Nerlude <hello@nerlude.io>",
            to: [sequence.email],
            subject: template.subject,
            html: template.getHtml(sequence.user_name || ""),
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          throw new Error(errorData.message || "Failed to send email");
        }

        // Advance the sequence in the database
        await supabase.rpc("advance_email_sequence", {
          p_user_id: sequence.user_id,
          p_step: sequence.next_email_step,
        });

        results.push({
          email: sequence.email,
          step: sequence.next_email_step,
          success: true,
        });

        console.log(`Sent step ${sequence.next_email_step} email to ${sequence.email}`);
      } catch (emailError: unknown) {
        const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
        console.error(`Failed to send email to ${sequence.email}:`, errorMessage);
        results.push({
          email: sequence.email,
          step: sequence.next_email_step,
          success: false,
          error: errorMessage,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} emails`,
        successCount,
        failCount,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in send-sequence-emails function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
