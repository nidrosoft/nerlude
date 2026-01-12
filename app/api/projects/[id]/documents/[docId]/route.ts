import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; docId: string }> };

// GET /api/projects/[id]/documents/[docId] - Get document
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id, docId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('id', docId)
      .eq('project_id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id]/documents/[docId] - Update document
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, docId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['title', 'content', 'doc_type', 'icon', 'emoji'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    // Get workspace_id from project
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('project_documents')
      .update(filteredUpdates)
      .eq('id', docId)
      .eq('project_id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for document update
    if (data && project?.workspace_id) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'document_updated',
        entity_type: 'document',
        entity_id: docId,
        metadata: { 
          project_id: id,
          name: data.title,
          updated_fields: Object.keys(filteredUpdates).filter(k => k !== 'updated_at')
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/documents/[docId] - Delete document
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, docId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document and project info before deletion for audit log
    const { data: doc } = await supabase
      .from('project_documents')
      .select('title, doc_type')
      .eq('id', docId)
      .eq('project_id', id)
      .single();

    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('project_documents')
      .delete()
      .eq('id', docId)
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for document deletion
    if (project?.workspace_id) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'document_deleted',
        entity_type: 'document',
        entity_id: docId,
        metadata: { 
          project_id: id,
          name: doc?.title || 'Untitled document',
          doc_type: doc?.doc_type
        },
      });
    }

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
