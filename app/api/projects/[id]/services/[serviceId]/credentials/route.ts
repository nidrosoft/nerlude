import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';
import { 
  encryptWorkspaceCredentials, 
  decryptWorkspaceCredentials 
} from '@/lib/encryption';

type Params = { params: Promise<{ id: string; serviceId: string }> };

/**
 * Helper to get workspace encryption key ID for a service
 */
async function getWorkspaceKeyId(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  projectId: string
): Promise<string | null> {
  const { data: project } = await supabase
    .from('projects')
    .select('workspace_id')
    .eq('id', projectId)
    .single();

  if (!project?.workspace_id) return null;

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('encryption_key_id')
    .eq('id', project.workspace_id)
    .single();

  return workspace?.encryption_key_id || null;
}

/**
 * Verify user has access to the project
 */
async function verifyProjectAccess(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  projectId: string
): Promise<boolean> {
  // Check if user is a member of the project's workspace
  const { data: project } = await supabase
    .from('projects')
    .select('workspace_id')
    .eq('id', projectId)
    .single();

  if (!project?.workspace_id) return false;

  const { data: member } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', project.workspace_id)
    .eq('user_id', userId)
    .single();

  return !!member;
}

// GET /api/projects/[id]/services/[serviceId]/credentials - Get credentials
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: projectId, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this project
    const hasAccess = await verifyProjectAccess(supabase, user.id, projectId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify service belongs to this project
    const { data: service } = await supabase
      .from('project_services')
      .select('id, project_id')
      .eq('id', serviceId)
      .eq('project_id', projectId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
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

    // Get workspace encryption key ID
    const workspaceKeyId = await getWorkspaceKeyId(supabase, projectId);

    // Decrypt credentials before returning
    const decryptedData = await Promise.all(
      (data || []).map(async (cred) => {
        try {
          const decrypted = await decryptWorkspaceCredentials(
            cred.credentials_encrypted,
            workspaceKeyId
          );
          return {
            ...cred,
            credentials: decrypted,
            // Remove encrypted field from response
            credentials_encrypted: undefined,
          };
        } catch (decryptError) {
          // If decryption fails (e.g., old unencrypted data), try to parse as JSON
          console.error('Decryption failed, trying JSON parse:', decryptError);
          try {
            const parsed = JSON.parse(cred.credentials_encrypted);
            return {
              ...cred,
              credentials: parsed,
              credentials_encrypted: undefined,
            };
          } catch {
            // Return without credentials if both fail
            return {
              ...cred,
              credentials: null,
              credentials_encrypted: undefined,
              decryption_error: true,
            };
          }
        }
      })
    );

    // Log credential access for audit
    const { data: projectData } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', projectId)
      .single();

    if (projectData?.workspace_id) {
      await supabase.from('audit_logs').insert({
        workspace_id: projectData.workspace_id,
        user_id: user.id,
        action: 'credential_viewed' as unknown as string,
        entity_type: 'credential',
        entity_id: serviceId,
        metadata: {
          service_id: serviceId,
          project_id: projectId,
          environment: environment || 'all',
          credential_count: decryptedData.length,
        },
      });
    }

    return NextResponse.json(decryptedData);
  } catch (error) {
    console.error('Get credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/services/[serviceId]/credentials - Add credentials
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: projectId, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this project
    const hasAccess = await verifyProjectAccess(supabase, user.id, projectId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify service belongs to this project
    const { data: service } = await supabase
      .from('project_services')
      .select('id, name, project_id')
      .eq('id', serviceId)
      .eq('project_id', projectId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Support both old format (credentials_encrypted) and new format (type, fields)
    let environment: string;
    let credentialData: Record<string, unknown>;
    let credential_type: string | undefined;
    let key_name: string | undefined;
    let description: string | undefined;

    if (body.type && body.fields) {
      // New format from AddCredentialModal
      environment = body.environment;
      credential_type = body.type;
      description = body.description;
      credentialData = body.fields;
      
      // Get the first field value as the key name for display
      const firstFieldKey = Object.keys(body.fields)[0];
      key_name = body.fields[firstFieldKey] || body.type;
    } else if (body.credentials && typeof body.credentials === 'object') {
      // Object format
      environment = body.environment;
      credentialData = body.credentials;
    } else {
      return NextResponse.json(
        { error: 'Invalid credential format. Provide type+fields or credentials object' },
        { status: 400 }
      );
    }

    if (!environment) {
      return NextResponse.json(
        { error: 'environment is required' },
        { status: 400 }
      );
    }

    // Get workspace encryption key ID and encrypt
    const workspaceKeyId = await getWorkspaceKeyId(supabase, projectId);
    
    let credentials_encrypted: string;
    try {
      credentials_encrypted = await encryptWorkspaceCredentials(
        credentialData,
        workspaceKeyId
      );
    } catch (encryptError) {
      console.error('Encryption error:', encryptError);
      return NextResponse.json(
        { error: 'Failed to encrypt credentials. Please ensure CREDENTIAL_ENCRYPTION_KEY is configured.' },
        { status: 500 }
      );
    }

    // Insert new credential
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

    // Get project for audit log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', projectId)
      .single();

    // Create audit log for credential creation
    if (project?.workspace_id) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'credential_created',
        entity_type: 'credential',
        entity_id: data.id,
        metadata: { 
          name: key_name || service.name,
          project_id: projectId,
          service_id: serviceId,
          environment,
          credential_type,
        },
      });
    }

    // Return success without exposing encrypted data
    return NextResponse.json({
      id: data.id,
      environment: data.environment,
      credential_type: data.credential_type,
      key_name: data.key_name,
      description: data.description,
      created_at: data.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Add credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
