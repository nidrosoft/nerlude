import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects - List projects (filtered by workspace)
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

    const workspaceIds = memberships?.map(m => m.workspace_id) || [];

    if (workspaceIds.length === 0) {
      return NextResponse.json([]);
    }

    let query = supabase
      .from('projects')
      .select(`
        *,
        workspace:workspaces (id, name, slug),
        services:project_services (count)
      `)
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false });

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    // Filter by status if provided
    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Service registry mapping - maps service IDs to their details
// Valid category_ids: infrastructure, identity, payments, communications, analytics, domains, distribution, devtools, other
const SERVICE_REGISTRY: Record<string, { name: string; category_id: string; logo_url?: string }> = {
  vercel: { name: 'Vercel', category_id: 'infrastructure', logo_url: '/images/services/vercel.svg' },
  supabase: { name: 'Supabase', category_id: 'infrastructure', logo_url: '/images/services/supabase.svg' },
  clerk: { name: 'Clerk', category_id: 'identity', logo_url: '/images/services/clerk.svg' },
  stripe: { name: 'Stripe', category_id: 'payments', logo_url: '/images/services/stripe.svg' },
  resend: { name: 'Resend', category_id: 'communications', logo_url: '/images/services/resend.svg' },
  posthog: { name: 'PostHog', category_id: 'analytics', logo_url: '/images/services/posthog.svg' },
  sentry: { name: 'Sentry', category_id: 'devtools', logo_url: '/images/services/sentry.svg' },
  cloudinary: { name: 'Cloudinary', category_id: 'infrastructure', logo_url: '/images/services/cloudinary.svg' },
  railway: { name: 'Railway', category_id: 'infrastructure', logo_url: '/images/services/railway.svg' },
  redis: { name: 'Redis Cloud', category_id: 'infrastructure', logo_url: '/images/services/redis.svg' },
};

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('=== PROJECT CREATION REQUEST ===');
    console.log('Full body received:', JSON.stringify(body, null, 2));
    const { workspace_id, name, description, icon, type, services, template_id } = body;
    console.log('Extracted services:', services);

    if (!workspace_id || !name || !type) {
      return NextResponse.json(
        { error: 'workspace_id, name, and type are required' },
        { status: 400 }
      );
    }

    // Check workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    if (!['owner', 'admin', 'member'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        workspace_id,
        name,
        description,
        icon: icon || '🚀',
        type,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Add creator as project owner
    await supabase
      .from('project_members')
      .insert({
        project_id: data.id,
        user_id: user.id,
        role: 'owner',
      });

    // Log activity for project creation
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        workspace_id,
        user_id: user.id,
        action: 'project_created',
        entity_type: 'project',
        entity_id: data.id,
        metadata: { name, type, icon, template_id },
      });
    
    if (auditError) {
      console.error('Error logging project creation:', auditError);
    }

    // Create services if provided - use admin client to bypass RLS
    console.log('Services received:', services);
    if (services && Array.isArray(services) && services.length > 0) {
      const serviceRecords = services
        .filter((serviceId: string) => SERVICE_REGISTRY[serviceId])
        .map((serviceId: string) => {
          const serviceInfo = SERVICE_REGISTRY[serviceId];
          return {
            project_id: data.id,
            registry_id: serviceId,
            category_id: serviceInfo.category_id,
            name: serviceInfo.name,
            custom_logo_url: serviceInfo.logo_url,
            cost_amount: 0,
            cost_frequency: 'monthly',
            currency: 'USD',
            status: 'active',
            created_by: user.id,
          };
        });

      console.log('Service records to insert:', serviceRecords);
      
      if (serviceRecords.length > 0) {
        // Insert services using the authenticated user's supabase client
        const { data: insertedServices, error: servicesError } = await supabase
          .from('project_services')
          .insert(serviceRecords)
          .select();

        if (servicesError) {
          console.error('Error creating services:', servicesError);
          console.error('Service records attempted:', JSON.stringify(serviceRecords, null, 2));
        } else {
          console.log('Services created successfully:', insertedServices);
          
          // Log activity for each service added
          if (insertedServices && insertedServices.length > 0) {
            const auditLogs = insertedServices.map((service: any) => ({
              workspace_id,
              user_id: user.id,
              action: 'service_added',
              entity_type: 'service',
              entity_id: service.id,
              metadata: { name: service.name, registry_id: service.registry_id, category_id: service.category_id },
            }));
            
            const { error: auditLogsError } = await supabase.from('audit_logs').insert(auditLogs);
            if (auditLogsError) {
              console.error('Error logging service additions:', auditLogsError);
            }
          }
        }
      }
    } else {
      console.log('No services to create - services array:', services);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
