"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Services from "./Services";
import Stacks from "./Stacks";
import Assets from "./Assets";
import Docs from "./Docs";
import Team from "./Team";
import Settings from "./Settings";
import EnvironmentSwitcher from "@/components/EnvironmentSwitcher";
import { categoryLabels } from "@/data/mockServices";
import Skeleton, { SkeletonText } from "@/components/Skeleton";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Dropdown from "@/components/Dropdown";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import { ServiceCategory, Project, Service, ServiceStack, Alert } from "@/types";
import { getCategoryColor } from "@/utils/categoryColors";
import { useProjectLoading } from "@/components/ProjectLoadingOverlay";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

type Props = {
    projectId: string;
};

const ProjectPage = ({ projectId }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    
    // Update URL when tab changes (for persistence on refresh)
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        if (tab === 'overview') {
            params.delete('tab');
        } else {
            params.set('tab', tab);
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl, { scroll: false });
    };
    
    // Sync state with URL on mount/URL change
    useEffect(() => {
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [stacks, setStacks] = useState<ServiceStack[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
    const [viewMode, setViewMode] = useState<"list" | "graph">("list");
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showTeamInviteModal, setShowTeamInviteModal] = useState(false);
    const [showAssetUploadModal, setShowAssetUploadModal] = useState(false);
    const [showNewDocModal, setShowNewDocModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [assetFolderPath, setAssetFolderPath] = useState<{ id: string | null; name: string; onClick?: () => void }[]>([]);
    const [showServiceUpgradeModal, setShowServiceUpgradeModal] = useState(false);
    const toast = useToast();
    const { hideLoading } = useProjectLoading();
    const { plan, canAddService, canAddTeamMember, isDemoAccount } = useSubscription();

    // Check if user can add more services
    const serviceCheck = canAddService(services.length);
    const canAddMoreServices = isDemoAccount || serviceCheck.allowed;
    
    // Check if user can add more team members
    const teamCheck = canAddTeamMember();
    const canAddMoreTeamMembers = isDemoAccount || teamCheck.allowed;

    // Hide the project loading overlay when component mounts
    useEffect(() => {
        hideLoading();
    }, [hideLoading]);

    // Fetch all project data from APIs
    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            try {
                // Fetch project, services, and stacks in parallel
                const [projectRes, servicesRes, stacksRes] = await Promise.all([
                    fetch(`/api/projects/${projectId}`),
                    fetch(`/api/projects/${projectId}/services`),
                    fetch(`/api/projects/${projectId}/stacks`).catch(() => ({ ok: false, json: () => [] })),
                ]);

                // Handle project response
                if (!projectRes.ok) {
                    if (projectRes.status === 404) {
                        setProject(null);
                        return;
                    }
                    throw new Error('Failed to fetch project');
                }
                const projectData = await projectRes.json();
                setProject({
                    id: projectData.id,
                    workspaceId: projectData.workspace_id,
                    name: projectData.name,
                    description: projectData.description || '',
                    icon: projectData.icon || '🚀',
                    type: projectData.type,
                    status: projectData.status || 'active',
                    monthlyCost: 0,
                    serviceCount: 0,
                    alertCount: 0,
                    createdAt: projectData.created_at,
                    updatedAt: projectData.updated_at,
                });

                // Handle services response
                if (servicesRes.ok) {
                    const servicesData = await servicesRes.json();
                    const mappedServices: Service[] = servicesData.map((s: any) => ({
                        id: s.id,
                        projectId: s.project_id,
                        stackId: s.stack_id,
                        registryId: s.registry_id,
                        categoryId: s.category_id || 'custom',
                        subCategoryId: s.sub_category_id,
                        name: s.name,
                        customLogoUrl: s.custom_logo_url,
                        plan: s.plan,
                        costAmount: s.cost_amount || 0,
                        costFrequency: s.cost_frequency || 'monthly',
                        currency: s.currency || 'USD',
                        renewalDate: s.renewal_date,
                        status: s.status || 'active',
                        notes: s.notes,
                        createdAt: s.created_at,
                        updatedAt: s.updated_at,
                    }));
                    setServices(mappedServices);
                }

                // Handle stacks response
                if (stacksRes.ok) {
                    const stacksData = await stacksRes.json();
                    const mappedStacks: ServiceStack[] = (stacksData || []).map((s: any) => ({
                        id: s.id,
                        projectId: s.project_id,
                        name: s.name,
                        description: s.description,
                        color: s.color || 'slate',
                        icon: s.icon,
                        order: s.order || 0,
                        createdAt: s.created_at,
                        updatedAt: s.updated_at,
                    }));
                    setStacks(mappedStacks);
                }

            } catch (error) {
                console.error('Error fetching project data:', error);
                toast.error("Error", "Failed to load project");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Project action handlers
    const handleDuplicate = async () => {
        setIsDuplicating(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/duplicate`, {
                method: 'POST',
            });
            if (response.ok) {
                const newProject = await response.json();
                toast.success("Project duplicated", `"${project?.name} (Copy)" has been created.`);
                setShowActionsMenu(false);
                // Redirect to the new project
                window.location.href = `/projects/${newProject.id}`;
            } else {
                const error = await response.json();
                toast.error("Error", error.error || "Failed to duplicate project");
            }
        } catch (error) {
            console.error('Error duplicating project:', error);
            toast.error("Error", "Failed to duplicate project");
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Gather all project data
            const exportData = {
                project: project,
                services: services,
                stacks: stacks,
                exportedAt: new Date().toISOString(),
            };
            
            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project?.name?.replace(/\s+/g, '-').toLowerCase() || 'project'}-export.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success("Export complete", "Your project data has been downloaded.");
            setShowActionsMenu(false);
        } catch (error) {
            console.error('Error exporting project:', error);
            toast.error("Error", "Failed to export project");
        } finally {
            setIsExporting(false);
        }
    };

    const handleArchive = async () => {
        setIsArchiving(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/archive`, {
                method: 'POST',
            });
            if (response.ok) {
                toast.success("Project archived", "This project has been moved to archives.");
                setShowActionsMenu(false);
                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                const error = await response.json();
                toast.error("Error", error.error || "Failed to archive project");
            }
        } catch (error) {
            console.error('Error archiving project:', error);
            toast.error("Error", "Failed to archive project");
        } finally {
            setIsArchiving(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== project?.name) {
            toast.error("Error", "Please type the project name to confirm deletion");
            return;
        }
        
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success("Project deleted", "This project has been permanently deleted.");
                setShowDeleteModal(false);
                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                const error = await response.json();
                toast.error("Error", error.error || "Failed to delete project");
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error("Error", "Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    // Use state data
    const projectServices = services;
    const projectStacks = stacks;
    const projectAlerts = alerts;

    if (isLoading) {
        return (
            <Layout isLoggedIn>
                <div className="min-h-[calc(100vh-80px)] pl-24 py-6 max-md:pl-4">
                    <div className="center">
                        {/* Project Header Skeleton */}
                        <div className="flex items-start gap-4 mb-8">
                            <Skeleton variant="rounded" width={64} height={64} />
                            <div className="flex-1">
                                <Skeleton variant="text" height={32} className="w-48 mb-2" />
                                <Skeleton variant="text" height={16} className="w-32" />
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-4 gap-4 mb-8 max-md:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-4 rounded-2xl bg-b-surface2">
                                    <Skeleton variant="text" height={14} className="w-20 mb-2" />
                                    <Skeleton variant="text" height={24} className="w-16" />
                                </div>
                            ))}
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-6 rounded-3xl bg-b-surface2">
                            <Skeleton variant="text" height={24} className="w-32 mb-4" />
                            <SkeletonText lines={4} />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout isLoggedIn>
                <div className="py-20 text-center">
                    <h1 className="text-h2 mb-4">Project not found</h1>
                    <p className="text-t-secondary">
                        The project you're looking for doesn't exist.
                    </p>
                </div>
            </Layout>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <Overview
                        project={project}
                        services={projectServices}
                        alerts={projectAlerts}
                    />
                );
            case "services":
                return <Services services={projectServices} projectId={projectId} activeCategory={activeCategory} />;
            case "stacks":
                return <Stacks services={projectServices} stacks={projectStacks} projectId={projectId} viewMode={viewMode} />;
            case "assets":
                return <Assets projectId={projectId} showUploadModal={showAssetUploadModal} onCloseUploadModal={() => setShowAssetUploadModal(false)} onBreadcrumbChange={setAssetFolderPath} />;
            case "docs":
                return <Docs projectId={projectId} showNewDocModal={showNewDocModal} onCloseNewDocModal={() => setShowNewDocModal(false)} />;
            case "team":
                return <Team projectId={projectId} showInviteModal={showTeamInviteModal} onCloseInviteModal={() => setShowTeamInviteModal(false)} />;
            case "settings":
                return <Settings project={project} />;
            default:
                return null;
        }
    };

    const tabLabels: Record<string, string> = {
        overview: "Overview",
        services: "Services",
        stacks: "Stacks",
        assets: "Assets",
        docs: "Docs",
        team: "Team",
        settings: "Settings",
    };

    // Services data for header
    const servicesByCategory = projectServices.reduce((acc, service) => {
        if (!acc[service.categoryId]) {
            acc[service.categoryId] = [];
        }
        acc[service.categoryId].push(service);
        return acc;
    }, {} as Record<ServiceCategory, typeof projectServices>);
    const categories = Object.keys(servicesByCategory) as ServiceCategory[];
    const totalMonthlyCost = projectServices.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);
    const stacksTotalCost = projectServices.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);

    // Render tab-specific header content
    const renderTabHeader = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Overview</h2>
                        <div className="flex gap-2">
                            {canAddMoreServices ? (
                                <Button isStroke as="link" href={`/projects/${project.id}/services/new`}>
                                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                    Add Service
                                </Button>
                            ) : (
                                <Button 
                                    isStroke 
                                    onClick={() => setShowServiceUpgradeModal(true)}
                                    className="!border-amber-500/30 !text-amber-600 hover:!bg-amber-500/10"
                                >
                                    <Icon className="mr-2 !w-5 !h-5 !fill-amber-500" name="lock" />
                                    Add Service
                                    <span className="ml-2 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">Upgrade</span>
                                </Button>
                            )}
                            <div className="relative">
                                <button
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    className="flex items-center justify-center size-11 rounded-full border border-stroke-subtle bg-b-surface1 hover:bg-b-surface2 hover:shadow-hover transition-all fill-t-secondary hover:fill-t-primary"
                                >
                                    <Icon className="!w-5 !h-5" name="more" />
                                </button>
                                {showActionsMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowActionsMenu(false)} />
                                        <div className="absolute right-0 top-12 z-50 w-48 p-2 rounded-2xl bg-b-surface2 shadow-lg border border-stroke-subtle">
                                            <button 
                                                onClick={handleDuplicate} 
                                                disabled={isDuplicating}
                                                className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-t-secondary hover:bg-b-surface1 hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary disabled:opacity-50"
                                            >
                                                <Icon className="!w-4 !h-4 mr-3" name="copy" />
                                                {isDuplicating ? "Duplicating..." : "Duplicate"}
                                            </button>
                                            <button 
                                                onClick={handleExport} 
                                                disabled={isExporting}
                                                className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-t-secondary hover:bg-b-surface1 hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary disabled:opacity-50"
                                            >
                                                <Icon className="!w-4 !h-4 mr-3" name="export" />
                                                {isExporting ? "Exporting..." : "Export"}
                                            </button>
                                            <div className="my-2 border-t border-stroke-subtle" />
                                            <button 
                                                onClick={handleArchive} 
                                                disabled={isArchiving}
                                                className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-amber-500 hover:bg-amber-500/10 transition-colors fill-amber-500 disabled:opacity-50"
                                            >
                                                <Icon className="!w-4 !h-4 mr-3" name="documents" />
                                                {isArchiving ? "Archiving..." : "Archive"}
                                            </button>
                                            <button 
                                                onClick={() => { setShowDeleteModal(true); setShowActionsMenu(false); }} 
                                                className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-red-500 hover:bg-red-500/10 transition-colors fill-red-500"
                                            >
                                                <Icon className="!w-4 !h-4 mr-3" name="close" />Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "services":
                return (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-h3">Services</h2>
                                <p className="text-small text-t-secondary mt-1">
                                    {projectServices.length} services · ${Math.round(totalMonthlyCost)}/mo total
                                </p>
                            </div>
                            {canAddMoreServices ? (
                                <Button isStroke as="link" href={`/projects/${projectId}/services/new`}>
                                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                    Add Service
                                </Button>
                            ) : (
                                <Button 
                                    isStroke 
                                    onClick={() => setShowServiceUpgradeModal(true)}
                                    className="!border-amber-500/30 !text-amber-600 hover:!bg-amber-500/10"
                                >
                                    <Icon className="mr-2 !w-5 !h-5 !fill-amber-500" name="lock" />
                                    Add Service
                                    <span className="ml-2 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">Upgrade</span>
                                </Button>
                            )}
                        </div>
                        <div className="relative pb-4 border-b border-stroke-subtle">
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
                                <button onClick={() => setActiveCategory("all")} className={`shrink-0 px-4 py-2 rounded-full text-base font-medium transition-all ${activeCategory === "all" ? "bg-t-primary text-b-surface1" : "bg-b-surface2 text-t-secondary hover:bg-b-surface1"}`}>
                                    All ({projectServices.length})
                                </button>
                                {categories.map((category) => (
                                    <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium transition-all ${activeCategory === category ? "bg-t-primary text-b-surface1" : "bg-b-surface2 text-t-secondary hover:bg-b-surface1"}`}>
                                        {categoryLabels[category] || category} ({servicesByCategory[category].length})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );
            case "stacks":
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-h3">Stacks</h2>
                            <p className="text-small text-t-secondary mt-1">
                                {projectStacks.length} stacks · {projectServices.length} services · ${Math.round(stacksTotalCost)}/mo
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <EnvironmentSwitcher />
                            <div className="flex items-center gap-1 p-1 bg-b-surface2 rounded-full">
                                <button onClick={() => setViewMode("list")} className={cn("flex items-center gap-2 h-10 px-4 rounded-full text-small font-medium transition-all", viewMode === "list" ? "bg-b-surface1 text-t-primary fill-t-primary shadow-sm" : "text-t-tertiary fill-t-tertiary hover:text-t-primary hover:fill-t-primary hover:bg-b-surface1")}>
                                    <Icon className="!w-4 !h-4" name="align-right" />List
                                </button>
                                <button onClick={() => setViewMode("graph")} className={cn("flex items-center gap-2 h-10 px-4 rounded-full text-small font-medium transition-all", viewMode === "graph" ? "bg-b-surface1 text-t-primary fill-t-primary shadow-sm" : "text-t-tertiary fill-t-tertiary hover:text-t-primary hover:fill-t-primary hover:bg-b-surface1")}>
                                    <Icon className="!w-4 !h-4" name="chart" />Graph
                                </button>
                            </div>
                            <Dropdown trigger={<Button isCircle isStroke><Icon className="!w-5 !h-5 fill-inherit" name="plus" /></Button>} items={[
                                { label: "New Stack", icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="align-right" />, onClick: () => {} },
                                { 
                                    label: canAddMoreServices ? "Add Service" : "Add Service (Upgrade)", 
                                    icon: <Icon className={`!w-5 !h-5 ${canAddMoreServices ? 'fill-t-tertiary' : 'fill-amber-500'}`} name={canAddMoreServices ? "cube" : "lock"} />, 
                                    onClick: () => { 
                                        if (canAddMoreServices) {
                                            window.location.href = `/projects/${projectId}/services/new`; 
                                        } else {
                                            setShowServiceUpgradeModal(true);
                                        }
                                    } 
                                },
                                { label: "Upload Asset", icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="documents" />, onClick: () => {} },
                            ]} />
                        </div>
                    </div>
                );
            case "assets":
                return (
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Assets</h2>
                        <Button isStroke onClick={() => setShowAssetUploadModal(true)}>
                            <Icon className="mr-2 !w-5 !h-5" name="plus" />
                            Upload Asset
                        </Button>
                    </div>
                );
            case "docs":
                return (
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Docs & Notes</h2>
                        <Button isStroke onClick={() => setShowNewDocModal(true)}>
                            <Icon className="mr-2 !w-5 !h-5" name="plus" />
                            New Document
                        </Button>
                    </div>
                );
            case "team":
                return (
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Team</h2>
                        <Button isStroke onClick={() => setShowTeamInviteModal(true)}>
                            <Icon className="mr-2 !w-5 !h-5" name="plus" />
                            Invite Member
                        </Button>
                    </div>
                );
            case "settings":
                return (
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Settings</h2>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <Sidebar
                project={project}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header with Breadcrumb and Tab Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 -mx-4 px-4 pb-6">
                    <div className="center">
                        {/* Breadcrumb Navigation */}
                        <Breadcrumb 
                            className="pt-4 mb-6"
                            items={[
                                { label: "Dashboard", href: "/dashboard" },
                                { label: project.name, href: `/projects/${project.id}` },
                                ...(activeTab === "assets" && assetFolderPath.length > 0
                                    ? assetFolderPath.map((item, index) => ({
                                        label: item.name,
                                        onClick: item.onClick,
                                    }))
                                    : [{ label: tabLabels[activeTab] }]
                                ),
                            ]}
                        />
                        {/* Tab-specific Header */}
                        {renderTabHeader()}
                    </div>
                </div>
                
                <div className="center">
                    {renderContent()}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-[#282828]/90"
                        onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <div className="flex items-center justify-center size-16 rounded-full bg-red-500/10 mx-auto mb-6">
                            <Icon className="!w-8 !h-8 fill-red-500" name="close" />
                        </div>
                        <h3 className="text-h4 text-center mb-2">Delete Project</h3>
                        <p className="text-small text-t-secondary text-center mb-6">
                            This action cannot be undone. This will permanently delete the 
                            <strong className="text-t-primary"> {project.name} </strong> 
                            project and all of its services, documents, and assets.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-small text-t-secondary mb-2">
                                Type <strong className="text-t-primary">{project.name}</strong> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={project.name}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 border border-stroke-subtle text-t-primary placeholder:text-t-tertiary focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                            >
                                Cancel
                            </Button>
                            <button
                                className="flex-1 h-12 px-6 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDelete}
                                disabled={deleteConfirmText !== project.name || isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Service Upgrade Modal */}
            <UpgradeModal
                isOpen={showServiceUpgradeModal}
                onClose={() => setShowServiceUpgradeModal(false)}
                title="Service Limit Reached"
                message={`You've reached your limit of ${plan.maxServicesPerProject} services per project on the ${plan.name} plan. Upgrade to add more services.`}
                suggestedPlan={plan.id === "free" ? "Pro" : "Team"}
                limitType="services"
            />
        </Layout>
    );
};

export default ProjectPage;
