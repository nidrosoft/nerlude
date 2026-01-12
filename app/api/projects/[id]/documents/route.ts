import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/documents - List project documents
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', id)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/documents - Create document
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, doc_type, icon, emoji } = await request.json();

    if (!title || !doc_type) {
      return NextResponse.json(
        { error: 'title and doc_type are required' },
        { status: 400 }
      );
    }

    // Get workspace_id from project
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('project_documents')
      .insert({
        project_id: id,
        title,
        content: content || '',
        doc_type,
        icon,
        emoji,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for document creation
    if (data && project?.workspace_id) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'document_created',
        entity_type: 'document',
        entity_id: data.id,
        metadata: { 
          doc_type, 
          project_id: id,
          name: title 
        },
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
