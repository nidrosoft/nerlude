"use client";

import { Fragment, ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";

interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "left" | "right";
    className?: string;
}

const Dropdown = ({ trigger, items, align = "right", className }: DropdownProps) => {
    return (
        <Menu as="div" className={cn("relative inline-block text-left", className)}>
            <MenuButton as={Fragment}>{trigger}</MenuButton>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    className={cn(
                        "absolute z-50 mt-2 w-56 origin-top-right rounded-2xl bg-b-surface2 shadow-lg ring-1 ring-stroke-subtle focus:outline-none p-2",
                        align === "left" ? "left-0" : "right-0"
                    )}
                >
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            {item.divider && index > 0 && (
                                <div className="my-1 h-px bg-stroke-subtle" />
                            )}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={item.onClick}
                                        disabled={item.disabled}
                                        className={cn(
                                            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-small transition-colors",
                                            focus && "bg-b-surface3",
                                            item.disabled && "opacity-50 cursor-not-allowed",
                                            item.danger
                                                ? "text-red-500 hover:bg-red-500/10"
                                                : "text-t-primary"
                                        )}
                                    >
                                        {item.icon && (
                                            <span className={cn("flex-shrink-0", item.danger ? "text-red-500" : "text-t-tertiary")}>
                                                {item.icon}
                                            </span>
                                        )}
                                        {item.label}
                                    </button>
                                )}
                            </MenuItem>
                        </Fragment>
                    ))}
                </MenuItems>
            </Transition>
        </Menu>
    );
};

// Pre-built dropdown trigger button
export const DropdownTrigger = ({
    children,
    className,
    showArrow = true,
}: {
    children: ReactNode;
    className?: string;
    showArrow?: boolean;
}) => (
    <button
        className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl bg-b-surface2 text-small text-t-primary hover:bg-b-surface3 transition-colors",
            className
        )}
    >
        {children}
        {showArrow && <ArrowDown2 size={16} className="text-t-tertiary" />}
    </button>
);

// Icon-only dropdown trigger
export const DropdownIconTrigger = ({
    icon,
    className,
}: {
    icon: ReactNode;
    className?: string;
}) => (
    <button
        className={cn(
            "p-2 rounded-xl text-t-tertiary hover:bg-b-surface2 hover:text-t-primary transition-colors",
            className
        )}
    >
        {icon}
    </button>
);

export default Dropdown;
