"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import StatsBar from "./StatsBar";
import AlertsSection from "./AlertsSection";
import ProjectsGrid from "./ProjectsGrid";
import { mockProjects, mockAlerts, mockStats } from "@/data/mockProjects";
import { Project } from "@/types";

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
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("updated");
    const [alerts, setAlerts] = useState(mockAlerts);

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

    return (
        <Layout isLoggedIn>
            <div className="py-6 max-md:py-4">
                <div className="center">
                    <div className="mb-6 max-md:mb-4">
                        <h1 className="text-h2">Welcome, Steven</h1>
                    </div>

                    <StatsBar stats={mockStats} />

                    <AlertsSection
                        alerts={alerts}
                        onDismiss={handleDismissAlert}
                        onSnooze={handleSnoozeAlert}
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

                    <ProjectsGrid projects={sortedProjects} />
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
