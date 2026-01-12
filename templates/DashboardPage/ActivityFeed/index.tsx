"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { getRelativeTime } from "@/data/mockActivity";
import { 
    ActivityLog, 
    formatActivityMessage, 
    groupActivityLogs, 
    activityIcons, 
    defaultActivityIcon 
} from "@/lib/utils/activityFormatter";

type Props = {
    expanded?: boolean;
};

const ActivityFeed = ({ expanded = false }: Props) => {
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`/api/activity?limit=${expanded ? 10 : 6}`);
                if (response.ok) {
                    const data = await response.json();
                    setActivityLogs(data);
                }
            } catch (error) {
                console.error('Failed to fetch activity:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchActivity();
    }, [expanded]);
    
    // Group consecutive service additions
    const groupedLogs = groupActivityLogs(activityLogs);
    
    // Check if we have real activity data
    const hasRealActivity = groupedLogs.length > 0;
    const isEmpty = !isLoading && !hasRealActivity;
    
    // Use 2 columns only when expanded AND we have 8+ items
    const useTwoColumns = expanded && groupedLogs.length >= 8;
    
    // Fun empty state messages
    const emptyMessages = [
        { title: "It's quiet... too quiet 🦗", subtitle: "Start adding projects and services to see your activity here!" },
        { title: "Nothing to see here yet! 👀", subtitle: "Your activity feed will light up once you start building." },
        { title: "Fresh start, clean slate ✨", subtitle: "Create your first project to kick things off!" },
        { title: "The calm before the storm 🌤️", subtitle: "Soon this feed will be buzzing with updates." },
    ];
    const emptyMessage = emptyMessages[Math.floor(Date.now() / 86400000) % emptyMessages.length];
    
    return (
        <div className={`h-full p-5 rounded-4xl bg-b-surface2 ${expanded ? "p-6" : ""}`}>
            {/* Header - only show when we have activity */}
            {!isEmpty && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className={expanded ? "text-h5" : "text-body-bold"}>Recent Activity</h3>
                    <Link 
                        href="/activity"
                        className={`${expanded ? "text-body" : "text-small"} text-t-secondary hover:text-t-primary transition-colors`}
                    >
                        View all
                    </Link>
                </div>
            )}
            
            {/* Empty State */}
            {isEmpty && (
                <div className={`flex flex-col items-center justify-center ${expanded ? "py-12" : "py-8"}`}>
                    <div className={`flex items-center justify-center ${expanded ? "size-14" : "size-12"} rounded-2xl bg-amber-500/10 mb-4`}>
                        <Icon className={`${expanded ? "!w-7 !h-7" : "!w-6 !h-6"} fill-amber-500`} name="bulb" />
                    </div>
                    <h4 className={`${expanded ? "text-body-bold" : "text-small font-medium"} text-t-primary mb-1 text-center`}>
                        {emptyMessage.title}
                    </h4>
                    <p className={`${expanded ? "text-small" : "text-xs"} text-t-tertiary text-center max-w-xs`}>
                        {emptyMessage.subtitle}
                    </p>
                </div>
            )}
            
            {/* Activity List */}
            {!isEmpty && (
                <div className={useTwoColumns ? "grid grid-cols-2 gap-x-8 gap-y-1 max-lg:grid-cols-1" : "space-y-1"}>
                    {groupedLogs.map((activity, index) => {
                        const formatted = formatActivityMessage(activity);
                        const iconConfig = { icon: formatted.icon, bg: formatted.bg, iconColor: formatted.iconColor };
                        const displayData = { title: formatted.title, description: formatted.description };
                        
                        const isLastInColumn = useTwoColumns 
                            ? (index === Math.floor(groupedLogs.length / 2) - 1 || index === groupedLogs.length - 1)
                            : index === groupedLogs.length - 1;
                        
                        return (
                            <div key={activity.id} className="relative flex items-start py-3">
                                {/* Timeline line */}
                                {!isLastInColumn && (
                                    <div className={`absolute ${expanded ? "left-5" : "left-4"} top-14 bottom-0 w-px bg-stroke-subtle max-lg:left-5`} />
                                )}
                                
                                {/* Icon */}
                                <div className={`flex items-center justify-center ${expanded ? "size-10" : "size-8"} rounded-xl ${iconConfig.bg} ${iconConfig.iconColor} shrink-0 z-10`}>
                                    <Icon className={expanded ? "!w-5 !h-5" : "!w-4 !h-4"} name={iconConfig.icon} />
                                </div>
                                
                                {/* Content */}
                                <div className={`flex-1 ${expanded ? "ml-4" : "ml-3"} min-w-0`}>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`${expanded ? "text-body" : "text-small"} font-medium text-t-primary truncate`}>
                                            {displayData.title}
                                        </p>
                                        <span className={`${expanded ? "text-small" : "text-xs"} text-t-tertiary whitespace-nowrap`}>
                                            {getRelativeTime(activity.created_at)}
                                        </span>
                                    </div>
                                    <p className={`${expanded ? "text-small" : "text-xs"} text-t-secondary mt-0.5 truncate`}>
                                        {displayData.description}
                                    </p>
                                    {activity.entity_id && activity.entity_type === 'project' && (
                                        <Link 
                                            href={`/projects/${activity.entity_id}`}
                                            className={`inline-flex items-center mt-1.5 ${expanded ? "text-small" : "text-xs"} text-primary1 hover:underline`}
                                        >
                                            {activity.project?.name || 'View project'}
                                            <Icon className={`${expanded ? "!w-4 !h-4" : "!w-3 !h-3"} ml-1 fill-primary1`} name="arrow-right" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActivityFeed;
