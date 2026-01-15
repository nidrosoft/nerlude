"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import { useWorkspaceStore } from "@/stores";

type ActionId = "project" | "workspace" | "service" | "member";

interface QuickAction {
    id: ActionId;
    title: string;
    icon: string;
    url: string;
    description: string;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    disabledBgColor: string;
    disabledBorderColor: string;
}

const quickActions: QuickAction[] = [
    {
        id: "project",
        title: "New Project",
        icon: "documents",
        url: "/projects/new",
        description: "Create a new project",
        bgColor: "bg-primary1/10",
        borderColor: "border-primary1/30",
        iconColor: "fill-primary1",
        disabledBgColor: "bg-gray-500/10",
        disabledBorderColor: "border-gray-500/20",
    },
    {
        id: "workspace",
        title: "New Workspace",
        icon: "home",
        url: "/workspace/new",
        description: "Create a new workspace",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        iconColor: "fill-amber-500",
        disabledBgColor: "bg-gray-500/10",
        disabledBorderColor: "border-gray-500/20",
    },
    {
        id: "service",
        title: "Add Service",
        icon: "post",
        url: "/projects?action=add-service",
        description: "Add service to project",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        iconColor: "fill-purple-500",
        disabledBgColor: "bg-gray-500/10",
        disabledBorderColor: "border-gray-500/20",
    },
    {
        id: "member",
        title: "Invite Member",
        icon: "users",
        url: "/settings/workspace?tab=members",
        description: "Invite team member",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        iconColor: "fill-green-500",
        disabledBgColor: "bg-gray-500/10",
        disabledBorderColor: "border-gray-500/20",
    },
];

const QuickActions = () => {
    const { plan, canCreateProject, canAddTeamMember, isDemoAccount } = useSubscription();
    const { workspaces } = useWorkspaceStore();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeConfig, setUpgradeConfig] = useState<{ title: string; message: string; suggestedPlan: string; limitType: "projects" | "team" | "services" | "credentials" | "storage" | "integrations" | "feature" }>({ title: "", message: "", suggestedPlan: "Pro", limitType: "projects" });

    // Check limits for each action
    const getActionStatus = (actionId: ActionId): { allowed: boolean; upgradeMessage: string } => {
        if (isDemoAccount) return { allowed: true, upgradeMessage: "" };

        switch (actionId) {
            case "project": {
                const check = canCreateProject();
                return {
                    allowed: check.allowed,
                    upgradeMessage: check.allowed ? "" : `Upgrade to create more than ${plan.maxProjects} project${plan.maxProjects === 1 ? '' : 's'}`,
                };
            }
            case "workspace": {
                const currentCount = workspaces?.length || 0;
                const allowed = plan.maxWorkspaces === -1 || currentCount < plan.maxWorkspaces;
                return {
                    allowed,
                    upgradeMessage: allowed ? "" : `Upgrade to create more than ${plan.maxWorkspaces} workspace${plan.maxWorkspaces === 1 ? '' : 's'}`,
                };
            }
            case "member": {
                const check = canAddTeamMember();
                return {
                    allowed: check.allowed,
                    upgradeMessage: check.allowed ? "" : `Upgrade to invite more than ${plan.maxTeamMembers} team member${plan.maxTeamMembers === 1 ? '' : 's'}`,
                };
            }
            case "service":
                // Service limit is per-project, so we allow navigation but check on the page
                return { allowed: true, upgradeMessage: "" };
            default:
                return { allowed: true, upgradeMessage: "" };
        }
    };

    const handleActionClick = (action: QuickAction, e: React.MouseEvent) => {
        const status = getActionStatus(action.id);
        if (!status.allowed) {
            e.preventDefault();
            setUpgradeConfig({
                title: `${action.title} Limit Reached`,
                message: status.upgradeMessage,
                suggestedPlan: plan.id === "free" ? "Pro" : "Team",
                limitType: action.id === "project" ? "projects" : action.id === "member" ? "team" : "projects",
            });
            setShowUpgradeModal(true);
        }
    };

    return (
        <>
            <Menu>
                <MenuButton className="inline-flex items-center justify-center h-12 px-6.5 border-[1.5px] rounded-full bg-b-dark1 border-transparent text-t-light fill-t-light text-button transition-all cursor-pointer hover:bg-b-dark2 hover:shadow-hover max-md:w-12 max-md:px-0 max-md:gap-0">
                    <Icon className="mr-2 max-md:mr-0 fill-inherit" name="plus" />
                    <span className="max-md:hidden">Quick Actions</span>
                </MenuButton>
                <MenuItems
                    className="z-50 [--anchor-gap:1rem] w-72 shadow-hover bg-b-surface2 rounded-3xl outline-0 origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                    anchor="bottom end"
                    transition
                >
                    <div className="p-3 space-y-2">
                        {quickActions.map((action, index) => {
                            const status = getActionStatus(action.id);
                            const isDisabled = !status.allowed;

                            return (
                                <MenuItem key={index}>
                                    {isDisabled ? (
                                        <button
                                            onClick={(e) => handleActionClick(action, e)}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-[1.5px] border-stroke1 bg-b-surface1/50 transition-colors hover:border-amber-500/30 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500/10">
                                                <Icon
                                                    className="!w-4 !h-4 fill-amber-500"
                                                    name="lock"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="text-small font-medium text-t-tertiary">
                                                    {action.title}
                                                </div>
                                                <div className="text-xs text-amber-600">
                                                    Upgrade to unlock
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        <Link
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-[1.5px] border-stroke1 bg-b-surface1 transition-colors hover:border-stroke-highlight hover:bg-b-highlight`}
                                            href={action.url}
                                            onClick={(e) => handleActionClick(action, e)}
                                        >
                                            <div className={`flex items-center justify-center size-8 rounded-lg ${action.bgColor}`}>
                                                <Icon
                                                    className={`!w-4 !h-4 ${action.iconColor}`}
                                                    name={action.icon}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-small font-medium text-t-primary">
                                                    {action.title}
                                                </div>
                                                <div className="text-xs text-t-tertiary">
                                                    {action.description}
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </MenuItem>
                            );
                        })}
                    </div>
                </MenuItems>
            </Menu>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                title={upgradeConfig.title}
                message={upgradeConfig.message}
                suggestedPlan={upgradeConfig.suggestedPlan}
                limitType={upgradeConfig.limitType}
            />
        </>
    );
};

export default QuickActions;
