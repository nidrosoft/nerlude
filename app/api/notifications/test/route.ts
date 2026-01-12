import { createServerSupabaseClient } from '@/lib/db/server';
import { createNotification } from '@/lib/utils/notifications';
import { NextResponse } from 'next/server';

// POST /api/notifications/test - Create a test notification (for development)
export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's first workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!membership || !membership.workspace_id) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 });
    }

    // Create a test notification
    const result = await createNotification({
      supabase,
      userId: user.id,
      workspaceId: membership.workspace_id as string,
      type: 'team',
      title: 'Test Notification',
      message: 'This is a test notification to verify the notification system is working correctly.',
      data: {
        subtype: 'member_invited',
        test: true,
        created_at: new Date().toISOString(),
      },
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test notification created successfully. Refresh the page to see it in the notification bell.',
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
