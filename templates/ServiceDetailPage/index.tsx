"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Breadcrumb from "@/components/Breadcrumb";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";
import { TabId, tabs, Credential } from "./types";
import OverviewTab from "./OverviewTab";
import CredentialsTab from "./CredentialsTab";
import SettingsTab from "./SettingsTab";
import EditServiceModal from "./EditServiceModal";
import { CredentialTypeId } from "./credentialTypes";
import { Service, Project } from "@/types";
import Sidebar from "@/templates/ProjectPage/Sidebar";

type Props = {
    projectId: string;
    serviceId: string;
};

interface ProjectInfo {
    id: string;
    name: string;
    icon: string;
    status: "active" | "paused" | "archived";
}

const ServiceDetailPage = ({ projectId, serviceId }: Props) => {
    const router = useRouter();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Real data state
    const [project, setProject] = useState<ProjectInfo | null>(null);
    const [service, setService] = useState<Service | null>(null);
    const [credentials, setCredentials] = useState<Credential[]>([]);

    // Fetch service data from API
    const fetchServiceData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch service and project in parallel
            const [serviceRes, projectRes] = await Promise.all([
                fetch(`/api/projects/${projectId}/services/${serviceId}`),
                fetch(`/api/projects/${projectId}`),
            ]);

            if (!serviceRes.ok || !projectRes.ok) {
                setService(null);
                setProject(null);
                return;
            }

            const serviceData = await serviceRes.json();
            const projectData = await projectRes.json();

            // Map service data
            setService({
                id: serviceData.id,
                projectId: serviceData.project_id,
                stackId: serviceData.stack_id,
                registryId: serviceData.registry_id,
                categoryId: serviceData.category_id || 'custom',
                subCategoryId: serviceData.sub_category_id,
                name: serviceData.name,
                customLogoUrl: serviceData.custom_logo_url,
                plan: serviceData.plan,
                costAmount: serviceData.cost_amount || 0,
                costFrequency: serviceData.cost_frequency || 'monthly',
                currency: serviceData.currency || 'USD',
                renewalDate: serviceData.renewal_date,
                lastPaymentDate: serviceData.last_payment_date,
                status: serviceData.status || 'active',
                notes: serviceData.notes,
                createdAt: serviceData.created_at,
                updatedAt: serviceData.updated_at,
            });

            setProject({
                id: projectData.id,
                name: projectData.name,
                icon: projectData.icon || "🚀",
                status: projectData.status || "active",
            });

            // Map credentials if available
            if (serviceData.credentials) {
                setCredentials(serviceData.credentials.map((c: any) => {
                    // Parse fields from credentials_encrypted if available
                    let fields: Record<string, string> | undefined;
                    try {
                        if (c.credentials_encrypted) {
                            fields = JSON.parse(c.credentials_encrypted);
                        }
                    } catch {
                        // If parsing fails, fields will be undefined
                    }
                    
                    return {
                        id: c.id,
                        label: c.key_name || 'Key',
                        value: '••••••••••••••••', // Never expose actual value in list
                        isSecret: true,
                        environment: c.environment || 'production',
                        credentialType: c.credential_type,
                        description: c.description,
                        fields, // Include parsed fields for detail modal
                        createdAt: c.created_at,
                    };
                }));
            }

        } catch (error) {
            console.error('Error fetching service:', error);
            setService(null);
            setProject(null);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, serviceId]);

    useEffect(() => {
        fetchServiceData();
    }, [fetchServiceData]);

    // Loading state
    if (isLoading) {
        return (
            <Layout isLoggedIn isFixedHeader>
                <div className="min-h-screen pt-20">
                    <div className="center">
                        <Skeleton variant="text" height={16} className="w-64 mb-6 mt-4" />
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton variant="rounded" width={64} height={64} />
                            <div>
                                <Skeleton variant="text" height={32} className="w-48 mb-2" />
                                <Skeleton variant="text" height={16} className="w-32" />
                            </div>
                        </div>
                        <Skeleton variant="rounded" height={48} className="w-96 mb-8" />
                        <Skeleton variant="rounded" height={200} className="w-full" />
                    </div>
                </div>
            </Layout>
        );
    }

    // Not found state
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

    const toggleSecretVisibility = (id: string) => {
        setVisibleSecrets((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const copyToClipboard = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        toast.success("Copied!", `${label} copied to clipboard`);
    };

    const handleDeleteService = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/services/${serviceId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Service removed", `${service.name} has been removed from this project`);
                setShowDeleteModal(false);
                router.push(`/projects/${projectId}`);
            } else {
                throw new Error('Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error("Error", "Failed to remove service");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateService = async (updates: Partial<Service>) => {
        if (!service) return;
        setIsSaving(true);
        try {
            // Convert camelCase to snake_case for API
            const apiUpdates: Record<string, unknown> = {};
            if (updates.name !== undefined) apiUpdates.name = updates.name;
            if (updates.plan !== undefined) apiUpdates.plan = updates.plan;
            if (updates.costAmount !== undefined) apiUpdates.cost_amount = updates.costAmount;
            if (updates.costFrequency !== undefined) apiUpdates.cost_frequency = updates.costFrequency;
            if (updates.renewalDate !== undefined) apiUpdates.renewal_date = updates.renewalDate || null;
            if (updates.lastPaymentDate !== undefined) apiUpdates.last_payment_date = updates.lastPaymentDate || null;
            if (updates.notes !== undefined) apiUpdates.notes = updates.notes || null;
            if (updates.status !== undefined) apiUpdates.status = updates.status;

            const response = await fetch(`/api/projects/${projectId}/services/${serviceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiUpdates),
            });

            if (response.ok) {
                // Update local state
                setService(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
                toast.success("Service updated", "Your changes have been saved");
                setShowEditModal(false);
            } else {
                throw new Error('Failed to update service');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error("Error", "Failed to update service");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddCredential = async (data: {
        type: CredentialTypeId;
        environment: "production" | "staging" | "development";
        fields: Record<string, string>;
        description?: string;
    }) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/services/${serviceId}/credentials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const newCredential = await response.json();
                // Add to local state - get the first field as the label
                const firstFieldKey = Object.keys(data.fields)[0];
                const label = data.fields[firstFieldKey] || data.type;
                
                setCredentials(prev => [...prev, {
                    id: newCredential.id || `temp-${Date.now()}`,
                    label,
                    value: '••••••••••••••••',
                    isSecret: true,
                    environment: data.environment,
                    credentialType: data.type,
                    description: data.description,
                    fields: data.fields,
                    createdAt: new Date().toISOString(),
                }]);
                
                toast.success("Credential added", "Your credential has been securely saved");
            } else {
                throw new Error('Failed to save credential');
            }
        } catch (error) {
            console.error('Error saving credential:', error);
            toast.error("Error", "Failed to save credential");
            throw error;
        }
    };

    // Handle sidebar tab changes - navigate to project page with the selected tab
    const handleSidebarTabChange = (tab: string) => {
        router.push(`/projects/${projectId}?tab=${tab}`);
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Project Sidebar - same as project page */}
            <Sidebar 
                project={project as Project} 
                activeTab="services" 
                onTabChange={handleSidebarTabChange} 
            />
            
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
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                            service.costAmount === 0 
                                                ? "bg-green-500/10 text-green-600" 
                                                : "bg-blue-500/10 text-blue-600"
                                        }`}>
                                            {service.costAmount === 0 ? "Free" : "Paid"}
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
                                onEditService={() => setShowEditModal(true)}
                            />
                        )}

                        {activeTab === "credentials" && (
                            <CredentialsTab
                                credentials={credentials}
                                visibleSecrets={visibleSecrets}
                                onToggleVisibility={toggleSecretVisibility}
                                onCopy={copyToClipboard}
                                onAddCredential={handleAddCredential}
                            />
                        )}

                        {activeTab === "settings" && (
                            <SettingsTab
                                service={service}
                                onDeleteClick={() => setShowDeleteModal(true)}
                                onUpdateService={handleUpdateService}
                                isSaving={isSaving}
                            />
                        )}
                    </div>
                </div>

                {/* Edit Service Modal */}
                <EditServiceModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    service={service}
                    onSave={handleUpdateService}
                    isSaving={isSaving}
                />

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
