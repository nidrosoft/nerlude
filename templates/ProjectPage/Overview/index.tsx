"use client";

import { Project, Service, Alert } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

type Props = {
    project: Project;
    services: Service[];
    alerts: Alert[];
};

const Overview = ({ project, services, alerts }: Props) => {
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
            value: "3",
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3">Overview</h2>
                <div className="flex gap-2">
                    <Button isStroke as="link" href={`/projects/${project.id}/services/new`}>
                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                        Add Service
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap -mt-4 -mx-2 mb-8">
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
                    {[
                        { action: "Service added", detail: "Vercel Pro plan", time: "2 hours ago" },
                        { action: "Team member invited", detail: "john@example.com", time: "1 day ago" },
                        { action: "Domain renewed", detail: "saas-dashboard.com", time: "3 days ago" },
                    ].map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 rounded-xl bg-b-surface1"
                        >
                            <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-xl bg-primary1/5 border-[1.5px] border-primary1/15 fill-primary1">
                                <Icon className="!w-4 !h-4" name="check" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-small font-medium text-t-primary truncate">
                                    {activity.action}
                                </div>
                                <div className="text-xs text-t-tertiary truncate">
                                    {activity.detail}
                                </div>
                            </div>
                            <div className="text-xs text-t-tertiary shrink-0">
                                {activity.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
