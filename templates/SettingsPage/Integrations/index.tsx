"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SettingsSidebar from "../SettingsSidebar";
import { useToast } from "@/components/Toast";

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: "notifications" | "development" | "productivity" | "monitoring";
    isConnected: boolean;
    connectedAt?: string;
    connectedBy?: string;
}

const integrations: Integration[] = [
    {
        id: "slack",
        name: "Slack",
        description: "Get notifications and alerts directly in your Slack channels",
        icon: "chat",
        category: "notifications",
        isConnected: true,
        connectedAt: "2024-12-15",
        connectedBy: "John Doe",
    },
    {
        id: "github",
        name: "GitHub",
        description: "Connect repositories and sync deployment status",
        icon: "code",
        category: "development",
        isConnected: true,
        connectedAt: "2024-11-20",
        connectedBy: "Jane Smith",
    },
    {
        id: "discord",
        name: "Discord",
        description: "Send notifications to Discord servers and channels",
        icon: "chat",
        category: "notifications",
        isConnected: false,
    },
    {
        id: "gitlab",
        name: "GitLab",
        description: "Integrate with GitLab for CI/CD and repository management",
        icon: "code",
        category: "development",
        isConnected: false,
    },
    {
        id: "notion",
        name: "Notion",
        description: "Sync documentation and project notes with Notion",
        icon: "documents",
        category: "productivity",
        isConnected: false,
    },
    {
        id: "linear",
        name: "Linear",
        description: "Create and track issues from service alerts",
        icon: "edit-list",
        category: "productivity",
        isConnected: false,
    },
    {
        id: "pagerduty",
        name: "PagerDuty",
        description: "Route critical alerts to on-call teams",
        icon: "bell",
        category: "monitoring",
        isConnected: false,
    },
    {
        id: "datadog",
        name: "Datadog",
        description: "Send metrics and logs to Datadog for monitoring",
        icon: "chart",
        category: "monitoring",
        isConnected: false,
    },
    {
        id: "zapier",
        name: "Zapier",
        description: "Connect with 5000+ apps through Zapier automations",
        icon: "lightning",
        category: "productivity",
        isConnected: false,
    },
    {
        id: "jira",
        name: "Jira",
        description: "Create Jira tickets from alerts and track issues",
        icon: "edit-list",
        category: "productivity",
        isConnected: false,
    },
];

const categories = [
    { id: "all", label: "All Integrations" },
    { id: "notifications", label: "Notifications" },
    { id: "development", label: "Development" },
    { id: "productivity", label: "Productivity" },
    { id: "monitoring", label: "Monitoring" },
];

const IntegrationsPage = () => {
    const toast = useToast();
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

    const filteredIntegrations = integrations.filter((integration) => {
        const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const connectedCount = integrations.filter((i) => i.isConnected).length;

    const handleConnect = (integration: Integration) => {
        setSelectedIntegration(integration);
        setShowConfigModal(true);
    };

    const handleDisconnect = (integration: Integration) => {
        toast.warning("Integration disconnected", `${integration.name} has been disconnected`);
    };

    const handleSaveConfig = () => {
        toast.success("Integration connected", `${selectedIntegration?.name} has been connected successfully`);
        setShowConfigModal(false);
        setSelectedIntegration(null);
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="integrations" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-[1.5px] border-cyan-500/30">
                                <Icon className="!w-6 !h-6 fill-cyan-500" name="lightning" />
                            </div>
                            <div>
                                <h1 className="text-h3">Integrations</h1>
                                <p className="text-small text-t-secondary">
                                    Connect external tools and services to enhance your workflow
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="center">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 max-md:grid-cols-1">
                        <div className="p-5 rounded-3xl bg-b-surface2">
                            <div className="text-small text-t-secondary mb-1">Connected</div>
                            <div className="text-h3">{connectedCount}</div>
                        </div>
                        <div className="p-5 rounded-3xl bg-b-surface2">
                            <div className="text-small text-t-secondary mb-1">Available</div>
                            <div className="text-h3">{integrations.length}</div>
                        </div>
                        <div className="p-5 rounded-3xl bg-b-surface2">
                            <div className="text-small text-t-secondary mb-1">Categories</div>
                            <div className="text-h3">{categories.length - 1}</div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex items-center gap-4 mb-6 max-md:flex-col">
                        <div className="relative flex-1 max-md:w-full">
                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 !w-5 !h-5 fill-t-tertiary" name="search" />
                            <input
                                type="text"
                                placeholder="Search integrations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto max-md:w-full">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2.5 rounded-xl text-small font-medium whitespace-nowrap transition-all ${
                                        activeCategory === category.id
                                            ? "bg-primary1 text-white"
                                            : "bg-b-surface2 text-t-secondary hover:text-t-primary"
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Connected Integrations */}
                    {filteredIntegrations.some((i) => i.isConnected) && (
                        <div className="mb-8">
                            <h2 className="text-body-bold mb-4">Connected</h2>
                            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                                {filteredIntegrations
                                    .filter((i) => i.isConnected)
                                    .map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="p-5 rounded-3xl bg-b-surface2 border-2 border-green-500/20"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center size-12 rounded-2xl bg-green-500/10 fill-green-500">
                                                        <Icon className="!w-6 !h-6" name={integration.icon} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-body-bold">{integration.name}</h3>
                                                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600">
                                                                Connected
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-t-tertiary mt-0.5">
                                                            Connected by {integration.connectedBy} on{" "}
                                                            {new Date(integration.connectedAt!).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-small text-t-secondary mb-4">{integration.description}</p>
                                            <div className="flex gap-2">
                                                <Button isStroke className="flex-1" onClick={() => handleConnect(integration)}>
                                                    <Icon className="mr-2 !w-4 !h-4" name="gear" />
                                                    Configure
                                                </Button>
                                                <Button
                                                    isStroke
                                                    className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10"
                                                    onClick={() => handleDisconnect(integration)}
                                                >
                                                    Disconnect
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Available Integrations */}
                    <div>
                        <h2 className="text-body-bold mb-4">Available</h2>
                        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                            {filteredIntegrations
                                .filter((i) => !i.isConnected)
                                .map((integration) => (
                                    <div
                                        key={integration.id}
                                        className="p-5 rounded-3xl bg-b-surface2"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center size-12 rounded-2xl bg-b-surface1 fill-t-secondary">
                                                    <Icon className="!w-6 !h-6" name={integration.icon} />
                                                </div>
                                                <div>
                                                    <h3 className="text-body-bold">{integration.name}</h3>
                                                    <p className="text-xs text-t-tertiary capitalize">{integration.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-small text-t-secondary mb-4">{integration.description}</p>
                                        <Button isPrimary className="w-full" onClick={() => handleConnect(integration)}>
                                            <Icon className="mr-2 !w-4 !h-4" name="plus" />
                                            Connect
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredIntegrations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Icon className="!w-16 !h-16 fill-t-tertiary mb-4" name="search" />
                            <h3 className="text-h4 mb-2">No integrations found</h3>
                            <p className="text-small text-t-secondary">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Configuration Modal */}
            {showConfigModal && selectedIntegration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#282828]/90" onClick={() => setShowConfigModal(false)} />
                    <div className="relative z-10 w-full max-w-lg mx-4 p-8 rounded-4xl bg-b-surface1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center justify-center size-14 rounded-2xl bg-b-surface2 fill-t-secondary">
                                <Icon className="!w-7 !h-7" name={selectedIntegration.icon} />
                            </div>
                            <div>
                                <h3 className="text-h4">{selectedIntegration.isConnected ? "Configure" : "Connect"} {selectedIntegration.name}</h3>
                                <p className="text-small text-t-secondary">{selectedIntegration.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {selectedIntegration.id === "slack" && (
                                <>
                                    <div>
                                        <label className="block text-small font-medium text-t-secondary mb-2">
                                            Workspace
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Acme Corp"
                                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-small font-medium text-t-secondary mb-2">
                                            Default Channel
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="#alerts"
                                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                    </div>
                                </>
                            )}
                            {selectedIntegration.id === "github" && (
                                <>
                                    <div>
                                        <label className="block text-small font-medium text-t-secondary mb-2">
                                            Organization
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="acme-corp"
                                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-small font-medium text-t-secondary mb-2">
                                            Repositories
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Select repositories..."
                                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                    </div>
                                </>
                            )}
                            {!["slack", "github"].includes(selectedIntegration.id) && (
                                <div className="p-6 rounded-2xl bg-b-surface2 text-center">
                                    <Icon className="!w-12 !h-12 fill-t-tertiary mx-auto mb-3" name="export" />
                                    <p className="text-small text-t-secondary mb-4">
                                        You'll be redirected to {selectedIntegration.name} to authorize the connection
                                    </p>
                                    <Button isPrimary onClick={handleSaveConfig}>
                                        <Icon className="mr-2 !w-4 !h-4" name="export" />
                                        Continue to {selectedIntegration.name}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {["slack", "github"].includes(selectedIntegration.id) && (
                            <div className="flex gap-3">
                                <Button className="flex-1" isStroke onClick={() => setShowConfigModal(false)}>
                                    Cancel
                                </Button>
                                <Button className="flex-1" isPrimary onClick={handleSaveConfig}>
                                    {selectedIntegration.isConnected ? "Save Changes" : "Connect"}
                                </Button>
                            </div>
                        )}

                        {!["slack", "github"].includes(selectedIntegration.id) && (
                            <button
                                onClick={() => setShowConfigModal(false)}
                                className="w-full text-center text-small text-t-secondary hover:text-t-primary transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default IntegrationsPage;
