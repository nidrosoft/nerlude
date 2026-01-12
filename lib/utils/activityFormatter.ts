/**
 * Activity Formatter Utility
 * 
 * Provides human-readable, clear sentences for all 51 audit log action types.
 * Each action has a specific message format that clearly communicates what happened.
 */

export interface ActivityLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    entity_name?: string;
    project_id?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    user?: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    project?: {
        id: string;
        name: string;
        icon: string;
    };
    // For batch operations
    _batchCount?: number;
    _batchServices?: string[];
}

export interface FormattedActivity {
    title: string;
    description: string;
    icon: string;
    bg: string;
    iconColor: string;
}

/**
 * Icon configurations for each action type
 */
export const activityIcons: Record<string, { icon: string; bg: string; iconColor: string }> = {
    // Project actions
    project_created: { icon: "plus", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    project_updated: { icon: "edit", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    project_archived: { icon: "documents", bg: "bg-gray-500/10", iconColor: "fill-gray-500" },
    project_restored: { icon: "generation", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    project_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    project_duplicated: { icon: "copy", bg: "bg-purple-500/10", iconColor: "fill-purple-500" },
    
    // Service actions
    service_added: { icon: "post", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    service_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    service_removed: { icon: "card-remove", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    services_batch_added: { icon: "post", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    
    // Member/Team actions
    member_invited: { icon: "users", bg: "bg-purple-500/10", iconColor: "fill-purple-500" },
    member_removed: { icon: "profile", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    member_role_changed: { icon: "star-stroke", bg: "bg-orange-500/10", iconColor: "fill-orange-500" },
    invite_member: { icon: "users", bg: "bg-purple-500/10", iconColor: "fill-purple-500" },
    remove_member: { icon: "profile", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    change_role: { icon: "star-stroke", bg: "bg-orange-500/10", iconColor: "fill-orange-500" },
    
    // Document actions
    document_created: { icon: "task-square", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    document_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    document_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Asset actions
    asset_uploaded: { icon: "upload", bg: "bg-teal-500/10", iconColor: "fill-teal-500" },
    asset_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    asset_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Folder actions
    folder_created: { icon: "folder", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    folder_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    folder_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Credential actions
    credential_created: { icon: "key", bg: "bg-indigo-500/10", iconColor: "fill-indigo-500" },
    credential_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    credential_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    copy_credential: { icon: "copy", bg: "bg-cyan-500/10", iconColor: "fill-cyan-500" },
    
    // Stack actions
    stack_created: { icon: "layers", bg: "bg-violet-500/10", iconColor: "fill-violet-500" },
    stack_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    stack_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Workspace actions
    workspace_created: { icon: "home", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    workspace_updated: { icon: "edit", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    settings_changed: { icon: "gear", bg: "bg-cyan-500/10", iconColor: "fill-cyan-500" },
    
    // Note actions
    note_created: { icon: "note", bg: "bg-yellow-500/10", iconColor: "fill-yellow-500" },
    note_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    note_deleted: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Billing actions
    billing_updated: { icon: "wallet", bg: "bg-purple-500/10", iconColor: "fill-purple-500" },
    subscription_changed: { icon: "card", bg: "bg-emerald-500/10", iconColor: "fill-emerald-500" },
    
    // Auth/Security actions
    login: { icon: "login", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    logout: { icon: "logout", bg: "bg-gray-500/10", iconColor: "fill-gray-500" },
    password_changed: { icon: "lock", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    two_factor_enabled: { icon: "shield", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    two_factor_disabled: { icon: "shield", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    api_key_created: { icon: "key", bg: "bg-indigo-500/10", iconColor: "fill-indigo-500" },
    
    // System/Integration actions
    alert_triggered: { icon: "bell", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    alert_dismissed: { icon: "bell", bg: "bg-gray-500/10", iconColor: "fill-gray-500" },
    data_exported: { icon: "download", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    integration_connected: { icon: "link", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    integration_disconnected: { icon: "link", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    
    // Generic actions
    create: { icon: "plus", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    update: { icon: "edit", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    delete: { icon: "trash", bg: "bg-red-500/10", iconColor: "fill-red-500" },
    view: { icon: "eye", bg: "bg-gray-500/10", iconColor: "fill-gray-500" },
};

// Default fallback icon
export const defaultActivityIcon = { icon: "bulb", bg: "bg-gray-500/10", iconColor: "fill-gray-500" };

/**
 * Format an activity log into a human-readable message
 * 
 * @param log - The activity log entry
 * @returns Formatted activity with title, description, and icon info
 */
export function formatActivityMessage(log: ActivityLog): FormattedActivity {
    const userName = log.user?.name || 'Someone';
    const entityName = (log.metadata as any)?.name || log.entity_name || '';
    const projectName = log.project?.name || '';
    const iconConfig = activityIcons[log.action] || defaultActivityIcon;
    
    // Helper to get project context
    const inProject = projectName ? ` in "${projectName}"` : '';
    const forProject = projectName ? ` for "${projectName}"` : '';
    
    // ============================================
    // PROJECT ACTIONS
    // ============================================
    
    if (log.action === 'project_created') {
        const name = entityName || (log.metadata as any)?.name || projectName;
        return {
            title: `${userName} created a new project`,
            description: name ? `Created "${name}" and set up the project workspace` : 'New project workspace initialized',
            ...iconConfig,
        };
    }
    
    if (log.action === 'project_updated') {
        return {
            title: `${userName} updated project settings`,
            description: projectName 
                ? `Modified configuration for "${projectName}"` 
                : 'Project settings have been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'project_archived') {
        return {
            title: `${userName} archived a project`,
            description: projectName 
                ? `"${projectName}" has been moved to archives` 
                : 'Project moved to archives for safekeeping',
            ...iconConfig,
        };
    }
    
    if (log.action === 'project_restored') {
        return {
            title: `${userName} restored a project`,
            description: projectName 
                ? `"${projectName}" has been restored from archives` 
                : 'Project restored and is now active again',
            ...iconConfig,
        };
    }
    
    if (log.action === 'project_deleted') {
        return {
            title: `${userName} permanently deleted a project`,
            description: entityName 
                ? `"${entityName}" and all its data have been removed` 
                : 'Project and associated data permanently removed',
            ...iconConfig,
        };
    }
    
    if (log.action === 'project_duplicated') {
        return {
            title: `${userName} duplicated a project`,
            description: projectName 
                ? `Created a copy of "${projectName}" with all settings` 
                : 'Project duplicated with all configurations',
            ...iconConfig,
        };
    }
    
    // ============================================
    // SERVICE ACTIONS
    // ============================================
    
    if (log.action === 'services_batch_added' && log._batchCount) {
        const count = log._batchCount;
        const serviceList = log._batchServices?.slice(0, 3).join(', ');
        const moreCount = log._batchServices && log._batchServices.length > 3 
            ? ` and ${log._batchServices.length - 3} more` 
            : '';
        return {
            title: `${userName} added ${count} services${forProject}`,
            description: serviceList 
                ? `Added ${serviceList}${moreCount} during project setup` 
                : `Configured ${count} services for the project`,
            ...activityIcons.services_batch_added,
        };
    }
    
    if (log.action === 'service_added') {
        return {
            title: `${userName} added ${entityName || 'a new service'}${inProject}`,
            description: entityName 
                ? `"${entityName}" has been integrated and configured${forProject}` 
                : `New service integrated${forProject}`,
            ...iconConfig,
        };
    }
    
    if (log.action === 'service_updated') {
        return {
            title: `${userName} updated ${entityName || 'service'} settings`,
            description: entityName 
                ? `Configuration changes made to "${entityName}"${inProject}` 
                : `Service configuration updated${inProject}`,
            ...iconConfig,
        };
    }
    
    if (log.action === 'service_removed') {
        return {
            title: `${userName} removed ${entityName || 'a service'}${inProject}`,
            description: entityName 
                ? `"${entityName}" has been disconnected and removed` 
                : 'Service disconnected from the project',
            ...iconConfig,
        };
    }
    
    // ============================================
    // MEMBER/TEAM ACTIONS
    // ============================================
    
    if (log.action === 'member_invited' || log.action === 'invite_member') {
        const invitee = entityName || (log.metadata as any)?.email || '';
        return {
            title: `${userName} invited a new team member`,
            description: invitee 
                ? `Sent an invitation to "${invitee}" to join the workspace` 
                : 'A new member invitation has been sent',
            ...iconConfig,
        };
    }
    
    if (log.action === 'member_removed' || log.action === 'remove_member') {
        const removedMember = entityName || (log.metadata as any)?.member_name || '';
        return {
            title: `${userName} removed a team member`,
            description: removedMember 
                ? `"${removedMember}" has been removed from the workspace` 
                : 'A team member has been removed from the workspace',
            ...iconConfig,
        };
    }
    
    if (log.action === 'member_role_changed' || log.action === 'change_role') {
        const memberName = entityName || (log.metadata as any)?.member_name || '';
        const newRole = (log.metadata as any)?.new_role || (log.metadata as any)?.role || '';
        return {
            title: `${userName} changed a member's role`,
            description: memberName && newRole 
                ? `"${memberName}" is now a ${newRole}` 
                : memberName 
                    ? `Updated role for "${memberName}"` 
                    : 'Team member role has been updated',
            ...iconConfig,
        };
    }
    
    // ============================================
    // DOCUMENT ACTIONS
    // ============================================
    
    if (log.action === 'document_created') {
        return {
            title: `${userName} created a new document${inProject}`,
            description: entityName 
                ? `"${entityName}" document has been created and is ready for editing` 
                : 'New document created and ready for collaboration',
            ...iconConfig,
        };
    }
    
    if (log.action === 'document_updated') {
        return {
            title: `${userName} updated a document${inProject}`,
            description: entityName 
                ? `Made changes to "${entityName}"` 
                : 'Document content has been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'document_deleted') {
        return {
            title: `${userName} deleted a document${inProject}`,
            description: entityName 
                ? `"${entityName}" has been permanently deleted` 
                : 'Document has been removed',
            ...iconConfig,
        };
    }
    
    // ============================================
    // ASSET ACTIONS
    // ============================================
    
    if (log.action === 'asset_uploaded') {
        const fileType = (log.metadata as any)?.file_type || (log.metadata as any)?.type || '';
        return {
            title: `${userName} uploaded ${entityName ? `"${entityName}"` : 'a new asset'}${inProject}`,
            description: fileType 
                ? `${fileType.toUpperCase()} file uploaded and ready to use` 
                : 'New asset uploaded and available in the project',
            ...iconConfig,
        };
    }
    
    if (log.action === 'asset_updated') {
        return {
            title: `${userName} updated an asset${inProject}`,
            description: entityName 
                ? `"${entityName}" has been replaced or modified` 
                : 'Asset file has been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'asset_deleted') {
        return {
            title: `${userName} deleted an asset${inProject}`,
            description: entityName 
                ? `"${entityName}" has been permanently removed` 
                : 'Asset has been deleted from the project',
            ...iconConfig,
        };
    }
    
    // ============================================
    // FOLDER ACTIONS
    // ============================================
    
    if (log.action === 'folder_created') {
        return {
            title: `${userName} created a new folder${inProject}`,
            description: entityName 
                ? `"${entityName}" folder is ready for organizing assets` 
                : 'New folder created for asset organization',
            ...iconConfig,
        };
    }
    
    if (log.action === 'folder_updated') {
        const updatedFields = (log.metadata as any)?.updated_fields || [];
        return {
            title: `${userName} updated a folder${inProject}`,
            description: entityName 
                ? `"${entityName}" folder settings have been modified` 
                : 'Folder has been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'folder_deleted') {
        const assetsDeleted = (log.metadata as any)?.assets_deleted || 0;
        return {
            title: `${userName} deleted a folder${inProject}`,
            description: entityName 
                ? `"${entityName}" and ${assetsDeleted} asset${assetsDeleted !== 1 ? 's' : ''} have been removed` 
                : 'Folder and its contents have been deleted',
            ...iconConfig,
        };
    }
    
    // ============================================
    // CREDENTIAL ACTIONS
    // ============================================
    
    if (log.action === 'credential_created') {
        const credType = (log.metadata as any)?.type || '';
        return {
            title: `${userName} added new credentials${inProject}`,
            description: credType 
                ? `${credType} credentials securely stored` 
                : 'New credentials have been securely saved',
            ...iconConfig,
        };
    }
    
    if (log.action === 'credential_updated') {
        return {
            title: `${userName} updated credentials${inProject}`,
            description: entityName 
                ? `"${entityName}" credentials have been modified` 
                : 'Credential values have been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'credential_deleted') {
        return {
            title: `${userName} deleted credentials${inProject}`,
            description: entityName 
                ? `"${entityName}" credentials have been removed` 
                : 'Credentials have been permanently deleted',
            ...iconConfig,
        };
    }
    
    if (log.action === 'copy_credential') {
        return {
            title: `${userName} copied credentials to clipboard`,
            description: entityName 
                ? `"${entityName}" value copied${inProject}` 
                : `Credential value accessed${inProject}`,
            ...iconConfig,
        };
    }
    
    // ============================================
    // STACK ACTIONS
    // ============================================
    
    if (log.action === 'stack_created') {
        return {
            title: `${userName} created a new stack${inProject}`,
            description: entityName 
                ? `"${entityName}" stack configured with selected services` 
                : 'New service stack has been set up',
            ...iconConfig,
        };
    }
    
    if (log.action === 'stack_updated') {
        return {
            title: `${userName} updated a stack${inProject}`,
            description: entityName 
                ? `"${entityName}" stack configuration modified` 
                : 'Stack services have been reorganized',
            ...iconConfig,
        };
    }
    
    if (log.action === 'stack_deleted') {
        return {
            title: `${userName} deleted a stack${inProject}`,
            description: entityName 
                ? `"${entityName}" stack has been removed` 
                : 'Stack removed (services remain in project)',
            ...iconConfig,
        };
    }
    
    // ============================================
    // WORKSPACE ACTIONS
    // ============================================
    
    if (log.action === 'workspace_created') {
        return {
            title: `${userName} created a new workspace`,
            description: entityName 
                ? `"${entityName}" workspace is ready for use` 
                : 'New workspace has been set up',
            ...iconConfig,
        };
    }
    
    if (log.action === 'workspace_updated') {
        return {
            title: `${userName} updated the workspace`,
            description: entityName 
                ? `"${entityName}" workspace settings modified` 
                : 'Workspace details have been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'settings_changed') {
        const settingType = (log.metadata as any)?.setting || '';
        return {
            title: `${userName} changed workspace settings`,
            description: settingType 
                ? `Updated ${settingType} preferences` 
                : 'Workspace configuration has been modified',
            ...iconConfig,
        };
    }
    
    // ============================================
    // NOTE ACTIONS
    // ============================================
    
    if (log.action === 'note_created') {
        return {
            title: `${userName} created a new note${inProject}`,
            description: entityName 
                ? `Added "${entityName}" for team reference` 
                : 'New note added for team collaboration',
            ...iconConfig,
        };
    }
    
    if (log.action === 'note_updated') {
        return {
            title: `${userName} updated a note${inProject}`,
            description: entityName 
                ? `"${entityName}" content has been modified` 
                : 'Note content has been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'note_deleted') {
        return {
            title: `${userName} deleted a note${inProject}`,
            description: entityName 
                ? `"${entityName}" has been removed` 
                : 'Note has been deleted',
            ...iconConfig,
        };
    }
    
    // ============================================
    // BILLING ACTIONS
    // ============================================
    
    if (log.action === 'billing_updated') {
        const billingDetail = (log.metadata as any)?.detail || '';
        return {
            title: `${userName} updated billing information`,
            description: billingDetail 
                ? `${billingDetail}` 
                : 'Payment or billing details have been updated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'subscription_changed') {
        const planName = (log.metadata as any)?.plan || (log.metadata as any)?.new_plan || '';
        const oldPlan = (log.metadata as any)?.old_plan || '';
        return {
            title: `${userName} changed the subscription plan`,
            description: planName && oldPlan 
                ? `Upgraded from ${oldPlan} to ${planName}` 
                : planName 
                    ? `Now on the ${planName} plan` 
                    : 'Subscription plan has been updated',
            ...iconConfig,
        };
    }
    
    // ============================================
    // AUTH/SECURITY ACTIONS
    // ============================================
    
    if (log.action === 'login') {
        const device = (log.metadata as any)?.device || '';
        const location = (log.metadata as any)?.location || '';
        return {
            title: `${userName} signed in to their account`,
            description: device || location 
                ? `Logged in${device ? ` from ${device}` : ''}${location ? ` in ${location}` : ''}` 
                : 'New session started',
            ...iconConfig,
        };
    }
    
    if (log.action === 'logout') {
        return {
            title: `${userName} signed out of their account`,
            description: 'Session ended securely',
            ...iconConfig,
        };
    }
    
    if (log.action === 'password_changed') {
        return {
            title: `${userName} changed their password`,
            description: 'Account password has been updated for security',
            ...iconConfig,
        };
    }
    
    if (log.action === 'two_factor_enabled') {
        const method = (log.metadata as any)?.method || '';
        return {
            title: `${userName} enabled two-factor authentication`,
            description: method 
                ? `Account secured with ${method}` 
                : 'Additional security layer activated',
            ...iconConfig,
        };
    }
    
    if (log.action === 'two_factor_disabled') {
        return {
            title: `${userName} disabled two-factor authentication`,
            description: 'Two-factor authentication has been turned off',
            ...iconConfig,
        };
    }
    
    if (log.action === 'api_key_created') {
        const keyName = (log.metadata as any)?.key_name || entityName || '';
        return {
            title: `${userName} created a new API key`,
            description: keyName 
                ? `"${keyName}" key generated for integration use` 
                : 'New API key generated for programmatic access',
            ...iconConfig,
        };
    }
    
    // ============================================
    // SYSTEM/INTEGRATION ACTIONS
    // ============================================
    
    if (log.action === 'alert_triggered') {
        const alertType = (log.metadata as any)?.type || '';
        const severity = (log.metadata as any)?.severity || '';
        return {
            title: `System alert triggered${inProject}`,
            description: alertType 
                ? `${severity ? `[${severity.toUpperCase()}] ` : ''}${alertType}` 
                : entityName || 'An automated alert requires attention',
            ...iconConfig,
        };
    }
    
    if (log.action === 'alert_dismissed') {
        return {
            title: `${userName} dismissed an alert${inProject}`,
            description: entityName 
                ? `"${entityName}" alert marked as resolved` 
                : 'Alert acknowledged and dismissed',
            ...iconConfig,
        };
    }
    
    if (log.action === 'data_exported') {
        const format = (log.metadata as any)?.format || '';
        const dataType = (log.metadata as any)?.data_type || '';
        return {
            title: `${userName} exported data${inProject}`,
            description: format || dataType 
                ? `${dataType || 'Data'} exported${format ? ` as ${format.toUpperCase()}` : ''}` 
                : 'Project data exported for backup or analysis',
            ...iconConfig,
        };
    }
    
    if (log.action === 'integration_connected') {
        const integrationName = entityName || (log.metadata as any)?.integration || '';
        return {
            title: `${userName} connected ${integrationName || 'an integration'}${inProject}`,
            description: integrationName 
                ? `"${integrationName}" is now linked and syncing` 
                : 'New integration connected and ready to use',
            ...iconConfig,
        };
    }
    
    if (log.action === 'integration_disconnected') {
        const integrationName = entityName || (log.metadata as any)?.integration || '';
        return {
            title: `${userName} disconnected ${integrationName || 'an integration'}${inProject}`,
            description: integrationName 
                ? `"${integrationName}" has been unlinked` 
                : 'Integration disconnected from the project',
            ...iconConfig,
        };
    }
    
    // ============================================
    // GENERIC ACTIONS (fallback for entity types)
    // ============================================
    
    if (log.action === 'create') {
        const entityType = log.entity_type?.replace(/_/g, ' ') || 'item';
        return {
            title: `${userName} created a new ${entityType}${inProject}`,
            description: entityName 
                ? `"${entityName}" has been created` 
                : `New ${entityType} added to the project`,
            ...iconConfig,
        };
    }
    
    if (log.action === 'update') {
        const entityType = log.entity_type?.replace(/_/g, ' ') || 'item';
        return {
            title: `${userName} updated ${entityName ? `"${entityName}"` : `a ${entityType}`}${inProject}`,
            description: entityName 
                ? `Changes saved to "${entityName}"` 
                : `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} has been modified`,
            ...iconConfig,
        };
    }
    
    if (log.action === 'delete') {
        const entityType = log.entity_type?.replace(/_/g, ' ') || 'item';
        return {
            title: `${userName} deleted ${entityName ? `"${entityName}"` : `a ${entityType}`}${inProject}`,
            description: entityName 
                ? `"${entityName}" has been permanently removed` 
                : `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted`,
            ...iconConfig,
        };
    }
    
    if (log.action === 'view') {
        const entityType = log.entity_type?.replace(/_/g, ' ') || 'item';
        return {
            title: `${userName} viewed ${entityName ? `"${entityName}"` : `a ${entityType}`}`,
            description: entityName 
                ? `Accessed "${entityName}"${inProject}` 
                : `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} accessed`,
            ...iconConfig,
        };
    }
    
    // ============================================
    // DEFAULT FALLBACK
    // ============================================
    
    const action = log.action.replace(/_/g, ' ');
    return {
        title: `${userName} ${action}`,
        description: entityName || projectName || 'Action completed',
        ...defaultActivityIcon,
    };
}

/**
 * Group consecutive service_added logs into a single batch entry
 * 
 * @param logs - Array of activity logs
 * @returns Grouped logs with batch entries for consecutive service additions
 */
export function groupActivityLogs(logs: ActivityLog[]): ActivityLog[] {
    const grouped: ActivityLog[] = [];
    let serviceAddedBatch: ActivityLog[] = [];
    
    logs.forEach((log) => {
        if (log.action === 'service_added') {
            serviceAddedBatch.push(log);
        } else {
            // Flush any pending service batch
            if (serviceAddedBatch.length > 0) {
                if (serviceAddedBatch.length === 1) {
                    grouped.push(serviceAddedBatch[0]);
                } else {
                    grouped.push({
                        ...serviceAddedBatch[0],
                        action: 'services_batch_added',
                        _batchCount: serviceAddedBatch.length,
                        _batchServices: serviceAddedBatch.map(s => (s.metadata as any)?.name || s.entity_name).filter(Boolean),
                    });
                }
                serviceAddedBatch = [];
            }
            grouped.push(log);
        }
    });
    
    // Handle remaining batch at the end
    if (serviceAddedBatch.length > 0) {
        if (serviceAddedBatch.length === 1) {
            grouped.push(serviceAddedBatch[0]);
        } else {
            grouped.push({
                ...serviceAddedBatch[0],
                action: 'services_batch_added',
                _batchCount: serviceAddedBatch.length,
                _batchServices: serviceAddedBatch.map(s => (s.metadata as any)?.name || s.entity_name).filter(Boolean),
            });
        }
    }
    
    return grouped;
}
