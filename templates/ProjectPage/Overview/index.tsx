"use client";

import { useState, useEffect, useCallback } from "react";
import { Project, Service, Alert } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { getRelativeTime } from "@/data/mockActivity";
import { 
    formatActivityMessage, 
    groupActivityLogs,
    ActivityLog 
} from "@/lib/utils/activityFormatter";

interface ActivityItem {
    id: string;
    action: string;
    description: string;
    timestamp: string;
}

type Props = {
    project: Project;
    services: Service[];
    alerts: Alert[];
    memberCount?: number;
};

const Overview = ({ project, services, alerts, memberCount }: Props) => {
    const toast = useToast();
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [teamCount, setTeamCount] = useState(memberCount || 0);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState(true);

    // Fetch member count if not provided
    useEffect(() => {
        if (memberCount !== undefined) {
            setTeamCount(memberCount);
            return;
        }
        
        const fetchMemberCount = async () => {
            try {
                const response = await fetch(`/api/projects/${project.id}/members`);
                if (response.ok) {
                    const members = await response.json();
                    setTeamCount(members.length);
                }
            } catch (error) {
                console.error('Error fetching member count:', error);
            }
        };
        fetchMemberCount();
    }, [project.id, memberCount]);

    // Fetch recent activity for this project
    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoadingActivity(true);
            try {
                const response = await fetch(`/api/activity?project_id=${project.id}&limit=10`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Group consecutive service additions using imported utility
                    const grouped = groupActivityLogs(data);
                    
                    // Map to display format using imported formatter
                    const mapped = grouped.slice(0, 5).map((item: ActivityLog) => {
                        const formatted = formatActivityMessage(item);
                        return {
                            id: item.id,
                            action: formatted.title,
                            description: formatted.description,
                            timestamp: item.created_at,
                        };
                    });
                    setRecentActivity(mapped);
                }
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setIsLoadingActivity(false);
            }
        };
        fetchActivity();
    }, [project.id]);
    const projectAlerts = alerts.filter((a) => a.projectId === project.id && !a.isDismissed);
    const totalMonthlyCost = services.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);

    const nextRenewal = services
        .filter((s) => s.renewalDate)
        .sort((a, b) => new Date(a.renewalDate!).getTime() - new Date(b.renewalDate!).getTime())[0];

    const stats = [
        {
            label: "Monthly Cost",
            value: `$${Math.round(totalMonthlyCost)}`,
            icon: "documents",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
            iconColor: "fill-purple-500",
        },
        {
            label: "Services",
            value: services.length.toString(),
            icon: "post",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            iconColor: "fill-blue-500",
        },
        {
            label: "Team Members",
            value: teamCount.toString(),
            icon: "profile",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            iconColor: "fill-amber-500",
        },
        {
            label: "Next Renewal",
            value: nextRenewal
                ? new Date(nextRenewal.renewalDate!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                  })
                : "None",
            icon: "generation",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
            iconColor: "fill-green-500",
        },
    ];

    return (
        <div>
            <div className="flex flex-wrap -mx-2 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="w-[calc(25%-1rem)] mt-4 mx-2 p-5 rounded-4xl bg-b-surface2 max-lg:w-[calc(50%-1rem)] max-md:w-full"
                    >
                        <div className={`flex items-center justify-center size-10 mb-4 rounded-2xl border-[1.5px] ${stat.borderColor} ${stat.bgColor} ${stat.iconColor}`}>
                            <Icon className="!w-5 !h-5" name={stat.icon} />
                        </div>
                        <div className="text-h4 mb-1">{stat.value}</div>
                        <div className="text-small text-t-tertiary">{stat.label}</div>
                    </div>
                ))}
            </div>

            {projectAlerts.length > 0 && (
                <div className="mb-8 p-5 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">Active Alerts</h3>
                    <div className="space-y-3">
                        {projectAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-center p-3 rounded-xl bg-b-surface1"
                            >
                                <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-xl ${
                                    alert.priority === "high"
                                        ? "bg-red-500/10 border-red-500/20 fill-red-500"
                                        : alert.priority === "medium"
                                        ? "bg-amber-500/10 border-amber-500/20 fill-amber-500"
                                        : "bg-green-500/10 border-green-500/20 fill-green-500"
                                } border-[1.5px]`}>
                                    <Icon className="!w-4 !h-4" name="generation" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-small font-medium text-t-primary truncate">
                                        {alert.title}
                                    </div>
                                    <div className="text-xs text-t-tertiary truncate">
                                        {alert.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-5 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {isLoadingActivity ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center p-3 rounded-xl bg-b-surface1">
                                <Skeleton variant="rounded" width={32} height={32} className="mr-3" />
                                <div className="flex-1">
                                    <Skeleton variant="text" height={16} className="w-32 mb-1" />
                                    <Skeleton variant="text" height={12} className="w-24" />
                                </div>
                            </div>
                        ))
                    ) : recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Icon className="!w-10 !h-10 fill-t-tertiary mb-2" name="clock" />
                            <p className="text-small text-t-secondary">No recent activity</p>
                            <p className="text-xs text-t-tertiary">Activity will appear here as you work</p>
                        </div>
                    ) : (
                        recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center p-3 rounded-xl bg-b-surface1"
                            >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-xl bg-primary1/5 border-[1.5px] border-primary1/15 fill-primary1">
                                    <Icon className="!w-4 !h-4" name="check" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-small font-medium text-t-primary truncate capitalize">
                                        {activity.action}
                                    </div>
                                    <div className="text-xs text-t-tertiary truncate">
                                        {activity.description}
                                    </div>
                                </div>
                                <div className="text-xs text-t-tertiary shrink-0">
                                    {getRelativeTime(activity.timestamp)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
