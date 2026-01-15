"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Icon from "@/components/Icon";
import { Alert } from "@/types";

const priorityStyles = {
    high: {
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        iconColor: "fill-red-500",
    },
    medium: {
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        iconColor: "fill-amber-500",
    },
    low: {
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        iconColor: "fill-green-500",
    },
};

type Props = {
    alerts: Alert[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
};

const Notifications = ({ alerts, onMarkAsRead, onMarkAllAsRead }: Props) => {
    const activeAlerts = alerts.filter((a) => !a.isDismissed);
    const hasAlerts = activeAlerts.length > 0;

    return (
        <Menu>
            <MenuButton className="relative flex items-center justify-center size-12 border-4 border-b-surface2 rounded-full outline-0 bg-b-surface2 transition-colors hover:bg-b-surface3 before:absolute before:-inset-1 before:z-1 before:rounded-full before:border-[1.5px] before:border-stroke2 before:opacity-0 before:transition-opacity data-open:before:opacity-100 overflow-visible">
                <Icon className="!w-5 !h-5 fill-amber-500" name="bell" />
                {hasAlerts && (
                    <span className="absolute -top-1 -right-1 z-10 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                        {activeAlerts.length > 9 ? "9+" : activeAlerts.length}
                    </span>
                )}
            </MenuButton>
            <MenuItems
                className="z-50 [--anchor-gap:1rem] w-96 max-h-[480px] overflow-hidden shadow-hover bg-b-surface2 rounded-3xl outline-0 origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                anchor="bottom end"
                transition
            >
                <div className="p-4 border-b border-stroke-subtle">
                    <div className="flex items-center justify-between">
                        <h3 className="text-body-bold text-t-primary">Notifications</h3>
                        {hasAlerts && onMarkAllAsRead && (
                            <button
                                className="text-small text-primary1 hover:text-primary1/80 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMarkAllAsRead();
                                }}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                    {activeAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex items-center justify-center size-14 mb-3 rounded-2xl bg-green-500/10 fill-green-500">
                                <Icon name="check" className="!w-7 !h-7" />
                            </div>
                            <p className="text-body font-medium text-t-primary">All caught up!</p>
                            <p className="text-small text-t-tertiary mt-1">No items need your attention</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {activeAlerts.map((alert) => {
                                const styles = priorityStyles[alert.priority as keyof typeof priorityStyles] || priorityStyles.medium;
                                return (
                                    <MenuItem key={alert.id}>
                                        <div 
                                            className="p-3 rounded-2xl transition-colors hover:bg-b-highlight cursor-pointer"
                                            onClick={() => onMarkAsRead?.(alert.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`flex items-center justify-center size-10 rounded-xl border-[1.5px] shrink-0 ${styles.bgColor} ${styles.borderColor} ${styles.iconColor}`}>
                                                    <Icon
                                                        className="!w-5 !h-5"
                                                        name={alert.type === "renewal" ? "generation" : "bulb"}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-small font-medium text-t-primary truncate">
                                                            {alert.title}
                                                        </p>
                                                        <div className="w-2 h-2 rounded-full bg-primary1 shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-t-secondary mt-0.5 line-clamp-2">
                                                        {alert.message}
                                                    </p>
                                                    {alert.projectName && (
                                                        <p className="text-xs text-t-tertiary mt-1">
                                                            {alert.projectName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </MenuItem>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {activeAlerts.length > 0 && (
                    <div className="p-3 border-t border-stroke-subtle">
                        <Link
                            href="/settings/notifications"
                            className="flex items-center justify-center w-full h-10 rounded-xl text-small font-medium text-t-secondary hover:bg-b-highlight hover:text-t-primary transition-colors"
                        >
                            View all notifications
                        </Link>
                    </div>
                )}
            </MenuItems>
        </Menu>
    );
};

export default Notifications;
