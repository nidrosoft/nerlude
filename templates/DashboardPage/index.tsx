"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import StatsBar from "./StatsBar";
import AlertsSection from "./AlertsSection";
import ProjectsGrid from "./ProjectsGrid";
import QuickAccess from "./QuickAccess";
import ActivityFeed from "./ActivityFeed";
import { mockProjects, mockAlerts, mockStats } from "@/data/mockProjects";
import { mockServices } from "@/data/mockServices";
import { Project } from "@/types";
import { useUserStore, useProjectStore } from "@/stores";
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

const DashboardPage = () => {
    const { user } = useUserStore();
    const { setServices, services } = useProjectStore();
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("updated");
    const [alerts, setAlerts] = useState(mockAlerts);
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcomeTour, setShowWelcomeTour] = useState(false);
    
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
    
    // Initialize services in store (for quick access tracking)
    useEffect(() => {
        if (services.length === 0) {
            setServices(mockServices);
        }
    }, [services.length, setServices]);
    
    // Simulate data loading - replace with real data fetching later
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);
    
    // Get user's first name or fallback to "there"
    const userName = user?.name?.split(" ")[0] || "there";

    const filteredProjects = mockProjects.filter((project: Project) => {
        if (activeFilter === "all") return true;
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

    const handleDismissAlert = (id: string) => {
        setAlerts(alerts.map((a) => (a.id === id ? { ...a, isDismissed: true } : a)));
    };

    const handleSnoozeAlert = (id: string) => {
        const snoozeDate = new Date();
        snoozeDate.setDate(snoozeDate.getDate() + 1);
        setAlerts(
            alerts.map((a) =>
                a.id === id ? { ...a, snoozedUntil: snoozeDate.toISOString() } : a
            )
        );
    };

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

    return (
        <Layout isLoggedIn isFixedHeader>
            <div className="pt-20 max-md:pt-16">
                {/* Sticky Header with Welcome and Stats */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-6 -mx-4 px-4 max-md:top-16">
                    <div className="center">
                        <div className="mb-6 max-md:mb-4 pt-6">
                            <h1 className="text-h2">Welcome, {userName}</h1>
                        </div>

                        <StatsBar stats={mockStats} />
                    </div>
                </div>

                <div className="center">
                    {/* Alerts & Activity Feed - Side by Side */}
                    <div className="flex gap-6 mb-8 max-lg:flex-col">
                        <div className="w-[55%] max-lg:w-full">
                            <AlertsSection
                                alerts={alerts}
                                onDismiss={handleDismissAlert}
                                onSnooze={handleSnoozeAlert}
                            />
                        </div>
                        <div className="w-[45%] max-lg:w-full">
                            <ActivityFeed />
                        </div>
                    </div>

                    {/* Quick Access */}
                    <QuickAccess 
                        services={mockServices} 
                        projects={mockProjects} 
                    />

                    <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-4">
                        <div className="flex gap-2">
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
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-small text-t-tertiary">Sort by:</span>
                            <select
                                className="px-3 py-1.5 rounded-lg bg-b-subtle border border-stroke-subtle text-small text-t-primary focus:outline-none focus:border-stroke-focus"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <ProjectsGrid 
                        projects={sortedProjects} 
                        services={mockServices}
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
