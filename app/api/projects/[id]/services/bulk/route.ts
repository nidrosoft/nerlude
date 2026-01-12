import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

interface BulkServiceInput {
  registryId: string | null;
  name: string;
  categoryId: string;
  subCategoryId?: string | null;
  billing?: {
    amount: number | null;
    currency: string;
    frequency: "monthly" | "yearly" | "one-time" | null;
  };
  accountIdentifier?: string | null;
  renewalDate?: string | null;
  planName?: string | null;
  notes?: string;
}

interface RequestBody {
  services: BulkServiceInput[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, workspace_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { services } = body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: "No services provided" },
        { status: 400 }
      );
    }

    // Prepare services for insertion
    const servicesToInsert = services.map((service) => {
      // Calculate next renewal date if not provided
      let renewalDate = service.renewalDate;
      if (!renewalDate && service.billing?.frequency) {
        const now = new Date();
        if (service.billing.frequency === "monthly") {
          now.setMonth(now.getMonth() + 1);
        } else if (service.billing.frequency === "yearly") {
          now.setFullYear(now.getFullYear() + 1);
        }
        renewalDate = now.toISOString().split("T")[0];
      }

      return {
        project_id: projectId,
        registry_id: service.registryId,
        category_id: service.categoryId,
        sub_category_id: service.subCategoryId || null,
        name: service.name,
        plan: service.planName || null,
        cost_amount: service.billing?.amount || 0,
        cost_frequency: service.billing?.frequency || "monthly",
        currency: service.billing?.currency || "USD",
        renewal_date: renewalDate || null,
        notes: service.notes || null,
        created_by: user.id,
      };
    });

    // Insert all services
    const { data: insertedServices, error: insertError } = await supabase
      .from("project_services")
      .insert(servicesToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting services:", insertError);
      return NextResponse.json(
        { error: "Failed to create services", details: insertError.message },
        { status: 500 }
      );
    }

    // Create audit log for bulk import
    await supabase.from("audit_logs").insert({
      workspace_id: project.workspace_id,
      user_id: user.id,
      action: "services_bulk_imported",
      entity_type: "project",
      entity_id: projectId,
      metadata: {
        project_name: project.name,
        services_count: insertedServices?.length || 0,
        service_names: services.map((s) => s.name),
      },
    });

    return NextResponse.json({
      success: true,
      services: insertedServices,
      count: insertedServices?.length || 0,
    });
  } catch (error) {
    console.error("Error in bulk services route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
