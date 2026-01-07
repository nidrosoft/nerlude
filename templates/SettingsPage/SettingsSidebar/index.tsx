"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

type Props = {
    activeTab?: string;
};

const menuItems = [
    {
        id: "account",
        title: "Account",
        icon: "profile",
        href: "/settings/account",
        color: "bg-blue-500/10 border-blue-500/20 fill-blue-500",
    },
    {
        id: "workspace",
        title: "Workspace",
        icon: "cube",
        href: "/settings/workspace",
        color: "bg-purple-500/10 border-purple-500/20 fill-purple-500",
    },
    {
        id: "plan",
        title: "Manage Plan",
        icon: "star-stroke",
        href: "/settings/plan",
        color: "bg-amber-500/10 border-amber-500/20 fill-amber-500",
    },
    {
        id: "notifications",
        title: "Notifications",
        icon: "bell",
        href: "/settings/notifications",
        color: "bg-green-500/10 border-green-500/20 fill-green-500",
    },
    {
        id: "integrations",
        title: "Integrations",
        icon: "lightning",
        href: "/settings/integrations",
        color: "bg-cyan-500/10 border-cyan-500/20 fill-cyan-500",
    },
    {
        id: "audit",
        title: "Audit Log",
        icon: "clock",
        href: "/settings/audit",
        color: "bg-rose-500/10 border-rose-500/20 fill-rose-500",
    },
];

const SettingsSidebar = ({ activeTab }: Props) => {
    const pathname = usePathname();
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
                {/* Settings Header */}
                <div className={`flex mb-4 pb-4 border-b border-stroke-subtle ${isExpanded ? "items-center px-2" : ""}`}>
                    <div className={`flex items-center justify-center size-10 rounded-full border-[1.5px] border-t-tertiary/20 bg-b-surface1 shrink-0 ${isExpanded ? "" : "mx-auto"}`}>
                        <Icon className="!w-5 !h-5 fill-t-secondary" name="gear" />
                    </div>
                    <div className={`min-w-0 overflow-hidden transition-opacity duration-200 ${isExpanded ? "ml-3 opacity-100" : "opacity-0 w-0 ml-0"}`}>
                        <div className="font-medium text-t-primary truncate text-small whitespace-nowrap">
                            Settings
                        </div>
                        <div className="text-xs text-t-tertiary whitespace-nowrap">
                            Manage your account
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id || pathname === item.href;
                        const colorClasses = item.color.split(" ");
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center rounded-xl transition-colors duration-200 px-2.5 py-2.5 ${
                                    isActive
                                        ? "bg-t-primary text-b-surface1 fill-b-surface1"
                                        : "text-t-secondary fill-t-secondary hover:bg-b-surface1 hover:text-t-primary hover:fill-t-primary"
                                }`}
                                title={!isExpanded ? item.title : undefined}
                            >
                                <div className={`flex items-center justify-center size-5 shrink-0 ${isActive ? "" : colorClasses[2]}`}>
                                    <Icon className="!w-5 !h-5" name={item.icon} />
                                </div>
                                <span className={`ml-3 text-small font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
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

export default SettingsSidebar;
