import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

export const maxDuration = 120; // Allow up to 2 minutes for email sync

interface RequestBody {
  action: "create_auth_link" | "fetch_invoices";
  accountId?: string;
  daysBack?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { action, accountId, daysBack = 30, successRedirectUrl, failureRedirectUrl } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Get the user's session token to pass to the Edge Function
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: "No valid session" },
        { status: 401 }
      );
    }

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Supabase URL not configured" },
        { status: 500 }
      );
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/sync-email-invoices`;

    // Build the request body for the Edge Function
    const edgeFunctionBody: Record<string, unknown> = { action };

    if (action === "create_auth_link") {
      // For auth link creation, we need redirect URLs
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      edgeFunctionBody.successRedirectUrl = successRedirectUrl || `${baseUrl}/projects/new?email_connected=true`;
      edgeFunctionBody.failureRedirectUrl = failureRedirectUrl || `${baseUrl}/projects/new?email_connected=false`;
      edgeFunctionBody.notifyUrl = `${supabaseUrl}/functions/v1/sync-email-invoices-webhook`;
    } else if (action === "fetch_invoices") {
      if (!accountId) {
        return NextResponse.json(
          { error: "accountId is required for fetch_invoices action" },
          { status: 400 }
        );
      }
      edgeFunctionBody.accountId = accountId;
      edgeFunctionBody.daysBack = daysBack;
    }

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(edgeFunctionBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function error:", errorText);
      return NextResponse.json(
        { error: "Failed to sync emails", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in sync-email route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
