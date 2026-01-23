import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { 
  encryptWorkspaceCredentials, 
  decryptWorkspaceCredentials 
} from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; serviceId: string; credentialId: string }> };

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
): Promise<{ hasAccess: boolean; workspaceId: string | null; role: string | null }> {
  const { data: project } = await supabase
    .from('projects')
    .select('workspace_id')
    .eq('id', projectId)
    .single();

  if (!project?.workspace_id) {
    return { hasAccess: false, workspaceId: null, role: null };
  }

  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', project.workspace_id)
    .eq('user_id', userId)
    .single();

  return {
    hasAccess: !!member,
    workspaceId: project.workspace_id,
    role: member?.role || null,
  };
}

// GET /api/projects/[id]/services/[serviceId]/credentials/[credentialId] - Get single credential
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const { id: projectId, serviceId, credentialId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this project
    const { hasAccess, workspaceId } = await verifyProjectAccess(supabase, user.id, projectId);
    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify service belongs to this project
    const { data: service } = await supabase
      .from('project_services')
      .select('id')
      .eq('id', serviceId)
      .eq('project_id', projectId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Get the credential
    const { data: credential, error } = await supabase
      .from('service_credentials')
      .select('*')
      .eq('id', credentialId)
      .eq('project_service_id', serviceId)
      .single();

    if (error || !credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    // Get workspace encryption key ID and decrypt
    const workspaceKeyId = await getWorkspaceKeyId(supabase, projectId);

    let decryptedCredentials: Record<string, unknown> | null = null;
    try {
      decryptedCredentials = await decryptWorkspaceCredentials(
        credential.credentials_encrypted,
        workspaceKeyId
      );
    } catch {
      // Try JSON parse for legacy data
      try {
        decryptedCredentials = JSON.parse(credential.credentials_encrypted);
      } catch {
        decryptedCredentials = null;
      }
    }

    // Log credential access for audit
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'credential_viewed' as unknown as string,
      entity_type: 'credential',
      entity_id: credentialId,
      metadata: {
        service_id: serviceId,
        project_id: projectId,
      },
    });

    return NextResponse.json({
      ...credential,
      credentials: decryptedCredentials,
      credentials_encrypted: undefined,
    });
  } catch (error) {
    console.error('Get credential error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id]/services/[serviceId]/credentials/[credentialId] - Update credential
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const { id: projectId, serviceId, credentialId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this project
    const { hasAccess, workspaceId, role } = await verifyProjectAccess(supabase, user.id, projectId);
    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify service belongs to this project
    const { data: service } = await supabase
      .from('project_services')
      .select('id, name')
      .eq('id', serviceId)
      .eq('project_id', projectId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Verify credential exists and belongs to this service
    const { data: existingCredential } = await supabase
      .from('service_credentials')
      .select('id')
      .eq('id', credentialId)
      .eq('project_service_id', serviceId)
      .single();

    if (!existingCredential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // Handle credential data update
    if (body.credentials || body.fields) {
      const credentialData = body.credentials || body.fields;
      const workspaceKeyId = await getWorkspaceKeyId(supabase, projectId);
      
      try {
        updates.credentials_encrypted = await encryptWorkspaceCredentials(
          credentialData,
          workspaceKeyId
        );
      } catch {
        return NextResponse.json(
          { error: 'Failed to encrypt credentials' },
          { status: 500 }
        );
      }
    }

    // Handle other fields
    const allowedFields = ['environment', 'credential_type', 'key_name', 'description', 'rotation_reminder_days'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('service_credentials')
      .update(updates)
      .eq('id', credentialId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'credential_updated',
      entity_type: 'credential',
      entity_id: credentialId,
      metadata: {
        service_id: serviceId,
        service_name: service.name,
        project_id: projectId,
        updated_fields: Object.keys(updates).filter(k => k !== 'updated_at' && k !== 'credentials_encrypted'),
      },
    });

    return NextResponse.json({
      id: data.id,
      environment: data.environment,
      credential_type: data.credential_type,
      key_name: data.key_name,
      description: data.description,
      updated_at: data.updated_at,
    });
  } catch (error) {
    console.error('Update credential error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/services/[serviceId]/credentials/[credentialId] - Delete credential
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const { id: projectId, serviceId, credentialId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this project
    const { hasAccess, workspaceId, role } = await verifyProjectAccess(supabase, user.id, projectId);
    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only owners and admins can delete credentials
    if (!role || !['owner', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden - only owners and admins can delete credentials' }, { status: 403 });
    }

    // Verify service belongs to this project
    const { data: service } = await supabase
      .from('project_services')
      .select('id, name')
      .eq('id', serviceId)
      .eq('project_id', projectId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Get credential info before deletion for audit
    const { data: credential } = await supabase
      .from('service_credentials')
      .select('key_name, credential_type, environment')
      .eq('id', credentialId)
      .eq('project_service_id', serviceId)
      .single();

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    // Delete the credential
    const { error } = await supabase
      .from('service_credentials')
      .delete()
      .eq('id', credentialId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'credential_deleted',
      entity_type: 'credential',
      entity_id: credentialId,
      metadata: {
        service_id: serviceId,
        service_name: service.name,
        project_id: projectId,
        key_name: credential.key_name,
        credential_type: credential.credential_type,
        environment: credential.environment,
      },
    });

    return NextResponse.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('Delete credential error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
