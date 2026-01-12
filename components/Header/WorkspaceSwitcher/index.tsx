"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Icon from "@/components/Icon";
import { useWorkspaceStore } from "@/stores";
import { Workspace } from "@/types";

const workspaceTypeIcons: Record<string, string> = {
    personal: "profile",
    startup: "lightning",
    agency: "briefcase",
    enterprise: "building",
};

const workspaceTypeColors: Record<string, string> = {
    personal: "bg-blue-500/10 text-blue-500",
    startup: "bg-purple-500/10 text-purple-500",
    agency: "bg-green-500/10 text-green-500",
    enterprise: "bg-amber-500/10 text-amber-500",
};

const WorkspaceSwitcher = () => {
    const { currentWorkspace, workspaces, setCurrentWorkspace, isLoading, setLoading } = useWorkspaceStore();
    const [isOpen, setIsOpen] = useState(false);

    if (!currentWorkspace) return null;

    const handleWorkspaceSelect = async (workspace: Workspace) => {
        if (workspace.id === currentWorkspace.id) {
            setIsOpen(false);
            return;
        }
        
        setLoading(true);
        setIsOpen(false);
        
        // Simulate a brief loading state for smooth transition
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCurrentWorkspace(workspace);
        setLoading(false);
    };

    const workspaceType = currentWorkspace.workspaceType || "personal";
    const iconName = workspaceTypeIcons[workspaceType] || "home";
    const colorClass = workspaceTypeColors[workspaceType] || workspaceTypeColors.personal;

    return (
        <Menu as="div" className="relative">
            <MenuButton 
                className="flex items-center gap-2 h-12 px-4 rounded-full border-[1.5px] border-stroke1 bg-b-surface2 text-t-secondary fill-t-secondary hover:border-stroke-highlight hover:bg-b-highlight hover:text-t-primary hover:fill-t-primary transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`flex items-center justify-center size-7 rounded-full ${colorClass}`}>
                    <Icon className="!w-4 !h-4" name={iconName} />
                </div>
                <span className="text-small font-medium text-t-primary max-w-[120px] truncate">
                    {currentWorkspace.name}
                </span>
                <Icon className="!w-4 !h-4 fill-t-tertiary" name="chevron" />
            </MenuButton>
            
            <MenuItems
                className="z-50 [--anchor-gap:1rem] w-64 shadow-hover bg-b-surface2 border border-stroke-subtle rounded-3xl outline-0 origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                anchor="bottom start"
                transition
            >
                <div className="p-3">
                    <div className="px-3 py-2 text-xs font-medium text-t-tertiary uppercase tracking-wider">
                        Workspaces
                    </div>
                    
                    {workspaces.map((workspace) => {
                        const wsType = workspace.workspaceType || "personal";
                        const wsIcon = workspaceTypeIcons[wsType] || "home";
                        const wsColor = workspaceTypeColors[wsType] || workspaceTypeColors.personal;
                        const isActive = workspace.id === currentWorkspace.id;
                        
                        return (
                            <MenuItem key={workspace.id}>
                                <button
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors ${
                                        isActive 
                                            ? "bg-primary1/10" 
                                            : "hover:bg-b-highlight"
                                    }`}
                                    onClick={() => handleWorkspaceSelect(workspace)}
                                >
                                    <div className={`flex items-center justify-center size-8 rounded-lg ${wsColor}`}>
                                        <Icon className="!w-4 !h-4" name={wsIcon} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-small font-medium truncate ${isActive ? "text-primary1" : "text-t-primary"}`}>
                                            {workspace.name}
                                        </div>
                                        <div className="text-xs text-t-tertiary capitalize">
                                            {wsType}
                                        </div>
                                    </div>
                                    {isActive && (
                                        <Icon className="!w-4 !h-4 fill-primary1 shrink-0" name="check" />
                                    )}
                                </button>
                            </MenuItem>
                        );
                    })}
                    
                    <div className="border-t border-stroke-subtle mt-2 pt-2">
                        <MenuItem>
                            <Link
                                href="/workspace/new"
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-[1.5px] border-stroke1 bg-b-surface1 text-t-secondary fill-t-secondary hover:border-stroke-highlight hover:bg-b-highlight hover:text-t-primary hover:fill-t-primary transition-all"
                            >
                                <div className="flex items-center justify-center size-8 rounded-lg bg-primary1/10">
                                    <Icon className="!w-4 !h-4 fill-primary1" name="plus" />
                                </div>
                                <span className="text-small font-medium">
                                    Create Workspace
                                </span>
                            </Link>
                        </MenuItem>
                    </div>
                </div>
            </MenuItems>
        </Menu>
    );
};

export default WorkspaceSwitcher;
