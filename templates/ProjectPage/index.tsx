"use client";

import { useState, useEffect } from "react";
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
import { mockProjects, mockAlerts } from "@/data/mockProjects";
import { mockServices, categoryLabels } from "@/data/mockServices";
import { mockStacks } from "@/data/mockStacks";
import Skeleton, { SkeletonText } from "@/components/Skeleton";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Dropdown from "@/components/Dropdown";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import { ServiceCategory } from "@/types";
import { getCategoryColor } from "@/utils/categoryColors";

type Props = {
    projectId: string;
};

const ProjectPage = ({ projectId }: Props) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
    const [viewMode, setViewMode] = useState<"list" | "graph">("list");
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showTeamInviteModal, setShowTeamInviteModal] = useState(false);
    const [showAssetUploadModal, setShowAssetUploadModal] = useState(false);
    const [showNewDocModal, setShowNewDocModal] = useState(false);
    const toast = useToast();

    const project = mockProjects.find((p) => p.id === projectId);
    const projectServices = mockServices.filter((s) => s.projectId === projectId);
    const projectStacks = mockStacks.filter((s) => s.projectId === projectId);
    const projectAlerts = mockAlerts.filter((a) => a.projectId === projectId);

    // Simulate data loading - replace with real data fetching later
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [projectId]);

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
                return <Assets projectId={projectId} showUploadModal={showAssetUploadModal} onCloseUploadModal={() => setShowAssetUploadModal(false)} />;
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
                            <Button isStroke as="link" href={`/projects/${project.id}/services/new`}>
                                <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                Add Service
                            </Button>
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
                                            <button onClick={() => { toast.success("Project duplicated", "A copy of this project has been created."); setShowActionsMenu(false); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-t-secondary hover:bg-b-surface1 hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary">
                                                <Icon className="!w-4 !h-4 mr-3" name="copy" />Duplicate
                                            </button>
                                            <button onClick={() => { toast.success("Export started", "Your project data is being exported."); setShowActionsMenu(false); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-t-secondary hover:bg-b-surface1 hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary">
                                                <Icon className="!w-4 !h-4 mr-3" name="export" />Export
                                            </button>
                                            <div className="my-2 border-t border-stroke-subtle" />
                                            <button onClick={() => { toast.warning("Project archived", "This project has been moved to archives."); setShowActionsMenu(false); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-amber-500 hover:bg-amber-500/10 transition-colors fill-amber-500">
                                                <Icon className="!w-4 !h-4 mr-3" name="documents" />Archive
                                            </button>
                                            <button onClick={() => { toast.error("Project deleted", "This project has been permanently deleted."); setShowActionsMenu(false); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-small text-red-500 hover:bg-red-500/10 transition-colors fill-red-500">
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
                            <Button isStroke as="link" href={`/projects/${projectId}/services/new`}>
                                <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                Add Service
                            </Button>
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
                                { label: "Add Service", icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="cube" />, onClick: () => { window.location.href = `/projects/${projectId}/services/new`; } },
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
                onTabChange={setActiveTab}
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
                                { label: tabLabels[activeTab] },
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
        </Layout>
    );
};

export default ProjectPage;
