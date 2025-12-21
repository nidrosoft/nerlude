"use client";

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
];

const SettingsSidebar = ({ activeTab }: Props) => {
    const pathname = usePathname();

    return (
        <div className="w-64 shrink-0 max-lg:w-full">
            <div className="p-4 rounded-4xl bg-b-surface2">
                <h3 className="px-3 mb-3 text-small font-medium text-t-tertiary">Settings</h3>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id || pathname === item.href;
                        const colorClasses = item.color.split(" ");
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                                    isActive
                                        ? "bg-b-surface1"
                                        : "hover:bg-b-surface1/50"
                                }`}
                            >
                                <div className={`flex items-center justify-center size-8 rounded-xl border-[1.5px] ${colorClasses[0]} ${colorClasses[1]} ${colorClasses[2]}`}>
                                    <Icon className="!w-4 !h-4" name={item.icon} />
                                </div>
                                <span className={`text-small font-medium ${isActive ? "text-t-primary" : "text-t-secondary"}`}>
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default SettingsSidebar;
