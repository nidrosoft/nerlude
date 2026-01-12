"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Layout from "@/components/Layout";
import StatsBar from "./StatsBar";
import ProjectsGrid from "./ProjectsGrid";
import QuickAccess from "./QuickAccess";
import ActivityFeed from "./ActivityFeed";
import Icon from "@/components/Icon";
import { Project, DashboardStats, Service, Alert } from "@/types";
import { useUserStore, useProjectStore, useWorkspaceStore } from "@/stores";
import { SkeletonProjectCard, SkeletonStats } from "@/components/Skeleton";
import Skeleton from "@/components/Skeleton";
import WelcomeTour from "@/components/WelcomeTour";

const filterTabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
    { id: "archived", label: "Archived" },
];

const sortOptions = [
    { id: "updated", label: "Last Updated" },
    { id: "name", label: "Name" },
    { id: "cost", label: "Cost" },
    { id: "alerts", label: "Alerts" },
];

// Default stats for loading state
const defaultStats: DashboardStats = {
    totalProjects: 0,
    monthlyBurn: 0,
    totalServices: 0,
    upcomingRenewals: 0,
};

const DashboardPage = () => {
    const { user } = useUserStore();
    const { setServices, services } = useProjectStore();
    const { currentWorkspace } = useWorkspaceStore();
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("updated");
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcomeTour, setShowWelcomeTour] = useState(false);
    
    // Real data state
    const [stats, setStats] = useState<DashboardStats>(defaultStats);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectServices, setProjectServices] = useState<Service[]>([]);
    
    // Fetch dashboard data from API
    const fetchDashboardData = useCallback(async () => {
        try {
            // Build query params for workspace filtering
            const workspaceParam = currentWorkspace ? `?workspace_id=${currentWorkspace.id}` : '';
            
            // Fetch stats, projects, alerts, and notifications in parallel
            const [statsRes, projectsRes, alertsRes, notificationsRes] = await Promise.all([
                fetch(`/api/dashboard/stats${workspaceParam}`),
                fetch(`/api/projects${workspaceParam}`),
                fetch(`/api/dashboard/alerts${workspaceParam}`),
                fetch('/api/notifications'),
            ]);
            
            // Process notifications from the notifications table
            if (notificationsRes.ok) {
                const notificationsData = await notificationsRes.json();
                // Transform notifications to Alert type for the header
                const notificationAlerts: Alert[] = notificationsData.map((n: Record<string, unknown>) => {
                    // Determine priority based on notification type
                    let priority: 'high' | 'medium' | 'low' = 'medium';
                    if (n.type === 'renewal_urgent' || n.type === 'member_removed') {
                        priority = 'high';
                    } else if (n.type === 'renewal_reminder' || n.type === 'member_invited') {
                        priority = 'medium';
                    } else {
                        priority = 'low';
                    }
                    
                    // Determine alert type
                    let alertType: 'renewal' | 'cost_alert' | 'team' | 'system' = 'system';
                    if (n.type === 'renewal_urgent' || n.type === 'renewal_reminder') {
                        alertType = 'renewal';
                    } else if (n.type === 'member_invited' || n.type === 'member_removed' || n.type === 'member_role_changed' || n.type === 'member_joined') {
                        alertType = 'team';
                    }
                    
                    const data = n.data as Record<string, unknown> || {};
                    
                    return {
                        id: n.id as string,
                        type: alertType,
                        priority,
                        title: n.title as string,
                        message: n.message as string,
                        projectId: data.project_id as string | undefined,
                        projectName: data.project_name as string | undefined,
                        serviceId: data.service_id as string | undefined,
                        serviceName: data.service_name as string | undefined,
                        dueDate: data.renewal_date as string | undefined,
                        isRead: !!n.read_at,
                        isDismissed: !!n.dismissed_at,
                    };
                });
                setAlerts(notificationAlerts);
            }
            
            // Process dashboard alerts (renewals, cost alerts) as fallback
            if (alertsRes.ok && alerts.length === 0) {
                const alertsData = await alertsRes.json();
                // Transform API alerts to frontend Alert type
                const transformedAlerts: Alert[] = alertsData.map((a: Record<string, unknown>) => ({
                    id: a.id,
                    type: a.type === 'renewal' ? 'renewal' : 'cost_alert',
                    priority: a.severity as 'low' | 'medium' | 'high',
                    title: a.title,
                    message: a.message,
                    projectId: a.projectId,
                    projectName: a.projectName,
                    serviceId: a.serviceId,
                    serviceName: a.serviceName,
                    dueDate: a.date,
                    isRead: false,
                    isDismissed: false,
                }));
                // Merge with existing alerts (notifications take priority)
                setAlerts(prev => [...prev, ...transformedAlerts.filter(a => !prev.some(p => p.id === a.id))]);
            }
            
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats({
                    totalProjects: statsData.totalProjects || 0,
                    monthlyBurn: statsData.totalMonthlyCost || 0,
                    totalServices: statsData.totalServices || 0,
                    upcomingRenewals: statsData.upcomingRenewals || 0,
                });
            }
            
            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                // Transform DB format to frontend format
                const transformedProjects: Project[] = projectsData.map((p: Record<string, unknown>) => ({
                    id: p.id,
                    workspaceId: p.workspace_id,
                    name: p.name,
                    description: p.description,
                    icon: p.icon || '🚀',
                    type: p.type,
                    status: p.status || 'active',
                    monthlyCost: 0, // Will be calculated from services
                    serviceCount: (p.services as { count: number }[])?.[0]?.count || 0,
                    alertCount: 0, // Will be calculated from alerts
                    nextRenewal: undefined,
                    createdAt: p.created_at,
                    updatedAt: p.updated_at,
                }));
                setProjects(transformedProjects);
                
                // Fetch services for all projects
                if (transformedProjects.length > 0) {
                    const servicesPromises = transformedProjects.map((proj: Project) => 
                        fetch(`/api/projects/${proj.id}/services`).then(res => res.ok ? res.json() : [])
                    );
                    const allServicesArrays = await Promise.all(servicesPromises);
                    const allServices = allServicesArrays.flat();
                    setProjectServices(allServices);
                    setServices(allServices);
                }
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [setServices, currentWorkspace]);
    
    // Check if first-time user (show welcome tour)
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("nelrude_tour_completed");
        if (!hasSeenTour) {
            setShowWelcomeTour(true);
        }
    }, []);

    const handleTourComplete = () => {
        localStorage.setItem("nelrude_tour_completed", "true");
        setShowWelcomeTour(false);
    };
    
    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    
    // Initialize services in store (for quick access tracking)
    useEffect(() => {
        if (services.length === 0 && projectServices.length > 0) {
            setServices(projectServices);
        }
    }, [services.length, projectServices, setServices]);
    
    // Get user's first name or fallback to "there"
    const userName = user?.name?.split(" ")[0] || "there";

    const filteredProjects = projects.filter((project: Project) => {
        if (activeFilter === "all") return project.status !== "archived";
        return project.status === activeFilter;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.name.localeCompare(b.name);
            case "cost":
                return b.monthlyCost - a.monthlyCost;
            case "alerts":
                return b.alertCount - a.alertCount;
            case "updated":
            default:
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });

    if (isLoading) {
        return (
            <Layout isLoggedIn>
                <div className="py-6 max-md:py-4">
                    <div className="center">
                        <div className="mb-6 max-md:mb-4">
                            <Skeleton variant="text" height={36} className="w-64" />
                        </div>

                        <SkeletonStats count={4} className="mb-8 max-md:grid-cols-2" />

                        <div className="mb-8">
                            <Skeleton variant="text" height={24} className="w-32 mb-4" />
                            <div className="space-y-3">
                                <Skeleton variant="rounded" height={64} className="w-full" />
                                <Skeleton variant="rounded" height={64} className="w-full" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} variant="rounded" width={80} height={36} />
                                ))}
                            </div>
                            <Skeleton variant="rounded" width={150} height={36} />
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <SkeletonProjectCard key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleMarkAsRead = async (id: string) => {
        // Optimistically update UI
        setAlerts(alerts.map((a) => (a.id === id ? { ...a, isDismissed: true } : a)));
        // Call API to mark as read
        try {
            await fetch(`/api/notifications/${id}/dismiss`, { method: 'PATCH' });
        } catch (error) {
            console.error('Failed to dismiss notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        // Optimistically update UI
        setAlerts(alerts.map((a) => ({ ...a, isDismissed: true })));
        // Call API to dismiss all notifications
        try {
            await Promise.all(
                alerts.filter(a => !a.isDismissed).map(a => 
                    fetch(`/api/notifications/${a.id}/dismiss`, { method: 'PATCH' })
                )
            );
        } catch (error) {
            console.error('Failed to dismiss all notifications:', error);
        }
    };

    return (
        <Layout 
            isLoggedIn 
            isFixedHeader
            alerts={alerts}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
        >
            <div className="pt-24 max-md:pt-20">
                <div className="center">
                    {/* Welcome Header */}
                    <div className="mb-6 max-md:mb-4">
                        <h1 className="text-h2">Welcome, {userName}</h1>
                    </div>

                    {/* Stats Bar */}
                    <StatsBar stats={stats} />

                    {/* Activity Feed - Full Width */}
                    <div className="mb-8">
                        <ActivityFeed expanded />
                    </div>

                    {/* Quick Access - only show when we have projects */}
                    {projects.length > 0 && (
                        <QuickAccess 
                            services={projectServices} 
                            projects={projects} 
                        />
                    )}

                    {/* Filters and Sort - only show when we have projects */}
                    {projects.length > 0 && (
                        <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`px-4 py-2 rounded-full text-small font-medium transition-all ${
                                            activeFilter === tab.id
                                                ? "bg-t-primary text-b-surface1"
                                                : "bg-b-subtle text-t-secondary hover:bg-b-surface2"
                                        }`}
                                        onClick={() => setActiveFilter(tab.id)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                                <Link
                                    href="/projects/archived"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-small font-medium bg-b-subtle text-t-tertiary hover:bg-b-surface2 hover:text-t-secondary transition-all fill-t-tertiary hover:fill-t-secondary"
                                >
                                    <Icon className="!w-4 !h-4" name="documents" />
                                    Archived
                                </Link>
                            </div>
                            <Menu as="div" className="relative">
                                <MenuButton className="flex items-center gap-2 px-3 py-2 rounded-xl bg-b-surface2 border border-stroke-subtle text-small text-t-primary hover:bg-b-highlight transition-colors">
                                    <span className="text-t-tertiary">Sort by:</span>
                                    <span className="font-medium">{sortOptions.find(o => o.id === sortBy)?.label}</span>
                                    <Icon className="!w-4 !h-4 fill-t-tertiary" name="chevron" />
                                </MenuButton>
                                <MenuItems
                                    className="z-50 [--anchor-gap:0.5rem] w-40 shadow-hover bg-b-surface2 rounded-2xl outline-0 origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                                    anchor="bottom end"
                                    transition
                                >
                                    <div className="p-2">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.id}>
                                                <button
                                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-small transition-colors ${
                                                        sortBy === option.id 
                                                            ? "bg-primary1/10 text-primary1 font-medium" 
                                                            : "text-t-secondary hover:bg-b-highlight hover:text-t-primary"
                                                    }`}
                                                    onClick={() => setSortBy(option.id)}
                                                >
                                                    {option.label}
                                                    {sortBy === option.id && (
                                                        <Icon className="!w-4 !h-4 fill-primary1" name="check" />
                                                    )}
                                                </button>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                    )}

                    <ProjectsGrid 
                        projects={sortedProjects} 
                        services={projectServices}
                        alerts={alerts}
                    />
                </div>
            </div>

            {/* Welcome Tour for first-time users */}
            <WelcomeTour isOpen={showWelcomeTour} onComplete={handleTourComplete} />
        </Layout>
    );
};

export default DashboardPage;
