import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const UNIPILE_API_KEY = Deno.env.get("UNIPILE_API_KEY");
const UNIPILE_BASE_URL = Deno.env.get("UNIPILE_BASE_URL") || "https://api1.unipile.com:13111";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailAttachment {
  id: string;
  filename: string;
  content_type: string;
  size: number;
}

interface Email {
  id: string;
  subject: string;
  from: { name?: string; email: string };
  to: Array<{ name?: string; email: string }>;
  date: string;
  body_plain?: string;
  body_html?: string;
  attachments?: EmailAttachment[];
}

// Keywords to search for invoices/receipts
const INVOICE_KEYWORDS = [
  "invoice",
  "receipt",
  "payment",
  "subscription",
  "billing",
  "order confirmation",
  "payment received",
  "your order",
  "transaction",
];

// Service registry for matching (same as analyze-documents)
const SERVICE_REGISTRY = [
  { id: "vercel", name: "Vercel", aliases: ["vercel inc", "vercel.com"] },
  { id: "railway", name: "Railway", aliases: ["railway.app"] },
  { id: "netlify", name: "Netlify", aliases: ["netlify.com"] },
  { id: "aws", name: "AWS", aliases: ["amazon web services", "amazon.com services", "aws.amazon.com"] },
  { id: "supabase", name: "Supabase", aliases: ["supabase.com", "supabase inc"] },
  { id: "stripe", name: "Stripe", aliases: ["stripe.com", "stripe inc", "stripe payments"] },
  { id: "github", name: "GitHub", aliases: ["github.com", "github inc"] },
  { id: "digitalocean", name: "DigitalOcean", aliases: ["digitalocean.com", "digital ocean"] },
  { id: "cloudflare", name: "Cloudflare", aliases: ["cloudflare.com", "cloudflare inc"] },
  { id: "heroku", name: "Heroku", aliases: ["heroku.com", "salesforce heroku"] },
  { id: "mongodb", name: "MongoDB Atlas", aliases: ["mongodb.com", "mongodb inc"] },
  { id: "openai", name: "OpenAI", aliases: ["openai.com", "openai inc"] },
  { id: "google-cloud", name: "Google Cloud", aliases: ["google cloud", "gcp", "cloud.google.com"] },
  { id: "azure", name: "Microsoft Azure", aliases: ["azure.com", "microsoft azure"] },
  { id: "twilio", name: "Twilio", aliases: ["twilio.com", "twilio inc"] },
  { id: "sendgrid", name: "SendGrid", aliases: ["sendgrid.com", "twilio sendgrid"] },
  { id: "mailgun", name: "Mailgun", aliases: ["mailgun.com", "mailgun inc"] },
  { id: "datadog", name: "Datadog", aliases: ["datadog.com", "datadoghq"] },
  { id: "sentry", name: "Sentry", aliases: ["sentry.io", "getsentry"] },
  { id: "linear", name: "Linear", aliases: ["linear.app"] },
  { id: "notion", name: "Notion", aliases: ["notion.so", "notion labs"] },
  { id: "figma", name: "Figma", aliases: ["figma.com", "figma inc"] },
  { id: "slack", name: "Slack", aliases: ["slack.com", "slack technologies"] },
  { id: "zoom", name: "Zoom", aliases: ["zoom.us", "zoom video"] },
  { id: "intercom", name: "Intercom", aliases: ["intercom.com", "intercom inc"] },
];

async function createHostedAuthLink(
  successRedirectUrl: string,
  failureRedirectUrl: string,
  notifyUrl: string,
  userName: string
): Promise<string> {
  const response = await fetch(`${UNIPILE_BASE_URL}/api/v1/hosted/accounts/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": UNIPILE_API_KEY!,
    },
    body: JSON.stringify({
      type: "create",
      providers: ["GOOGLE", "OUTLOOK", "MAIL"],
      api_url: UNIPILE_BASE_URL,
      expiresOn: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      name: userName,
      success_redirect_url: successRedirectUrl,
      failure_redirect_url: failureRedirectUrl,
      notify_url: notifyUrl,
      bypass_success_screen: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create auth link: ${error}`);
  }

  const data = await response.json();
  return data.url || data.hosted_auth_link || data.connection_link;
}

async function listEmails(
  accountId: string,
  afterDate: string,
  limit: number = 100
): Promise<Email[]> {
  const params = new URLSearchParams({
    account_id: accountId,
    after: afterDate,
    limit: limit.toString(),
    meta_only: "false",
  });

  const response = await fetch(`${UNIPILE_BASE_URL}/api/v1/emails?${params}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-API-KEY": UNIPILE_API_KEY!,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list emails: ${error}`);
  }

  const data = await response.json();
  return data.items || [];
}

async function getEmailAttachment(
  emailId: string,
  attachmentId: string,
  accountId: string
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ account_id: accountId });
  
  const response = await fetch(
    `${UNIPILE_BASE_URL}/api/v1/emails/${emailId}/attachments/${attachmentId}?${params}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": UNIPILE_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get attachment: ${response.statusText}`);
  }

  return response.arrayBuffer();
}

function filterInvoiceEmails(emails: Email[]): Email[] {
  return emails.filter((email) => {
    const subject = (email.subject || "").toLowerCase();
    const body = (email.body_plain || "").toLowerCase();
    const fromEmail = email.from?.email?.toLowerCase() || "";

    // Check if subject or body contains invoice keywords
    const hasKeyword = INVOICE_KEYWORDS.some(
      (keyword) => subject.includes(keyword) || body.includes(keyword.toLowerCase())
    );

    // Check if from a known service
    const fromKnownService = SERVICE_REGISTRY.some((service) => {
      const serviceLower = service.name.toLowerCase();
      return (
        fromEmail.includes(serviceLower) ||
        service.aliases.some((alias) => fromEmail.includes(alias.toLowerCase()))
      );
    });

    // Check if has PDF/image attachments
    const hasRelevantAttachment = email.attachments?.some((att) => {
      const contentType = att.content_type?.toLowerCase() || "";
      const filename = att.filename?.toLowerCase() || "";
      return (
        contentType.includes("pdf") ||
        contentType.includes("image") ||
        filename.endsWith(".pdf") ||
        filename.endsWith(".png") ||
        filename.endsWith(".jpg") ||
        filename.endsWith(".jpeg")
      );
    });

    return hasKeyword || fromKnownService || hasRelevantAttachment;
  });
}

async function analyzeWithGemini(documents: Array<{ content: string; mimeType: string; filename: string }>) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const systemPrompt = `You are an expert at analyzing invoices, receipts, and billing documents to extract service/subscription information.

For each document, extract:
1. Service/vendor name
2. Amount charged
3. Currency
4. Billing date
5. Billing period (monthly, yearly, etc.)
6. Any account/subscription identifiers

Return a JSON array of extracted services with this structure:
{
  "services": [
    {
      "name": "Service Name",
      "amount": 29.99,
      "currency": "USD",
      "billingDate": "2024-01-15",
      "billingCycle": "monthly",
      "confidence": 0.95
    }
  ]
}

If you cannot extract information from a document, return an empty services array for that document.`;

  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [
    { text: systemPrompt },
  ];

  for (const doc of documents) {
    if (doc.mimeType.startsWith("text/") || doc.mimeType === "application/json") {
      parts.push({ text: `Document (${doc.filename}):\n${doc.content}` });
    } else {
      parts.push({
        inline_data: {
          mime_type: doc.mimeType,
          data: doc.content, // Already base64
        },
      });
    }
  }

  parts.push({ text: "Analyze these documents and extract all service/subscription information. Return valid JSON only." });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return { services: [] };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify required environment variables
    if (!UNIPILE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "UNIPILE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user with Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, accountId, daysBack = 30, successRedirectUrl, failureRedirectUrl, notifyUrl } = body;

    switch (action) {
      case "create_auth_link": {
        // Generate hosted auth link for user to connect their email
        if (!successRedirectUrl) {
          return new Response(
            JSON.stringify({ error: "successRedirectUrl is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const authLink = await createHostedAuthLink(
          successRedirectUrl,
          failureRedirectUrl || successRedirectUrl,
          notifyUrl || "",
          user.id
        );

        return new Response(
          JSON.stringify({ authLink }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "fetch_invoices": {
        // Fetch and analyze invoices from connected email account
        if (!accountId) {
          return new Response(
            JSON.stringify({ error: "accountId is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Calculate date range
        const afterDate = new Date();
        afterDate.setDate(afterDate.getDate() - daysBack);
        const afterDateStr = afterDate.toISOString();

        // Fetch emails
        console.log(`Fetching emails for account ${accountId} after ${afterDateStr}`);
        const emails = await listEmails(accountId, afterDateStr, 250);
        console.log(`Found ${emails.length} emails`);

        // Filter for invoice-related emails
        const invoiceEmails = filterInvoiceEmails(emails);
        console.log(`Filtered to ${invoiceEmails.length} potential invoice emails`);

        if (invoiceEmails.length === 0) {
          return new Response(
            JSON.stringify({ 
              message: "No invoice-related emails found",
              emailsScanned: emails.length,
              invoicesFound: 0,
              services: []
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Collect attachments for analysis
        const documentsToAnalyze: Array<{ content: string; mimeType: string; filename: string }> = [];

        for (const email of invoiceEmails.slice(0, 20)) { // Limit to 20 emails
          // Add email body as text document
          if (email.body_plain) {
            documentsToAnalyze.push({
              content: `From: ${email.from?.email}\nSubject: ${email.subject}\nDate: ${email.date}\n\n${email.body_plain}`,
              mimeType: "text/plain",
              filename: `email_${email.id}.txt`,
            });
          }

          // Download and add attachments
          if (email.attachments) {
            for (const attachment of email.attachments.slice(0, 3)) { // Max 3 attachments per email
              const contentType = attachment.content_type?.toLowerCase() || "";
              if (
                contentType.includes("pdf") ||
                contentType.includes("image")
              ) {
                try {
                  const attachmentData = await getEmailAttachment(email.id, attachment.id, accountId);
                  const base64 = arrayBufferToBase64(attachmentData);
                  documentsToAnalyze.push({
                    content: base64,
                    mimeType: attachment.content_type,
                    filename: attachment.filename,
                  });
                } catch (err) {
                  console.error(`Failed to download attachment ${attachment.id}:`, err);
                }
              }
            }
          }
        }

        console.log(`Analyzing ${documentsToAnalyze.length} documents with Gemini`);

        // Analyze with Gemini
        let analysisResult = { services: [] };
        if (documentsToAnalyze.length > 0 && GEMINI_API_KEY) {
          try {
            analysisResult = await analyzeWithGemini(documentsToAnalyze);
          } catch (err) {
            console.error("Gemini analysis error:", err);
          }
        }

        // Log audit event
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "email_invoice_sync",
          resource_type: "email",
          details: {
            accountId,
            emailsScanned: emails.length,
            invoiceEmailsFound: invoiceEmails.length,
            documentsAnalyzed: documentsToAnalyze.length,
            servicesExtracted: analysisResult.services?.length || 0,
          },
        });

        return new Response(
          JSON.stringify({
            emailsScanned: emails.length,
            invoiceEmailsFound: invoiceEmails.length,
            documentsAnalyzed: documentsToAnalyze.length,
            services: analysisResult.services || [],
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error in sync-email-invoices:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
