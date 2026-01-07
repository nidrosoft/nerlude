"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores";
import Icon from "@/components/Icon";
import { mockProjects } from "@/data/mockProjects";
import { mockServices } from "@/data/mockServices";

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: string;
    category: "navigation" | "project" | "service" | "action";
    action: () => void;
}

const CommandPalette = () => {
    const router = useRouter();
    const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Build command items
    const commands = useMemo<CommandItem[]>(() => {
        const items: CommandItem[] = [];

        // Navigation commands
        items.push(
            {
                id: "nav-dashboard",
                label: "Go to Dashboard",
                description: "View all your projects",
                icon: "cube",
                category: "navigation",
                action: () => router.push("/dashboard"),
            },
            {
                id: "nav-settings",
                label: "Go to Settings",
                description: "Manage your account",
                icon: "gear",
                category: "navigation",
                action: () => router.push("/settings/account"),
            },
            {
                id: "nav-new-project",
                label: "Create New Project",
                description: "Start a new project",
                icon: "plus",
                category: "navigation",
                action: () => router.push("/projects/new"),
            }
        );

        // Project commands
        mockProjects.forEach((project) => {
            items.push({
                id: `project-${project.id}`,
                label: project.name,
                description: `${project.type} project`,
                icon: "cube",
                category: "project",
                action: () => router.push(`/projects/${project.id}`),
            });
        });

        // Service commands (unique services)
        const uniqueServices = new Map<string, typeof mockServices[0]>();
        mockServices.forEach((service) => {
            if (!uniqueServices.has(service.name)) {
                uniqueServices.set(service.name, service);
            }
        });
        uniqueServices.forEach((service) => {
            items.push({
                id: `service-${service.id}`,
                label: service.name,
                description: service.categoryId,
                icon: "post",
                category: "service",
                action: () => {
                    const project = mockProjects.find(p => p.id === service.projectId);
                    if (project) {
                        router.push(`/projects/${project.id}`);
                    }
                },
            });
        });

        // Action commands
        items.push(
            {
                id: "action-add-service",
                label: "Add Service",
                description: "Add a new service to a project",
                icon: "plus",
                category: "action",
                action: () => {
                    const firstProject = mockProjects[0];
                    if (firstProject) {
                        router.push(`/projects/${firstProject.id}/services/new`);
                    }
                },
            },
            {
                id: "action-workspace-settings",
                label: "Workspace Settings",
                description: "Manage workspace and team",
                icon: "users",
                category: "action",
                action: () => router.push("/settings/workspace"),
            },
            {
                id: "action-billing",
                label: "Billing & Plan",
                description: "Manage your subscription",
                icon: "wallet",
                category: "action",
                action: () => router.push("/settings/plan"),
            }
        );

        return items;
    }, [router]);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
        if (!query.trim()) return commands;
        const lowerQuery = query.toLowerCase();
        return commands.filter(
            (cmd) =>
                cmd.label.toLowerCase().includes(lowerQuery) ||
                cmd.description?.toLowerCase().includes(lowerQuery)
        );
    }, [commands, query]);

    // Group commands by category
    const groupedCommands = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {
            navigation: [],
            project: [],
            service: [],
            action: [],
        };
        filteredCommands.forEach((cmd) => {
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isCommandPaletteOpen) {
                // Open with Cmd+K or Ctrl+K
                if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                    e.preventDefault();
                    setCommandPaletteOpen(true);
                }
                return;
            }

            switch (e.key) {
                case "Escape":
                    e.preventDefault();
                    setCommandPaletteOpen(false);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < filteredCommands.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredCommands.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action();
                        setCommandPaletteOpen(false);
                    }
                    break;
            }
        },
        [isCommandPaletteOpen, setCommandPaletteOpen, filteredCommands, selectedIndex]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Reset state when opening
    useEffect(() => {
        if (isCommandPaletteOpen) {
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isCommandPaletteOpen]);

    // Reset selected index when filtered results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (!isCommandPaletteOpen) return null;

    const categoryLabels: Record<string, string> = {
        navigation: "Navigation",
        project: "Projects",
        service: "Services",
        action: "Actions",
    };

    let flatIndex = -1;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#282828]/80 backdrop-blur-sm"
                onClick={() => setCommandPaletteOpen(false)}
            />

            {/* Palette */}
            <div className="relative z-10 w-full max-w-xl mx-4 rounded-3xl bg-b-surface1 shadow-2xl border border-stroke-subtle overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center px-5 border-b border-stroke-subtle">
                    <Icon className="!w-5 !h-5 fill-t-tertiary mr-3" name="search" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search commands, projects, services..."
                        className="flex-1 py-4 bg-transparent text-body text-t-primary placeholder:text-t-tertiary focus:outline-none"
                        autoFocus
                    />
                    <kbd className="px-2 py-1 rounded-lg bg-b-surface2 text-xs text-t-tertiary font-mono">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <div className="py-8 text-center text-t-tertiary">
                            No results found for "{query}"
                        </div>
                    ) : (
                        Object.entries(groupedCommands).map(([category, items]) => {
                            if (items.length === 0) return null;
                            return (
                                <div key={category} className="mb-2">
                                    <div className="px-3 py-2 text-xs font-medium text-t-tertiary uppercase tracking-wider">
                                        {categoryLabels[category]}
                                    </div>
                                    {items.map((item) => {
                                        flatIndex++;
                                        const isSelected = flatIndex === selectedIndex;
                                        const currentIndex = flatIndex;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    item.action();
                                                    setCommandPaletteOpen(false);
                                                }}
                                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                className={`flex items-center w-full px-3 py-2.5 rounded-xl transition-colors ${
                                                    isSelected
                                                        ? "bg-b-surface2 text-t-primary"
                                                        : "text-t-secondary hover:bg-b-surface2 hover:text-t-primary"
                                                }`}
                                            >
                                                <div className={`flex items-center justify-center size-8 mr-3 rounded-lg bg-b-surface2 ${isSelected ? "fill-t-primary" : "fill-t-tertiary"}`}>
                                                    <Icon className="!w-4 !h-4" name={item.icon} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="text-small font-medium">
                                                        {item.label}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-xs text-t-tertiary">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <kbd className="px-2 py-1 rounded-lg bg-b-surface1 text-xs text-t-tertiary font-mono">
                                                        ↵
                                                    </kbd>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-stroke-subtle bg-b-surface2/50">
                    <div className="flex items-center gap-4 text-xs text-t-tertiary">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">↑</kbd>
                            <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">↓</kbd>
                            to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">↵</kbd>
                            to select
                        </span>
                    </div>
                    <div className="text-xs text-t-tertiary">
                        <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono ml-1">K</kbd>
                        to open
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
