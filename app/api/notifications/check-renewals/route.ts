import { createServerSupabaseClient } from '@/lib/db/server';
import { NextResponse } from 'next/server';
import { Json } from '@/types/database';

// POST /api/notifications/check-renewals - Check for upcoming renewals and create notifications
export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspaces
    const { data: memberships } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ message: 'No workspaces found', notificationsCreated: 0 });
    }

    const workspaceIds = memberships.map(m => m.workspace_id);

    // Get services with upcoming renewals (within 30 days) from user's workspaces
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: services, error: servicesError } = await supabase
      .from('project_services')
      .select(`
        id,
        name,
        renewal_date,
        project_id,
        project:projects!inner (
          id,
          name,
          workspace_id,
          created_by
        )
      `)
      .not('renewal_date', 'is', null)
      .lte('renewal_date', thirtyDaysFromNow.toISOString())
      .in('project.workspace_id', workspaceIds);

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      return NextResponse.json({ error: servicesError.message }, { status: 400 });
    }

    const notifications: Array<{
      user_id: string;
      workspace_id: string;
      type: string;
      title: string;
      message: string;
      data: Json;
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const service of services || []) {
      const project = service.project as { id: string; name: string; workspace_id: string; created_by: string };
      if (!project || !service.renewal_date) continue;

      const renewalDate = new Date(service.renewal_date);
      renewalDate.setHours(0, 0, 0, 0);
      const daysUntilRenewal = Math.ceil(
        (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Skip if renewal is in the past
      if (daysUntilRenewal < 0) continue;

      // Check if we already sent a notification for this service at this interval
      const { data: existingNotification } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .contains('data', { service_id: service.id, days_until_renewal: daysUntilRenewal })
        .single();

      if (existingNotification) continue;

      // Determine notification type and message
      const isUrgent = daysUntilRenewal <= 7;
      const type = isUrgent ? 'renewal_urgent' : 'renewal_reminder';

      let title: string;
      let message: string;

      if (daysUntilRenewal === 0) {
        title = `${service.name} renews today!`;
        message = `Your service ${service.name} in ${project.name} renews today.`;
      } else if (daysUntilRenewal === 1) {
        title = `${service.name} renews tomorrow!`;
        message = `Your service ${service.name} in ${project.name} renews tomorrow.`;
      } else if (daysUntilRenewal <= 7) {
        title = `${service.name} renews in ${daysUntilRenewal} days`;
        message = `Your service ${service.name} in ${project.name} is renewing soon.`;
      } else {
        title = `${service.name} renewal coming up`;
        message = `Your service ${service.name} in ${project.name} will renew in ${daysUntilRenewal} days.`;
      }

      notifications.push({
        user_id: user.id,
        workspace_id: project.workspace_id,
        type,
        title,
        message,
        data: {
          service_id: service.id,
          service_name: service.name,
          project_id: project.id,
          project_name: project.name,
          renewal_date: service.renewal_date,
          days_until_renewal: daysUntilRenewal,
        },
      });
    }

    // Insert all notifications
    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error('Error inserting notifications:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      notificationsCreated: notifications.length,
      servicesChecked: services?.length || 0,
    });
  } catch (error) {
    console.error('Check renewals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
