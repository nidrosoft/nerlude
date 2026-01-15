import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Service registry for matching - simplified version for the Edge Function
const SERVICE_REGISTRY = [
  { id: "vercel", name: "Vercel", aliases: ["vercel inc", "vercel.com"], category: "infrastructure" },
  { id: "railway", name: "Railway", aliases: ["railway.app"], category: "infrastructure" },
  { id: "netlify", name: "Netlify", aliases: ["netlify.com"], category: "infrastructure" },
  { id: "aws", name: "AWS", aliases: ["amazon web services", "amazon.com services", "aws.amazon.com"], category: "infrastructure" },
  { id: "supabase", name: "Supabase", aliases: ["supabase.com", "supabase inc"], category: "infrastructure" },
  { id: "planetscale", name: "PlanetScale", aliases: ["planetscale.com"], category: "infrastructure" },
  { id: "mongodb", name: "MongoDB Atlas", aliases: ["mongodb.com", "mongodb inc", "atlas"], category: "infrastructure" },
  { id: "neon", name: "Neon", aliases: ["neon.tech", "neon database"], category: "infrastructure" },
  { id: "upstash", name: "Upstash", aliases: ["upstash.com"], category: "infrastructure" },
  { id: "namecheap", name: "Namecheap", aliases: ["namecheap.com", "namecheap inc"], category: "domains" },
  { id: "cloudflare", name: "Cloudflare", aliases: ["cloudflare.com", "cloudflare inc"], category: "domains" },
  { id: "porkbun", name: "Porkbun", aliases: ["porkbun.com"], category: "domains" },
  { id: "clerk", name: "Clerk", aliases: ["clerk.com", "clerk.dev"], category: "identity" },
  { id: "auth0", name: "Auth0", aliases: ["auth0.com", "okta"], category: "identity" },
  { id: "stripe", name: "Stripe", aliases: ["stripe.com", "stripe inc", "stripe payments"], category: "payments" },
  { id: "lemonsqueezy", name: "Lemon Squeezy", aliases: ["lemonsqueezy.com"], category: "payments" },
  { id: "paddle", name: "Paddle", aliases: ["paddle.com"], category: "payments" },
  { id: "resend", name: "Resend", aliases: ["resend.com"], category: "communications" },
  { id: "sendgrid", name: "SendGrid", aliases: ["sendgrid.com", "twilio sendgrid"], category: "communications" },
  { id: "postmark", name: "Postmark", aliases: ["postmarkapp.com"], category: "communications" },
  { id: "posthog", name: "PostHog", aliases: ["posthog.com"], category: "analytics" },
  { id: "plausible", name: "Plausible", aliases: ["plausible.io"], category: "analytics" },
  { id: "mixpanel", name: "Mixpanel", aliases: ["mixpanel.com"], category: "analytics" },
  { id: "openai", name: "OpenAI", aliases: ["openai.com", "open ai"], category: "devtools" },
  { id: "anthropic", name: "Anthropic", aliases: ["anthropic.com", "claude"], category: "devtools" },
  { id: "replicate", name: "Replicate", aliases: ["replicate.com"], category: "devtools" },
  { id: "sentry", name: "Sentry", aliases: ["sentry.io", "getsentry"], category: "analytics" },
  { id: "logrocket", name: "LogRocket", aliases: ["logrocket.com"], category: "analytics" },
  { id: "cloudinary", name: "Cloudinary", aliases: ["cloudinary.com"], category: "infrastructure" },
  { id: "uploadthing", name: "UploadThing", aliases: ["uploadthing.com"], category: "infrastructure" },
  { id: "github", name: "GitHub", aliases: ["github.com", "github inc"], category: "devtools" },
  { id: "linear", name: "Linear", aliases: ["linear.app"], category: "devtools" },
  { id: "apple-developer", name: "Apple Developer", aliases: ["developer.apple.com", "apple inc"], category: "distribution" },
  { id: "google-play", name: "Google Play Console", aliases: ["play.google.com", "google play developer"], category: "distribution" },
  // Marketing & Growth
  { id: "google-ads", name: "Google Ads", aliases: ["ads.google.com", "google adwords", "adwords"], category: "marketing" },
  { id: "meta-business", name: "Meta Business Suite", aliases: ["business.facebook.com", "facebook ads", "instagram ads", "meta ads"], category: "marketing" },
  { id: "tiktok-ads", name: "TikTok Ads", aliases: ["ads.tiktok.com", "tiktok for business"], category: "marketing" },
  { id: "linkedin-ads", name: "LinkedIn Ads", aliases: ["linkedin marketing", "linkedin campaign manager"], category: "marketing" },
  { id: "canva", name: "Canva", aliases: ["canva.com", "canva pro", "canva teams"], category: "marketing" },
  { id: "figma", name: "Figma", aliases: ["figma.com", "figma inc"], category: "marketing" },
  { id: "buffer", name: "Buffer", aliases: ["buffer.com", "buffer app"], category: "marketing" },
  { id: "hootsuite", name: "Hootsuite", aliases: ["hootsuite.com"], category: "marketing" },
  { id: "ahrefs", name: "Ahrefs", aliases: ["ahrefs.com"], category: "marketing" },
  { id: "semrush", name: "SEMrush", aliases: ["semrush.com"], category: "marketing" },
  { id: "mailchimp", name: "Mailchimp", aliases: ["mailchimp.com", "intuit mailchimp"], category: "marketing" },
  { id: "hubspot", name: "HubSpot", aliases: ["hubspot.com", "hubspot inc"], category: "marketing" },
  { id: "zapier", name: "Zapier", aliases: ["zapier.com"], category: "marketing" },
  { id: "heroku", name: "Heroku", aliases: ["heroku.com", "salesforce heroku"], category: "infrastructure" },
  { id: "digitalocean", name: "DigitalOcean", aliases: ["digitalocean.com"], category: "infrastructure" },
  { id: "render", name: "Render", aliases: ["render.com"], category: "infrastructure" },
  { id: "fly", name: "Fly.io", aliases: ["fly.io"], category: "infrastructure" },
  { id: "twilio", name: "Twilio", aliases: ["twilio.com", "twilio inc"], category: "communications" },
  { id: "mailgun", name: "Mailgun", aliases: ["mailgun.com"], category: "communications" },
  { id: "godaddy", name: "GoDaddy", aliases: ["godaddy.com"], category: "domains" },
  { id: "google-domains", name: "Google Domains", aliases: ["domains.google"], category: "domains" },
  { id: "firebase", name: "Firebase", aliases: ["firebase.google.com", "google firebase"], category: "infrastructure" },
  { id: "algolia", name: "Algolia", aliases: ["algolia.com"], category: "devtools" },
  { id: "segment", name: "Segment", aliases: ["segment.com", "twilio segment"], category: "analytics" },
  { id: "amplitude", name: "Amplitude", aliases: ["amplitude.com"], category: "analytics" },
  { id: "datadog", name: "Datadog", aliases: ["datadoghq.com"], category: "analytics" },
  { id: "newrelic", name: "New Relic", aliases: ["newrelic.com"], category: "analytics" },
];

// System prompt for GPT-4o to analyze documents
const SYSTEM_PROMPT = `You are an expert document analyzer for Nerlude, a product infrastructure management platform. Your task is to analyze uploaded documents (invoices, bills, receipts, spreadsheets, screenshots) and extract information about software services and subscriptions.

## Your Capabilities
- Identify software services from invoices, bills, and receipts
- Extract billing amounts, frequencies, and dates
- Recognize service names from logos, headers, and text
- Parse spreadsheets and structured data
- Handle multiple services in a single document

## Known Services Registry
You should match extracted services to these known service IDs when possible:
${SERVICE_REGISTRY.map(s => `- ${s.id}: ${s.name} (aliases: ${s.aliases.join(", ")})`).join("\n")}

## Output Format
You MUST respond with valid JSON in this exact structure:
{
  "success": true,
  "suggestedProjectName": "string - inferred project/company name if detectable, otherwise null",
  "services": [
    {
      "registryId": "string - matched service ID from registry, or null if unknown",
      "detectedName": "string - service name as found in document",
      "confidence": 0.0-1.0,
      "billing": {
        "amount": number or null,
        "currency": "USD" or other currency code,
        "frequency": "monthly" | "yearly" | "one-time" | null
      },
      "accountIdentifier": "string - account ID, email, or identifier if found, otherwise null",
      "renewalDate": "YYYY-MM-DD or null",
      "planName": "string - detected plan tier if found, otherwise null",
      "notes": "string - any additional relevant info"
    }
  ],
  "unmatchedItems": ["string - services or items that couldn't be matched to registry"],
  "documentType": "invoice" | "receipt" | "spreadsheet" | "screenshot" | "other",
  "processingNotes": "string - any issues or observations about the document"
}

## Rules
1. Always return valid JSON - no markdown, no explanations outside the JSON
2. Set confidence based on how certain you are about the match (0.9+ for exact matches, 0.5-0.8 for partial matches)
3. If you can't identify a service, add it to unmatchedItems
4. Extract ALL services found in the document, even if they're not in the registry
5. For spreadsheets with multiple rows, extract each service as a separate entry
6. Currency should be a 3-letter ISO code (USD, EUR, GBP, etc.)
7. Dates should be in YYYY-MM-DD format
8. If the document is unclear or unreadable, set success to false and explain in processingNotes`;

interface DocumentInput {
  type: "image" | "text";
  content: string; // base64 for images, raw text for text/CSV
  filename?: string;
  mimeType?: string;
}

interface ExtractedService {
  registryId: string | null;
  detectedName: string;
  confidence: number;
  billing: {
    amount: number | null;
    currency: string;
    frequency: "monthly" | "yearly" | "one-time" | null;
  };
  accountIdentifier: string | null;
  renewalDate: string | null;
  planName: string | null;
  notes: string;
}

interface AnalysisResult {
  success: boolean;
  suggestedProjectName: string | null;
  services: ExtractedService[];
  unmatchedItems: string[];
  documentType: string;
  processingNotes: string;
}

async function analyzeWithGemini(documents: DocumentInput[]): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Build parts array for Gemini - supports text and inline_data (images/PDFs)
  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [];

  // Add system prompt as first text part
  parts.push({ text: SYSTEM_PROMPT });

  // Add instruction
  parts.push({
    text: `Analyze the following ${documents.length} document(s) and extract all software services, subscriptions, and billing information. Return a single consolidated JSON response.`,
  });

  // Add each document
  for (const doc of documents) {
    if (doc.type === "image") {
      // For images and PDFs, use inline_data
      const mimeType = doc.mimeType || "image/png";
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: doc.content, // Already base64 encoded
        },
      });

      if (doc.filename) {
        parts.push({ text: `[Document: ${doc.filename}]` });
      }
    } else {
      // For text content (CSV, plain text, etc.)
      parts.push({
        text: `[Document${doc.filename ? `: ${doc.filename}` : ""}]\n${doc.content}`,
      });
    }
  }

  // Add final instruction
  parts.push({ text: "Analyze these documents and extract all service/subscription information. Return valid JSON only, no markdown formatting." });

  // Call Gemini 3.0 Flash API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", response.status, errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!outputText) {
    console.error("No output from Gemini:", JSON.stringify(result));
    throw new Error("No output from Gemini");
  }

  console.log("Gemini raw response:", outputText.substring(0, 500));

  // Parse the JSON response
  try {
    let cleanedOutput = outputText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedOutput.startsWith("```json")) {
      cleanedOutput = cleanedOutput.slice(7);
    }
    if (cleanedOutput.startsWith("```")) {
      cleanedOutput = cleanedOutput.slice(3);
    }
    if (cleanedOutput.endsWith("```")) {
      cleanedOutput = cleanedOutput.slice(0, -3);
    }

    // Try to extract JSON object from response
    const jsonMatch = cleanedOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: AnalysisResult = JSON.parse(jsonMatch[0]);
      return parsed;
    }

    // If no JSON object found, try parsing the whole thing
    const parsed: AnalysisResult = JSON.parse(cleanedOutput.trim());
    return parsed;
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", outputText);
    return {
      success: false,
      suggestedProjectName: null,
      services: [],
      unmatchedItems: [],
      documentType: "other",
      processingNotes: `Failed to parse AI response: ${parseError}`,
    };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the authorization header to verify the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the user's JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const body = await req.json();
    const { documents, workspaceId } = body as {
      documents: DocumentInput[];
      workspaceId?: string;
    };

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: "No documents provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate document count (limit to 10 documents per request)
    if (documents.length > 10) {
      return new Response(
        JSON.stringify({ error: "Maximum 10 documents per request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Analyze documents with Gemini 3.0 Flash
    console.log(`Analyzing ${documents.length} documents for user ${user.id}`);
    const analysisResult = await analyzeWithGemini(documents);

    // Log the analysis for audit purposes
    if (workspaceId) {
      await supabase.from("audit_logs").insert({
        workspace_id: workspaceId,
        user_id: user.id,
        action: "documents_analyzed",
        entity_type: "project",
        entity_id: null,
        metadata: {
          document_count: documents.length,
          services_detected: analysisResult.services.length,
          success: analysisResult.success,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: analysisResult,
        serviceRegistry: SERVICE_REGISTRY.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
        })),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error in analyze-documents function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
