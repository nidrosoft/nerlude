import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://nerlude.io";

interface WelcomePayload {
  userId: string;
  email: string;
  name?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function createWelcomeEmailTemplate(name: string): string {
  const firstName = name?.split(" ")[0] || "there";
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Nerlude! 🎉</title>
  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center;">
              <a href="${APP_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 32px;">
                <span style="font-family: 'MuseoModerno', sans-serif; font-size: 28px; font-weight: 700; color: #1a1a1a;">nerlude</span><span style="font-family: 'MuseoModerno', sans-serif; font-size: 28px; font-weight: 700; color: #FF0073;">.</span>
              </a>
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #1a1a1a; line-height: 1.2;">
                Welcome aboard, ${firstName}! 🚀
              </h1>
            </td>
          </tr>
          
          <!-- Hero Message -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0; font-size: 18px; line-height: 1.7; color: #4a4a4a; text-align: center;">
                You just made the smartest decision for your SaaS stack. 
                <strong style="color: #1a1a1a;">No more scattered credentials, surprise bills, or forgotten renewals.</strong>
              </p>
            </td>
          </tr>
          
          <!-- Fun Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="text-align: center; font-size: 24px; padding: 16px 0;">
                ✨ 🔐 💰 📊 ✨
              </div>
            </td>
          </tr>
          
          <!-- What You Can Do Section -->
          <tr>
            <td style="padding: 32px 48px;">
              <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 600; color: #1a1a1a; text-align: center;">
                Here's what you can do right now:
              </h2>
              
              <!-- Feature 1 -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 24px; margin-bottom: 16px;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="width: 48px; vertical-align: top;">
                      <div style="width: 40px; height: 40px; background-color: #0ea5e9; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                        🔐
                      </div>
                    </td>
                    <td style="padding-left: 16px;">
                      <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                        Save Your First Credential
                      </h3>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                        API keys, tokens, secrets — all encrypted and organized. Never dig through .env files again!
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Feature 2 -->
              <div style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 16px; padding: 24px; margin-bottom: 16px;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="width: 48px; vertical-align: top;">
                      <div style="width: 40px; height: 40px; background-color: #a855f7; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                        📦
                      </div>
                    </td>
                    <td style="padding-left: 16px;">
                      <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                        Add Your Services
                      </h3>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                        Vercel, Supabase, Stripe, AWS — track them all in one beautiful dashboard.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Feature 3 -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 24px;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="width: 48px; vertical-align: top;">
                      <div style="width: 40px; height: 40px; background-color: #22c55e; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                        💰
                      </div>
                    </td>
                    <td style="padding-left: 16px;">
                      <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                        Track Your Spending
                      </h3>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                        See exactly where your money goes. Get alerts before renewals hit your card.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 32px 48px;">
              <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 18px 48px; background-color: #1a1a1a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 100px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);">
                Go to My Dashboard →
              </a>
            </td>
          </tr>
          
          <!-- Personal Touch -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="background-color: #fefce8; border-radius: 16px; padding: 24px; text-align: center;">
                <p style="margin: 0; font-size: 15px; color: #854d0e; line-height: 1.6;">
                  💡 <strong>Pro tip:</strong> Start by creating a project for your main product. 
                  Then add all the services that power it. You'll be amazed at how organized you'll feel!
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280; text-align: center;">
                Questions? Just reply to this email — we actually read them! 📬
              </p>
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Made with ❤️ by the Nerlude team
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Unsubscribe -->
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          © ${new Date().getFullYear()} Nerlude. All rights reserved.<br>
          <a href="${APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe from emails</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

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

    const payload: WelcomePayload = await req.json();

    if (!payload.userId || !payload.email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Initialize the email sequence in the database
    const { data: sequenceId, error: sequenceError } = await supabase
      .rpc('initialize_email_sequence', {
        p_user_id: payload.userId,
        p_email: payload.email,
        p_user_name: payload.name || null,
      });

    if (sequenceError) {
      console.error("Failed to initialize email sequence:", sequenceError);
    }

    // Create and send the welcome email
    const emailHtml = createWelcomeEmailTemplate(payload.name || "");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cyriac from Nerlude <hello@nerlude.io>",
        to: [payload.email],
        subject: `Welcome to Nerlude, ${payload.name?.split(" ")[0] || "friend"}! 🎉`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      throw new Error(resendData.message || "Failed to send welcome email");
    }

    console.log(`Welcome email sent to ${payload.email}, sequence ID: ${sequenceId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email sent successfully",
        emailId: resendData.id,
        sequenceId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-welcome function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
