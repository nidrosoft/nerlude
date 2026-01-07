"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import Icon from "@/components/Icon";

type Props = {
    project: Project;
    activeTab: string;
    onTabChange: (tab: string) => void;
};

const navItems = [
    { id: "overview", label: "Overview", icon: "cube" },
    { id: "services", label: "Services", icon: "post" },
    { id: "stacks", label: "Stacks", icon: "align-right" },
    { id: "assets", label: "Assets", icon: "documents" },
    { id: "docs", label: "Docs & Notes", icon: "edit" },
    { id: "team", label: "Team", icon: "profile" },
    { id: "settings", label: "Settings", icon: "edit-list" },
];

const statusColors: Record<string, string> = {
    active: "bg-green-500",
    paused: "bg-amber-500",
    archived: "bg-gray-400",
};

const Sidebar = ({ project, activeTab, onTabChange }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40 max-md:hidden"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div
                className="flex flex-col p-3 rounded-3xl bg-b-surface2 shadow-lg backdrop-blur-sm transition-[width] duration-300 ease-in-out overflow-hidden"
                style={{ width: isExpanded ? '224px' : '64px' }}
            >
                {/* Project Header */}
                <div className={`flex mb-4 pb-4 border-b border-stroke-subtle ${isExpanded ? "items-center px-2" : ""}`}>
                    <div className={`flex items-center justify-center size-10 rounded-full border-[1.5px] border-primary1/15 bg-primary1/5 shrink-0 ${isExpanded ? "" : "mx-auto"}`}>
                        <span className="text-lg">{project.icon}</span>
                    </div>
                    <div className={`min-w-0 overflow-hidden transition-opacity duration-200 ${isExpanded ? "ml-3 opacity-100" : "opacity-0 w-0 ml-0"}`}>
                        <div className="font-medium text-t-primary truncate text-small whitespace-nowrap">
                            {project.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
                            <span className="text-xs text-t-tertiary capitalize whitespace-nowrap">
                                {project.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex items-center rounded-xl transition-colors duration-200 px-2.5 py-2.5 ${
                                activeTab === item.id
                                    ? "bg-t-primary text-b-surface1 fill-b-surface1"
                                    : "text-t-secondary fill-t-secondary hover:bg-b-surface1 hover:text-t-primary hover:fill-t-primary"
                            }`}
                            title={!isExpanded ? item.label : undefined}
                        >
                            <Icon className="!w-5 !h-5 shrink-0" name={item.icon} />
                            <span className={`ml-3 text-small font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="my-4 border-t border-stroke-subtle" />

                {/* Back to Dashboard */}
                <Link
                    href="/dashboard"
                    className="flex items-center rounded-xl text-t-secondary fill-t-secondary hover:bg-b-surface1 hover:text-t-primary hover:fill-t-primary transition-colors duration-200 px-2.5 py-2.5"
                    title={!isExpanded ? "Back to Dashboard" : undefined}
                >
                    <Icon className="!w-5 !h-5 shrink-0" name="arrow" />
                    <span className={`ml-3 text-small font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                        Dashboard
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
