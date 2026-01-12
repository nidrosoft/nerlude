import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

interface DocumentInput {
  type: "image" | "text" | "pdf";
  content: string;
  filename?: string;
  mimeType?: string;
}

interface RequestBody {
  documents: DocumentInput[];
  workspaceId?: string;
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
    const { documents, workspaceId } = body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: "No documents provided" },
        { status: 400 }
      );
    }

    if (documents.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 documents per request" },
        { status: 400 }
      );
    }

    // Validate each document
    for (const doc of documents) {
      if (!doc.type || !doc.content) {
        return NextResponse.json(
          { error: "Each document must have type and content" },
          { status: 400 }
        );
      }
      if (doc.type !== "image" && doc.type !== "text" && doc.type !== "pdf") {
        return NextResponse.json(
          { error: "Document type must be 'image', 'text', or 'pdf'" },
          { status: 400 }
        );
      }
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

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/analyze-documents`;

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        documents,
        workspaceId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function error:", errorText);
      return NextResponse.json(
        { error: "Failed to analyze documents", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in analyze-documents route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
