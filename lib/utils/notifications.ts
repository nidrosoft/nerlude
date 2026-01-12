import { SupabaseClient } from '@supabase/supabase-js';

// Database-allowed notification types (from check constraint)
export type NotificationType = 'renewal' | 'cost_alert' | 'team' | 'system';

// Sub-types stored in metadata.subtype for more specific categorization
export type NotificationSubtype = 
  | 'renewal_reminder'
  | 'renewal_urgent'
  | 'member_invited'
  | 'member_joined'
  | 'member_removed'
  | 'member_role_changed'
  | 'project_shared'
  | 'project_archived'
  | 'project_restored'
  | 'service_added'
  | 'service_removed'
  | 'credential_accessed';

export type NotificationPriority = 'high' | 'medium' | 'low';

interface CreateNotificationParams {
  supabase: SupabaseClient;
  userId: string;
  workspaceId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority?: NotificationPriority;
}

/**
 * Creates a notification for a user
 */
export async function createNotification({
  supabase,
  userId,
  workspaceId,
  type,
  title,
  message,
  data = {},
}: CreateNotificationParams) {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      workspace_id: workspaceId,
      type,
      title,
      message,
      data,
    });

    if (error) {
      console.error('Failed to create notification:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
}

/**
 * Creates notifications for multiple users (e.g., all workspace members)
 */
export async function createBulkNotifications({
  supabase,
  userIds,
  workspaceId,
  type,
  title,
  message,
  data = {},
}: Omit<CreateNotificationParams, 'userId'> & { userIds: string[] }) {
  try {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      workspace_id: workspaceId,
      type,
      title,
      message,
      data,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) {
      console.error('Failed to create bulk notifications:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return { success: false, error };
  }
}

/**
 * Get notification priority based on type and subtype
 */
export function getNotificationPriority(type: NotificationType, subtype?: NotificationSubtype): NotificationPriority {
  // Check subtype first for more specific priority
  if (subtype === 'renewal_urgent' || subtype === 'member_removed') {
    return 'high';
  }
  if (subtype === 'renewal_reminder' || subtype === 'member_invited' || subtype === 'member_role_changed' || subtype === 'project_shared') {
    return 'medium';
  }
  
  // Fallback to type-based priority
  switch (type) {
    case 'renewal':
      return 'high';
    case 'team':
      return 'medium';
    default:
      return 'low';
  }
}

/**
 * Format renewal notification based on days until expiry
 */
export function formatRenewalNotification(
  serviceName: string,
  serviceType: string,
  daysUntilExpiry: number,
  projectName?: string
): { type: NotificationType; subtype: NotificationSubtype; title: string; message: string } {
  const isUrgent = daysUntilExpiry <= 7;
  const subtype: NotificationSubtype = isUrgent ? 'renewal_urgent' : 'renewal_reminder';
  
  let title: string;
  let message: string;

  if (daysUntilExpiry <= 0) {
    title = `${serviceName} has expired!`;
    message = `Your ${serviceType} ${serviceName}${projectName ? ` in ${projectName}` : ''} has expired. Renew immediately to avoid service disruption.`;
  } else if (daysUntilExpiry === 1) {
    title = `${serviceName} expires tomorrow!`;
    message = `Your ${serviceType} ${serviceName}${projectName ? ` in ${projectName}` : ''} expires tomorrow. Renew now to avoid service disruption.`;
  } else if (daysUntilExpiry <= 7) {
    title = `${serviceName} expires in ${daysUntilExpiry} days`;
    message = `Your ${serviceType} ${serviceName}${projectName ? ` in ${projectName}` : ''} is expiring soon. Consider renewing to avoid service disruption.`;
  } else {
    title = `${serviceName} renewal coming up`;
    message = `Your ${serviceType} ${serviceName}${projectName ? ` in ${projectName}` : ''} will renew in ${daysUntilExpiry} days.`;
  }

  return { type: 'renewal', subtype, title, message };
}
