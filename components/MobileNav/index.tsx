"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

interface NavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
}

const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "cube", href: "/dashboard" },
    { id: "new", label: "New", icon: "plus", href: "/projects/new" },
    { id: "settings", label: "Settings", icon: "gear", href: "/settings/account" },
];

const MobileNav = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard" || pathname?.startsWith("/projects/");
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-b-surface1 border-t border-stroke-subtle px-4 pb-safe">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                                    active
                                        ? "text-primary1 fill-primary1"
                                        : "text-t-tertiary fill-t-tertiary"
                                }`}
                            >
                                {item.id === "new" ? (
                                    <div className="flex items-center justify-center size-10 -mt-4 rounded-full bg-primary1 fill-white shadow-lg">
                                        <Icon className="!w-5 !h-5" name={item.icon} />
                                    </div>
                                ) : (
                                    <Icon className="!w-6 !h-6" name={item.icon} />
                                )}
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default MobileNav;
