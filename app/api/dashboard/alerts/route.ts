import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/dashboard/alerts - Get user alerts (upcoming renewals, cost alerts, etc.)
export async function GET(request: NextRequest) {
  try {
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
      return NextResponse.json([]);
    }

    // Get projects (exclude archived)
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name')
      .in('workspace_id', workspaceIds)
      .neq('status', 'archived');

    const projectIds = projects?.map(p => p.id) || [];
    const projectMap = new Map(projects?.map(p => [p.id, p.name]) || []);

    const alerts: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      severity: string;
      projectId?: string;
      projectName?: string;
      serviceId?: string;
      serviceName?: string;
      date?: string;
    }> = [];

    if (projectIds.length > 0) {
      // Get services with upcoming renewals
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data: services } = await supabase
        .from('project_services')
        .select('id, name, project_id, renewal_date, cost_amount, cost_frequency')
        .in('project_id', projectIds)
        .not('renewal_date', 'is', null)
        .gte('renewal_date', now.toISOString().split('T')[0])
        .lte('renewal_date', thirtyDaysFromNow.toISOString().split('T')[0]);

      services?.forEach(service => {
        const renewalDate = new Date(service.renewal_date!);
        const daysUntil = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        alerts.push({
          id: `renewal-${service.id}`,
          type: 'renewal',
          title: `${service.name} renewal in ${daysUntil} days`,
          message: `Your ${service.name} subscription will renew on ${renewalDate.toLocaleDateString()}`,
          severity: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low',
          projectId: service.project_id || undefined,
          projectName: service.project_id ? projectMap.get(service.project_id) : undefined,
          serviceId: service.id,
          serviceName: service.name,
          date: service.renewal_date || undefined,
        });
      });
    }

    // Sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    alerts.sort((a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Dashboard alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
