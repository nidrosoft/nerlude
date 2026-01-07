"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/components/Toast";
import { mockServices, categoryLabels, categoryIcons } from "@/data/mockServices";
import { mockProjects } from "@/data/mockProjects";
import { getCategoryColor, getStatusColor } from "@/utils/categoryColors";
import { TabId, tabs } from "./types";
import { mockCredentials, mockUsageStats, mockActivityLog } from "./data";
import OverviewTab from "./OverviewTab";
import CredentialsTab from "./CredentialsTab";
import UsageTab from "./UsageTab";
import SettingsTab from "./SettingsTab";

type Props = {
    projectId: string;
    serviceId: string;
};

const ServiceDetailPage = ({ projectId, serviceId }: Props) => {
    const router = useRouter();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);

    const project = mockProjects.find((p) => p.id === projectId);
    const service = mockServices.find((s) => s.id === serviceId);

    if (!project || !service) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Icon className="!w-16 !h-16 fill-t-tertiary mx-auto mb-4" name="question-circle" />
                        <h2 className="text-h4 mb-2">Service Not Found</h2>
                        <p className="text-small text-t-secondary mb-6">
                            The service you're looking for doesn't exist or has been removed.
                        </p>
                        <Button isPrimary onClick={() => router.push(`/projects/${projectId}`)}>
                            Back to Project
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const categoryColor = getCategoryColor(service.categoryId);
    const statusColor = getStatusColor(service.status);

    const toggleSecretVisibility = (id: string) => {
        setVisibleSecrets((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const copyToClipboard = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        toast.success("Copied!", `${label} copied to clipboard`);
    };

    const handlePauseService = () => {
        toast.warning("Service paused", `${service.name} has been paused`);
    };

    const handleDeleteService = () => {
        toast.error("Service removed", `${service.name} has been removed from this project`);
        setShowDeleteModal(false);
        router.push(`/projects/${projectId}`);
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            <div className="min-h-screen pt-20">
                {/* Sticky Header with Breadcrumb and Service Info */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-6 -mx-4 px-4">
                    <div className="center">
                        <Breadcrumb
                            className="mb-6 pt-4"
                            items={[
                                { label: "Dashboard", href: "/" },
                                { label: project.name, href: `/projects/${projectId}` },
                                { label: "Services", href: `/projects/${projectId}?tab=services` },
                                { label: service.name },
                            ]}
                        />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center size-16 rounded-2xl border-2 ${categoryColor.border} ${categoryColor.bg} ${categoryColor.icon}`}>
                                    <Icon className="!w-8 !h-8" name={categoryIcons[service.categoryId] || "cube"} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-h2">{service.name}</h1>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${statusColor.bg} ${statusColor.text}`}>
                                            {service.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-small text-t-secondary">
                                        <span>{categoryLabels[service.categoryId] || service.categoryId}</span>
                                        {service.plan && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-t-tertiary" />
                                                <span>{service.plan}</span>
                                            </>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-t-tertiary" />
                                        <span className="font-medium text-t-primary">
                                            {service.costAmount === 0 ? "Free" : `$${service.costAmount}/${service.costFrequency === "monthly" ? "mo" : "yr"}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button isStroke onClick={() => window.open("https://dashboard.stripe.com", "_blank")}>
                                    <Icon className="mr-2 !w-4 !h-4" name="export" />
                                    Open Dashboard
                                </Button>
                                <Button isPrimary onClick={handlePauseService}>
                                    Pause
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-2xl bg-b-surface2 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-small font-medium transition-all ${
                            activeTab === tab.id
                                ? "bg-b-surface1 text-t-primary fill-t-primary shadow-sm"
                                : "text-t-secondary fill-t-secondary hover:text-t-primary hover:fill-t-primary"
                        }`}
                    >
                        <Icon className="!w-4 !h-4" name={tab.icon} />
                        {tab.label}
                    </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="center">
                    <div className="space-y-6">
                        {activeTab === "overview" && (
                            <OverviewTab
                                service={service}
                                usageStats={mockUsageStats}
                                activityLog={mockActivityLog}
                            />
                        )}

                        {activeTab === "credentials" && (
                            <CredentialsTab
                                credentials={mockCredentials}
                                visibleSecrets={visibleSecrets}
                                onToggleVisibility={toggleSecretVisibility}
                                onCopy={copyToClipboard}
                            />
                        )}

                        {activeTab === "usage" && (
                            <UsageTab usageStats={mockUsageStats} />
                        )}

                        {activeTab === "settings" && (
                            <SettingsTab
                                service={service}
                                onDeleteClick={() => setShowDeleteModal(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#282828]/90" onClick={() => setShowDeleteModal(false)} />
                        <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                            <h3 className="text-h4 mb-2">Remove Service</h3>
                            <p className="text-small text-t-secondary mb-6">
                                Are you sure you want to remove "{service.name}" from this project? 
                                This will delete all associated credentials and settings.
                            </p>
                            <div className="flex gap-3">
                                <Button className="flex-1" isStroke onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white" 
                                    isPrimary 
                                    onClick={handleDeleteService}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ServiceDetailPage;
