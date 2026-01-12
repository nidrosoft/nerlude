"use client";

import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import SettingsSidebar from "../SettingsSidebar";
import { useWorkspaceStore } from "@/stores";

interface AuditEvent {
    id: string;
    action: string;
    category: "project" | "service" | "team" | "settings" | "billing" | "security";
    description: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    target?: string;
    metadata?: Record<string, string>;
    ipAddress: string;
    timestamp: string;
}

// Map action types to categories
const getCategory = (action: string): AuditEvent["category"] => {
    if (action.startsWith("project")) return "project";
    if (action.startsWith("service")) return "service";
    if (action.startsWith("member") || action.startsWith("team")) return "team";
    if (action.startsWith("settings") || action.startsWith("workspace")) return "settings";
    if (action.startsWith("billing") || action.startsWith("subscription")) return "billing";
    if (action.startsWith("security") || action.startsWith("password") || action.startsWith("api_key")) return "security";
    return "settings";
};

// Map action types to descriptions
const getDescription = (action: string): string => {
    const descriptions: Record<string, string> = {
        project_created: "Created new project",
        project_updated: "Updated project",
        project_deleted: "Deleted project",
        project_archived: "Archived project",
        service_added: "Added service to project",
        service_updated: "Updated service",
        service_removed: "Removed service",
        member_invited: "Invited team member",
        member_joined: "Team member joined",
        member_removed: "Removed team member",
        member_role_changed: "Changed member role",
        settings_updated: "Updated settings",
        workspace_created: "Created workspace",
        workspace_updated: "Updated workspace",
        billing_updated: "Updated billing",
        subscription_changed: "Changed subscription plan",
        document_created: "Created document",
        document_updated: "Updated document",
        asset_uploaded: "Uploaded asset",
    };
    return descriptions[action] || action.replace(/_/g, " ");
};

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
    project: { bg: "bg-blue-500/10", text: "text-blue-600", icon: "cube" },
    service: { bg: "bg-purple-500/10", text: "text-purple-600", icon: "post" },
    team: { bg: "bg-green-500/10", text: "text-green-600", icon: "users" },
    settings: { bg: "bg-amber-500/10", text: "text-amber-600", icon: "gear" },
    billing: { bg: "bg-pink-500/10", text: "text-pink-600", icon: "documents" },
    security: { bg: "bg-red-500/10", text: "text-red-600", icon: "key" },
};

const AuditLogPage = () => {
    const { currentWorkspace } = useWorkspaceStore();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
    const [isLoading, setIsLoading] = useState(true);
    const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch audit events from API
    const fetchAuditEvents = useCallback(async () => {
        if (!currentWorkspace) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/activity?workspace_id=${currentWorkspace.id}&limit=50`);
            if (response.ok) {
                const data = await response.json();
                const mappedEvents: AuditEvent[] = data.map((item: any) => ({
                    id: item.id,
                    action: item.action,
                    category: getCategory(item.action),
                    description: getDescription(item.action),
                    user: {
                        name: item.user?.name || 'Unknown User',
                        email: item.user?.email || '',
                        avatar: item.user?.avatar_url,
                    },
                    target: item.entity_name || item.project?.name,
                    metadata: item.metadata,
                    ipAddress: item.ip_address || '—',
                    timestamp: item.created_at,
                }));
                setAuditEvents(mappedEvents);
                setTotalCount(mappedEvents.length);
            }
        } catch (error) {
            console.error('Error fetching audit events:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        fetchAuditEvents();
    }, [fetchAuditEvents]);

    const filteredEvents = auditEvents.filter((event: AuditEvent) => {
        const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
        const matchesSearch =
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.target?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return `${minutes} minutes ago`;
            }
            return `${hours} hours ago`;
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days} days ago`;
        }
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const categories = [
        { id: "all", label: "All Events" },
        { id: "project", label: "Projects" },
        { id: "service", label: "Services" },
        { id: "team", label: "Team" },
        { id: "settings", label: "Settings" },
        { id: "billing", label: "Billing" },
        { id: "security", label: "Security" },
    ];

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="audit" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-[1.5px] border-rose-500/30">
                                    <Icon className="!w-6 !h-6 fill-rose-500" name="clock" />
                                </div>
                                <div>
                                    <h1 className="text-h3">Audit Log</h1>
                                    <p className="text-small text-t-secondary">
                                        Track all activities and changes across your workspace
                                    </p>
                                </div>
                            </div>
                            <Button isSecondary>
                                <Icon className="mr-2 !w-4 !h-4" name="export" />
                                Export Log
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="center">

                    {/* Filters */}
                    <div className="p-6 rounded-4xl bg-b-surface2 mb-6">
                        <div className="flex items-center gap-4 mb-4 max-md:flex-col">
                            <div className="relative flex-1 max-md:w-full">
                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 !w-5 !h-5 fill-t-tertiary" name="search" />
                                <input
                                    type="text"
                                    placeholder="Search by action, user, or target..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                />
                            </div>
                            <div className="flex gap-2">
                                {(["7d", "30d", "90d", "all"] as const).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setDateRange(range)}
                                        className={`px-4 py-2.5 rounded-xl text-small font-medium transition-all ${
                                            dateRange === range
                                                ? "bg-primary1 text-white"
                                                : "bg-b-surface1 text-t-secondary hover:text-t-primary"
                                        }`}
                                    >
                                        {range === "all" ? "All time" : `Last ${range}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-small font-medium whitespace-nowrap transition-all ${
                                        selectedCategory === category.id
                                            ? "bg-b-surface1 text-t-primary"
                                            : "text-t-secondary hover:text-t-primary"
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="rounded-4xl bg-b-surface2 overflow-hidden">
                        {isLoading ? (
                            <div className="divide-y divide-stroke-subtle">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="p-5">
                                        <div className="flex items-start gap-4">
                                            <Skeleton variant="rounded" width={40} height={40} />
                                            <div className="flex-1">
                                                <Skeleton variant="text" height={18} className="w-64 mb-2" />
                                                <Skeleton variant="text" height={14} className="w-48" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                        <div className="divide-y divide-stroke-subtle">
                            {filteredEvents.map((event: AuditEvent) => {
                                const categoryStyle = categoryColors[event.category];
                                return (
                                    <div key={event.id} className="p-5 hover:bg-b-surface1/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex items-center justify-center size-10 rounded-xl ${categoryStyle.bg} fill-current ${categoryStyle.text} shrink-0`}>
                                                <Icon className="!w-5 !h-5" name={categoryStyle.icon} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <div>
                                                        <span className="text-body font-medium text-t-primary">
                                                            {event.description}
                                                        </span>
                                                        {event.target && (
                                                            <span className="text-body text-t-secondary">
                                                                {" "}&middot; {event.target}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-t-tertiary whitespace-nowrap">
                                                        {formatTimestamp(event.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-small text-t-tertiary">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="w-5 h-5 rounded-full bg-b-surface1 flex items-center justify-center text-xs font-medium text-t-secondary">
                                                            {event.user.name.charAt(0)}
                                                        </span>
                                                        {event.user.name}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-t-tertiary" />
                                                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${categoryStyle.bg} ${categoryStyle.text}`}>
                                                        {event.category}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-t-tertiary" />
                                                    <span className="font-mono text-xs">{event.ipAddress}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        )}

                        {!isLoading && filteredEvents.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Icon className="!w-16 !h-16 fill-t-tertiary mb-4" name="documents" />
                                <h3 className="text-h4 mb-2">No events found</h3>
                                <p className="text-small text-t-secondary">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredEvents.length > 0 && (
                        <div className="flex items-center justify-between mt-6 pb-8">
                            <span className="text-small text-t-secondary">
                                Showing {filteredEvents.length} of {totalCount} events
                            </span>
                            <div className="flex gap-2">
                                <Button isStroke disabled>
                                    <Icon className="!w-4 !h-4 mr-1 rotate-90" name="chevron" />
                                    Previous
                                </Button>
                                <Button isStroke>
                                    Next
                                    <Icon className="!w-4 !h-4 ml-1 -rotate-90" name="chevron" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AuditLogPage;
