import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ServiceWithRenewal {
  id: string;
  name: string;
  renewal_date: string;
  project_id: string;
  project: {
    id: string;
    name: string;
    workspace_id: string;
    created_by: string;
  };
}

Deno.serve(async (req: Request) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get services with upcoming renewals (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: services, error: servicesError } = await supabase
      .from("project_services")
      .select(`
        id,
        name,
        renewal_date,
        project_id,
        project:projects (
          id,
          name,
          workspace_id,
          created_by
        )
      `)
      .not("renewal_date", "is", null)
      .lte("renewal_date", thirtyDaysFromNow.toISOString())
      .gte("renewal_date", new Date().toISOString());

    if (servicesError) {
      console.error("Error fetching services:", servicesError);
      return new Response(JSON.stringify({ error: servicesError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const notifications: Array<{
      user_id: string;
      workspace_id: string;
      type: string;
      title: string;
      message: string;
      data: Record<string, unknown>;
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const service of (services as ServiceWithRenewal[]) || []) {
      if (!service.project) continue;

      const renewalDate = new Date(service.renewal_date);
      renewalDate.setHours(0, 0, 0, 0);
      const daysUntilRenewal = Math.ceil(
        (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if we should send a notification (at 30, 14, 7, 3, 1, 0 days)
      const notificationDays = [30, 14, 7, 3, 1, 0];
      if (!notificationDays.includes(daysUntilRenewal)) continue;

      // Check if we already sent a notification for this service at this interval
      const { data: existingNotification } = await supabase
        .from("notifications")
        .select("id")
        .eq("type", daysUntilRenewal <= 7 ? "renewal_urgent" : "renewal_reminder")
        .eq("data->service_id", service.id)
        .eq("data->days_until_renewal", daysUntilRenewal)
        .single();

      if (existingNotification) continue;

      // Determine notification type and message
      const isUrgent = daysUntilRenewal <= 7;
      const type = isUrgent ? "renewal_urgent" : "renewal_reminder";

      let title: string;
      let message: string;

      if (daysUntilRenewal === 0) {
        title = `${service.name} renews today!`;
        message = `Your service ${service.name} in ${service.project.name} renews today.`;
      } else if (daysUntilRenewal === 1) {
        title = `${service.name} renews tomorrow!`;
        message = `Your service ${service.name} in ${service.project.name} renews tomorrow.`;
      } else if (daysUntilRenewal <= 7) {
        title = `${service.name} renews in ${daysUntilRenewal} days`;
        message = `Your service ${service.name} in ${service.project.name} is renewing soon.`;
      } else {
        title = `${service.name} renewal coming up`;
        message = `Your service ${service.name} in ${service.project.name} will renew in ${daysUntilRenewal} days.`;
      }

      // Get all workspace members to notify
      const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", service.project.workspace_id);

      for (const member of members || []) {
        notifications.push({
          user_id: member.user_id,
          workspace_id: service.project.workspace_id,
          type,
          title,
          message,
          data: {
            service_id: service.id,
            service_name: service.name,
            project_id: service.project.id,
            project_name: service.project.name,
            renewal_date: service.renewal_date,
            days_until_renewal: daysUntilRenewal,
          },
        });
      }
    }

    // Insert all notifications
    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (insertError) {
        console.error("Error inserting notifications:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationsCreated: notifications.length,
        servicesChecked: services?.length || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in check-renewals function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
