export interface ActivityItem {
    id: string;
    type: "project_created" | "service_added" | "service_updated" | "member_invited" | "project_archived" | "settings_changed";
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
    {
        id: "act-1",
        type: "service_added",
        title: "Vercel added",
        description: "Added Vercel hosting to Mobile App",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-2",
        type: "project_created",
        title: "New project created",
        description: "E-commerce Platform was created",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-3",
        type: "member_invited",
        title: "Team member invited",
        description: "bob@example.com was invited to the workspace",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-4",
        type: "service_updated",
        title: "Stripe updated",
        description: "Stripe plan changed to Business in E-commerce Platform",
        projectId: "2",
        projectName: "E-commerce Platform",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        user: { name: "Jane Smith", avatar: "J" },
    },
    {
        id: "act-5",
        type: "settings_changed",
        title: "Workspace settings updated",
        description: "Workspace name changed to 'Acme Corp'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        user: { name: "John Doe", avatar: "J" },
    },
    {
        id: "act-6",
        type: "service_added",
        title: "Supabase added",
        description: "Added Supabase database to Mobile App",
        projectId: "1",
        projectName: "Mobile App",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        user: { name: "Bob Wilson", avatar: "B" },
    },
    {
        id: "act-7",
        type: "project_archived",
        title: "Project archived",
        description: "Legacy Website was archived",
        projectId: "5",
        projectName: "Legacy Website",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
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
