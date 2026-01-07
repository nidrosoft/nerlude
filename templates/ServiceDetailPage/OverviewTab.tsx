"use client";

import Icon from "@/components/Icon";
import { Service } from "@/types";
import { categoryLabels } from "@/data/mockServices";
import { UsageStat, ActivityLogItem } from "./types";

interface OverviewTabProps {
    service: Service;
    usageStats: UsageStat[];
    activityLog: ActivityLogItem[];
}

const OverviewTab = ({ service, usageStats, activityLog }: OverviewTabProps) => {
    return (
        <>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                {usageStats.map((stat) => (
                    <div key={stat.label} className="p-5 rounded-3xl bg-b-surface2">
                        <div className="text-small text-t-secondary mb-1">{stat.label}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-h3">{stat.value}</span>
                            {stat.change && (
                                <span className={`text-xs font-medium ${
                                    stat.trend === "up" ? "text-green-500" : 
                                    stat.trend === "down" ? "text-red-500" : "text-t-tertiary"
                                }`}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                {/* Service Details */}
                <div className="p-6 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">Service Details</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-stroke-subtle">
                            <span className="text-small text-t-secondary">Category</span>
                            <span className="text-small text-t-primary">{categoryLabels[service.categoryId]}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stroke-subtle">
                            <span className="text-small text-t-secondary">Plan</span>
                            <span className="text-small text-t-primary">{service.plan || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stroke-subtle">
                            <span className="text-small text-t-secondary">Monthly Cost</span>
                            <span className="text-small text-t-primary font-medium">
                                {service.costAmount === 0 ? "Free" : `$${service.costAmount}`}
                            </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stroke-subtle">
                            <span className="text-small text-t-secondary">Renewal Date</span>
                            <span className="text-small text-t-primary">
                                {service.renewalDate 
                                    ? new Date(service.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                    : "N/A"
                                }
                            </span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-small text-t-secondary">Added</span>
                            <span className="text-small text-t-primary">
                                {new Date(service.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {activityLog.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-stroke-subtle last:border-0">
                                <div className="flex items-center justify-center size-8 rounded-lg bg-b-surface1 fill-t-secondary shrink-0">
                                    <Icon className="!w-4 !h-4" name="clock" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-small text-t-primary">{activity.action}</div>
                                    <div className="text-xs text-t-tertiary">
                                        {activity.user} · {activity.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            {service.quickLinks && service.quickLinks.length > 0 && (
                <div className="p-6 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">Quick Links</h3>
                    <div className="flex flex-wrap gap-3">
                        {service.quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-b-surface1 text-small text-t-secondary hover:text-t-primary fill-t-secondary hover:fill-t-primary transition-colors"
                            >
                                <Icon className="!w-4 !h-4" name="export" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default OverviewTab;
