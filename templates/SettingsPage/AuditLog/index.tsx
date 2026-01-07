"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SettingsSidebar from "../SettingsSidebar";

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

const mockAuditEvents: AuditEvent[] = [
    {
        id: "1",
        action: "project.created",
        category: "project",
        description: "Created new project",
        user: { name: "John Doe", email: "john@example.com" },
        target: "SaaS Dashboard",
        ipAddress: "192.168.1.1",
        timestamp: "2025-01-06T14:30:00Z",
    },
    {
        id: "2",
        action: "service.added",
        category: "service",
        description: "Added service to project",
        user: { name: "Jane Smith", email: "jane@example.com" },
        target: "Stripe",
        metadata: { project: "SaaS Dashboard" },
        ipAddress: "192.168.1.2",
        timestamp: "2025-01-06T13:15:00Z",
    },
    {
        id: "3",
        action: "team.member_invited",
        category: "team",
        description: "Invited team member",
        user: { name: "John Doe", email: "john@example.com" },
        target: "alex@example.com",
        ipAddress: "192.168.1.1",
        timestamp: "2025-01-06T11:00:00Z",
    },
    {
        id: "4",
        action: "settings.updated",
        category: "settings",
        description: "Updated workspace settings",
        user: { name: "Jane Smith", email: "jane@example.com" },
        metadata: { field: "Workspace name" },
        ipAddress: "192.168.1.2",
        timestamp: "2025-01-05T16:45:00Z",
    },
    {
        id: "5",
        action: "billing.plan_upgraded",
        category: "billing",
        description: "Upgraded subscription plan",
        user: { name: "John Doe", email: "john@example.com" },
        target: "Pro Plan",
        ipAddress: "192.168.1.1",
        timestamp: "2025-01-05T10:30:00Z",
    },
    {
        id: "6",
        action: "security.api_key_created",
        category: "security",
        description: "Created new API key",
        user: { name: "Jane Smith", email: "jane@example.com" },
        target: "Production API Key",
        ipAddress: "192.168.1.2",
        timestamp: "2025-01-04T09:00:00Z",
    },
    {
        id: "7",
        action: "project.deleted",
        category: "project",
        description: "Deleted project",
        user: { name: "John Doe", email: "john@example.com" },
        target: "Old Project",
        ipAddress: "192.168.1.1",
        timestamp: "2025-01-03T14:20:00Z",
    },
    {
        id: "8",
        action: "service.credentials_viewed",
        category: "service",
        description: "Viewed service credentials",
        user: { name: "Jane Smith", email: "jane@example.com" },
        target: "Supabase",
        metadata: { project: "SaaS Dashboard" },
        ipAddress: "192.168.1.2",
        timestamp: "2025-01-03T11:45:00Z",
    },
    {
        id: "9",
        action: "team.member_removed",
        category: "team",
        description: "Removed team member",
        user: { name: "John Doe", email: "john@example.com" },
        target: "removed@example.com",
        ipAddress: "192.168.1.1",
        timestamp: "2025-01-02T15:30:00Z",
    },
    {
        id: "10",
        action: "security.password_changed",
        category: "security",
        description: "Changed account password",
        user: { name: "Jane Smith", email: "jane@example.com" },
        ipAddress: "192.168.1.2",
        timestamp: "2025-01-01T10:00:00Z",
    },
];

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
    project: { bg: "bg-blue-500/10", text: "text-blue-600", icon: "cube" },
    service: { bg: "bg-purple-500/10", text: "text-purple-600", icon: "post" },
    team: { bg: "bg-green-500/10", text: "text-green-600", icon: "users" },
    settings: { bg: "bg-amber-500/10", text: "text-amber-600", icon: "gear" },
    billing: { bg: "bg-pink-500/10", text: "text-pink-600", icon: "documents" },
    security: { bg: "bg-red-500/10", text: "text-red-600", icon: "key" },
};

const AuditLogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

    const filteredEvents = mockAuditEvents.filter((event) => {
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
                        <div className="divide-y divide-stroke-subtle">
                            {filteredEvents.map((event) => {
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

                        {filteredEvents.length === 0 && (
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
                                Showing {filteredEvents.length} of {mockAuditEvents.length} events
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
