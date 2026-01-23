import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { createProjectSchema, validateBody } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';
import { getServiceById } from '@/registry/services';

// GET /api/projects - List projects (filtered by workspace)
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

// Helper function to get service info from the full registry
const getServiceInfo = (serviceId: string): { name: string; category_id: string; logo_url?: string } | null => {
  const service = getServiceById(serviceId);
  if (!service) return null;
  
  return {
    name: service.name,
    category_id: service.category,
    logo_url: service.logoUrl || `/images/services/${service.slug}.svg`,
  };
};

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const { data: body, error: validationError } = await validateBody(request, createProjectSchema);
    if (validationError || !body) {
      return NextResponse.json({ error: validationError || 'Invalid input' }, { status: 400 });
    }

    const { workspace_id, name, description, icon, type, services, template_id } = body;

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

    // Create services if provided
    if (services && Array.isArray(services) && services.length > 0) {
      const serviceRecords = services
        .map((serviceId: string) => {
          const serviceInfo = getServiceInfo(serviceId);
          if (!serviceInfo) return null;
          
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
        })
        .filter(Boolean);
      
      if (serviceRecords.length > 0) {
        // Insert services using the authenticated user's supabase client
        const { data: insertedServices, error: servicesError } = await supabase
          .from('project_services')
          .insert(serviceRecords)
          .select();

        if (servicesError) {
          console.error('Error creating services:', servicesError);
        } else if (insertedServices && insertedServices.length > 0) {
          // Log activity for each service added
          const auditLogs = insertedServices.map((service: { id: string; name: string; registry_id: string; category_id: string }) => ({
            workspace_id,
            user_id: user.id,
            action: 'service_added',
            entity_type: 'service',
            entity_id: service.id,
            metadata: { name: service.name, registry_id: service.registry_id, category_id: service.category_id },
          }));
          
          await supabase.from('audit_logs').insert(auditLogs);
        }
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
