import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://nerlude.io";

interface InvitePayload {
  type: "workspace" | "project";
  email: string;
  inviterName: string;
  inviterEmail: string;
  targetId: string;
  targetName: string;
  role: string;
  workspaceName?: string; // For project invites, include workspace name
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Create the HTML email template
function createEmailTemplate(payload: InvitePayload, token: string): string {
  const inviteUrl = `${APP_URL}/invite/${token}`;
  const isWorkspace = payload.type === "workspace";
  const targetType = isWorkspace ? "workspace" : "project";
  const roleDisplay = payload.role.charAt(0).toUpperCase() + payload.role.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited to Nerlude</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <img src="https://nerlude.io/images/Logo-dark.svg" alt="Nerlude" style="height: 32px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                You've Been Invited!
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Hi there,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                <strong style="color: #1a1a1a;">${payload.inviterName}</strong> has invited you to join the 
                <strong style="color: #1a1a1a;">${payload.targetName}</strong> ${targetType} on Nerlude as a 
                <strong style="color: #6366f1;">${roleDisplay}</strong>.
              </p>
              
              ${!isWorkspace && payload.workspaceName ? `
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #6b7280;">
                This project is part of the <strong>${payload.workspaceName}</strong> workspace.
              </p>
              ` : ""}
              
              <!-- Invite Card -->
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${isWorkspace ? "Workspace" : "Project"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style="font-size: 18px; font-weight: 600; color: #1a1a1a;">
                        ${payload.targetName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 8px;">
                      <span style="display: inline-block; padding: 4px 12px; background-color: #6366f1; color: #ffffff; font-size: 12px; font-weight: 500; border-radius: 20px;">
                        ${roleDisplay}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 30px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                This invitation will expire in <strong>24 hours</strong>.
              </p>
              
              <!-- Alternative Link -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p style="margin: 0 0 10px; font-size: 13px; color: #6b7280;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; font-size: 13px; color: #6366f1; word-break: break-all;">
                  ${inviteUrl}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 10px; font-size: 13px; color: #6b7280; text-align: center;">
                Nerlude - Your SaaS Management Hub
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                You received this email because ${payload.inviterEmail} invited you to Nerlude.
                <br>If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Unsubscribe -->
        <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          © ${new Date().getFullYear()} Nerlude. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const payload: InvitePayload = await req.json();

    // Validate required fields
    if (!payload.email || !payload.type || !payload.targetId || !payload.targetName || !payload.inviterName || !payload.role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate invite token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store the invite token in the database
    const { error: insertError } = await supabase
      .from("invite_tokens")
      .insert({
        token,
        email: payload.email,
        type: payload.type,
        target_id: payload.targetId,
        target_name: payload.targetName,
        role: payload.role,
        inviter_name: payload.inviterName,
        inviter_email: payload.inviterEmail,
        workspace_name: payload.workspaceName || null,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Failed to store invite token:", insertError);
      throw new Error("Failed to create invitation");
    }

    // Create email HTML
    const emailHtml = createEmailTemplate(payload, token);

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Nerlude Team <invite@nerlude.io>",
        to: [payload.email],
        subject: `${payload.inviterName} invited you to join ${payload.targetName} on Nerlude`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      
      // Clean up the token if email fails
      await supabase.from("invite_tokens").delete().eq("token", token);
      
      throw new Error(resendData.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent successfully",
        emailId: resendData.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
