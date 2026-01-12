import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; serviceId: string }> };

// GET /api/projects/[id]/services/[serviceId]/credentials - Get credentials
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');

    let query = supabase
      .from('service_credentials')
      .select('*')
      .eq('project_service_id', serviceId);

    if (environment) {
      query = query.eq('environment', environment);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Note: credentials_encrypted should be decrypted on the client side
    // or through a separate secure endpoint
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/services/[serviceId]/credentials - Add credentials
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Support both old format (credentials_encrypted) and new format (type, fields)
    let environment: string;
    let credentials_encrypted: string;
    let credential_type: string | undefined;
    let key_name: string | undefined;
    let description: string | undefined;

    if (body.type && body.fields) {
      // New format from AddCredentialModal
      environment = body.environment;
      credential_type = body.type;
      description = body.description;
      
      // Get the first field value as the key name for display
      const firstFieldKey = Object.keys(body.fields)[0];
      key_name = body.fields[firstFieldKey] || body.type;
      
      // For now, store fields as JSON string (in production, this should be encrypted)
      // TODO: Implement proper encryption using lib/encryption
      credentials_encrypted = JSON.stringify(body.fields);
    } else {
      // Old format
      environment = body.environment;
      credentials_encrypted = body.credentials_encrypted;
    }

    if (!environment || !credentials_encrypted) {
      return NextResponse.json(
        { error: 'environment and credentials are required' },
        { status: 400 }
      );
    }

    // Insert new credential (allow multiple per environment with different types)
    const { data, error } = await supabase
      .from('service_credentials')
      .insert({
        project_service_id: serviceId,
        environment,
        credentials_encrypted,
        credential_type,
        key_name,
        description,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get service and project for audit log
    const { data: service } = await supabase
      .from('project_services')
      .select('name, project_id')
      .eq('id', serviceId)
      .single();

    if (service && service.project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('workspace_id')
        .eq('id', service.project_id)
        .single();

      // Create audit log for credential creation
      if (project) {
        await supabase.from('audit_logs').insert({
          workspace_id: project.workspace_id,
          user_id: user.id,
          action: 'credential_created',
          entity_type: 'credential',
          entity_id: data.id,
          metadata: { 
            name: key_name || service.name,
            project_id: service.project_id,
            environment,
            credential_type,
          },
        });
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Add credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
