"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { mockActivity, getRelativeTime, ActivityItem } from "@/data/mockActivity";

const activityIcons: Record<ActivityItem["type"], { icon: string; bg: string; iconColor: string }> = {
    project_created: { icon: "plus", bg: "bg-green-500/10", iconColor: "fill-green-500" },
    service_added: { icon: "post", bg: "bg-blue-500/10", iconColor: "fill-blue-500" },
    service_updated: { icon: "edit", bg: "bg-amber-500/10", iconColor: "fill-amber-500" },
    member_invited: { icon: "users", bg: "bg-purple-500/10", iconColor: "fill-purple-500" },
    project_archived: { icon: "documents", bg: "bg-gray-500/10", iconColor: "fill-gray-500" },
    settings_changed: { icon: "gear", bg: "bg-cyan-500/10", iconColor: "fill-cyan-500" },
};

const ActivityFeed = () => {
    return (
        <div className="h-full p-5 rounded-4xl bg-b-surface2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-body-bold">Recent Activity</h3>
                <button className="text-small text-t-secondary hover:text-t-primary transition-colors">
                    View all
                </button>
            </div>
            
            <div className="space-y-1">
                {mockActivity.slice(0, 6).map((activity, index) => {
                    const iconConfig = activityIcons[activity.type];
                    const isLast = index === Math.min(mockActivity.length, 6) - 1;
                    
                    return (
                        <div key={activity.id} className="relative flex items-start py-3">
                            {/* Timeline line */}
                            {!isLast && (
                                <div className="absolute left-4 top-12 bottom-0 w-px bg-stroke-subtle" />
                            )}
                            
                            {/* Icon */}
                            <div className={`flex items-center justify-center size-8 rounded-xl ${iconConfig.bg} ${iconConfig.iconColor} shrink-0 z-10`}>
                                <Icon className="!w-4 !h-4" name={iconConfig.icon} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 ml-3 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-small font-medium text-t-primary truncate">
                                        {activity.title}
                                    </p>
                                    <span className="text-xs text-t-tertiary whitespace-nowrap">
                                        {getRelativeTime(activity.timestamp)}
                                    </span>
                                </div>
                                <p className="text-xs text-t-secondary mt-0.5 truncate">
                                    {activity.description}
                                </p>
                                {activity.projectId && (
                                    <Link 
                                        href={`/projects/${activity.projectId}`}
                                        className="inline-flex items-center mt-1.5 text-xs text-primary1 hover:underline"
                                    >
                                        {activity.projectName}
                                        <Icon className="!w-3 !h-3 ml-1 fill-primary1" name="arrow-right" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityFeed;
