// Shared CORS configuration for Edge Functions
// In production, restrict to your domain

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://nerlude.io",
  "https://www.nerlude.io",
  // Add staging domains as needed
];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  
  // Check if origin is allowed
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: Request): Response | null {
  if (request.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: getCorsHeaders(request) 
    });
  }
  return null;
}
