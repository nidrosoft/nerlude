export interface ActivityItem {
    id: string;
    type: 
        // Generic actions
        | "create"
        | "update"
        | "delete"
        | "view"
        // Project actions
        | "project_created" 
        | "project_updated"
        | "project_archived" 
        | "project_deleted" 
        | "project_restored"
        | "project_duplicated"
        // Service actions
        | "service_added" 
        | "service_updated" 
        | "service_removed"
        // Member/Team actions
        | "member_invited" 
        | "member_removed"
        | "member_role_changed"
        | "invite_member"
        | "remove_member"
        | "change_role"
        // Document actions
        | "document_created"
        | "document_updated"
        | "document_deleted"
        // Asset actions
        | "asset_uploaded"
        | "asset_updated"
        | "asset_deleted"
        // Credential actions
        | "credential_created"
        | "credential_updated"
        | "credential_deleted"
        | "copy_credential"
        // Stack actions
        | "stack_created"
        | "stack_updated"
        | "stack_deleted"
        // Workspace actions
        | "workspace_created"
        | "workspace_updated"
        | "settings_changed"
        // Note actions
        | "note_created"
        | "note_updated"
        | "note_deleted"
        // Billing actions
        | "billing_updated"
        | "subscription_changed"
        // Auth/Security actions
        | "login"
        | "logout"
        | "password_changed"
        | "two_factor_enabled"
        | "two_factor_disabled"
        | "api_key_created"
        // System/Integration actions
        | "alert_triggered"
        | "alert_dismissed"
        | "data_exported"
        | "integration_connected"
        | "integration_disconnected";
    title: string;
    description: string;
    projectId?: string;
    projectName?: string;
    timestamp: string;
    user: {
        name: string;
        avatar: string;
    };
}

export const mockActivity: ActivityItem[] = [
    // Project actions
    {
        id: "act-1",
        type: "project_created",
        title: "New project created",
        description: "E-commerce Platform was created",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-2",
        type: "project_archived",
        title: "Project archived",
        description: "Legacy Website was archived",
        projectId: "5",
        projectName: "Legacy Website",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-3",
        type: "project_deleted",
        title: "Project deleted",
        description: "Test Project was permanently deleted",
        projectId: "6",
        projectName: "Test Project",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: { name: "Admin", avatar: "A" },
    },
    {
        id: "act-4",
        type: "project_restored",
        title: "Project restored",
        description: "Marketing Site was restored from archive",
        projectId: "7",
        projectName: "Marketing Site",
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    
    // Service actions
    {
        id: "act-5",
        type: "service_added",
        title: "Vercel added",
        description: "Added Vercel hosting to Mobile App",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-6",
        type: "service_updated",
        title: "Stripe updated",
        description: "Stripe plan changed to Business",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-7",
        type: "service_removed",
        title: "Service removed",
        description: "Removed deprecated API service",
        projectId: "3",
        projectName: "API Gateway",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        user: { name: "Bob Wilson", avatar: "B" },
    },
    
    // Member actions
    {
        id: "act-8",
        type: "member_invited",
        title: "Team member invited",
        description: "bob@example.com was invited to the workspace",
        timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-9",
        type: "member_removed",
        title: "Member removed",
        description: "alice@example.com was removed from workspace",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        user: { name: "Admin", avatar: "A" },
    },
    {
        id: "act-10",
        type: "member_role_changed",
        title: "Role updated",
        description: "Bob Wilson promoted to Admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    
    // Settings & billing
    {
        id: "act-11",
        type: "settings_changed",
        title: "Workspace settings updated",
        description: "Workspace name changed to 'Acme Corp'",
        timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-12",
        type: "billing_updated",
        title: "Billing updated",
        description: "Upgraded to Pro plan",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    
    // Documents & assets
    {
        id: "act-13",
        type: "document_created",
        title: "Document created",
        description: "API Documentation added to Mobile App",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
        user: { name: "Bob Wilson", avatar: "B" },
    },
    {
        id: "act-14",
        type: "asset_uploaded",
        title: "Asset uploaded",
        description: "Logo files uploaded to E-commerce Platform",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    
    // Alerts
    {
        id: "act-15",
        type: "alert_triggered",
        title: "Alert triggered",
        description: "SSL certificate expiring in 7 days",
        projectId: "3",
        projectName: "API Gateway",
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        user: { name: "System", avatar: "S" },
    },
    
    // Additional activity types
    {
        id: "act-16",
        type: "project_updated",
        title: "Project updated",
        description: "E-commerce Platform settings were updated",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-17",
        type: "project_duplicated",
        title: "Project duplicated",
        description: "Mobile App was duplicated as 'Mobile App v2'",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-18",
        type: "credential_created",
        title: "Credential added",
        description: "Added API key for Stripe integration",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        user: { name: "Bob Wilson", avatar: "B" },
    },
    {
        id: "act-19",
        type: "copy_credential",
        title: "Credential copied",
        description: "Supabase connection string was copied",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-20",
        type: "stack_created",
        title: "Stack created",
        description: "New stack 'Production' was created",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-21",
        type: "document_updated",
        title: "Document updated",
        description: "API Documentation was updated",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
        user: { name: "Bob Wilson", avatar: "B" },
    },
    {
        id: "act-22",
        type: "note_created",
        title: "Note created",
        description: "Added deployment checklist note",
        projectId: "3",
        projectName: "API Gateway",
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-23",
        type: "integration_connected",
        title: "Integration connected",
        description: "GitHub repository was connected",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-24",
        type: "data_exported",
        title: "Data exported",
        description: "Project data was exported to CSV",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: { name: "Admin", avatar: "A" },
    },
    {
        id: "act-25",
        type: "subscription_changed",
        title: "Subscription changed",
        description: "Upgraded from Pro to Enterprise plan",
        timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-26",
        type: "alert_dismissed",
        title: "Alert dismissed",
        description: "SSL certificate warning was dismissed",
        projectId: "3",
        projectName: "API Gateway",
        timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
        user: { name: "Bob Wilson", avatar: "B" },
    },
    {
        id: "act-27",
        type: "workspace_updated",
        title: "Workspace updated",
        description: "Workspace logo was updated",
        timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-28",
        type: "login",
        title: "User logged in",
        description: "Logged in from new device",
        timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        user: { name: "John Doe", avatar: "J" },
    },
];

export const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};
