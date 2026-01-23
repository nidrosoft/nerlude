import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/dashboard/stats - Get aggregated dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    // Get user's workspaces
    const { data: memberships } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);

    let workspaceIds = memberships?.map(m => m.workspace_id) || [];

    // Filter to specific workspace if provided
    if (workspaceId && workspaceIds.includes(workspaceId)) {
      workspaceIds = [workspaceId];
    }

    if (workspaceIds.length === 0) {
      return NextResponse.json({
        totalProjects: 0,
        totalServices: 0,
        totalMonthlyCost: 0,
        upcomingRenewals: 0,
        activeAlerts: 0,
      });
    }

    // Get projects count (exclude archived)
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('workspace_id', workspaceIds)
      .neq('status', 'archived');

    // Get project IDs for service queries
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .in('workspace_id', workspaceIds)
      .neq('status', 'archived');

    const projectIds = projects?.map(p => p.id) || [];

    // Get services stats
    let totalServices = 0;
    let totalMonthlyCost = 0;
    let upcomingRenewals = 0;

    if (projectIds.length > 0) {
      const { data: services } = await supabase
        .from('project_services')
        .select('cost_amount, cost_frequency, renewal_date')
        .in('project_id', projectIds);

      if (services) {
        totalServices = services.length;

        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        services.forEach(service => {
          // Calculate monthly cost
          if (service.cost_frequency === 'monthly') {
            totalMonthlyCost += Number(service.cost_amount) || 0;
          } else if (service.cost_frequency === 'yearly') {
            totalMonthlyCost += (Number(service.cost_amount) || 0) / 12;
          }

          // Check upcoming renewals
          if (service.renewal_date) {
            const renewalDate = new Date(service.renewal_date);
            if (renewalDate >= now && renewalDate <= thirtyDaysFromNow) {
              upcomingRenewals++;
            }
          }
        });
      }
    }

    // Get unread notifications count
    const { count: alertCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    return NextResponse.json({
      totalProjects: projectCount || 0,
      totalServices,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      upcomingRenewals,
      activeAlerts: alertCount || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
