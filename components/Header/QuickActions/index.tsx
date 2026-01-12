"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

const quickActions = [
    {
        title: "New Project",
        icon: "documents",
        url: "/projects/new",
        description: "Create a new project",
        bgColor: "bg-primary1/10",
        borderColor: "border-primary1/30",
        iconColor: "fill-primary1",
    },
    {
        title: "New Workspace",
        icon: "home",
        url: "/workspace/new",
        description: "Create a new workspace",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        iconColor: "fill-amber-500",
    },
    {
        title: "Add Service",
        icon: "post",
        url: "/projects?action=add-service",
        description: "Add service to project",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        iconColor: "fill-purple-500",
    },
    {
        title: "Invite Member",
        icon: "users",
        url: "/settings/workspace?tab=members",
        description: "Invite team member",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        iconColor: "fill-green-500",
    },
];

const QuickActions = () => {
    return (
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
                <div className="p-3">
                    {quickActions.map((action, index) => (
                        <MenuItem key={index}>
                            <Link
                                className="flex items-center w-full p-3 rounded-2xl transition-colors hover:bg-b-highlight"
                                href={action.url}
                            >
                                <div className={`flex items-center justify-center size-12 mr-3 rounded-2xl border-[1.5px] ${action.bgColor} ${action.borderColor}`}>
                                    <Icon
                                        className={`!w-5 !h-5 ${action.iconColor}`}
                                        name={action.icon}
                                    />
                                </div>
                                <div>
                                    <div className="text-body font-medium text-t-primary">
                                        {action.title}
                                    </div>
                                    <div className="text-small text-t-tertiary">
                                        {action.description}
                                    </div>
                                </div>
                            </Link>
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
};

export default QuickActions;
