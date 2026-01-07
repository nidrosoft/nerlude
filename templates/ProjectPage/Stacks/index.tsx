"use client";

import { useState } from "react";
import { Service, ServiceStack } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import EnvironmentSwitcher from "@/components/EnvironmentSwitcher";
import { stackColors } from "@/data/mockStacks";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/categoryColors";

type Props = {
    services: Service[];
    stacks: ServiceStack[];
    projectId: string;
    viewMode: "list" | "graph";
};

const Stacks = ({ services, stacks, projectId, viewMode }: Props) => {
    const [expandedStacks, setExpandedStacks] = useState<string[]>(
        [...stacks.map(s => s.id), 'ungrouped'] // All expanded by default including ungrouped
    );

    const toggleStack = (stackId: string) => {
        setExpandedStacks(prev => 
            prev.includes(stackId) 
                ? prev.filter(id => id !== stackId)
                : [...prev, stackId]
        );
    };

    // Get services for a specific stack
    const getStackServices = (stackId: string) => {
        return services.filter(s => s.stackId === stackId);
    };

    // Get ungrouped services (no stack assigned)
    const ungroupedServices = services.filter(s => !s.stackId);

    // Calculate stack cost
    const getStackCost = (stackId: string) => {
        return getStackServices(stackId).reduce((sum, s) => {
            if (s.costFrequency === "monthly") return sum + s.costAmount;
            if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
            return sum;
        }, 0);
    };

    // Total cost
    const totalMonthlyCost = services.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);

    const getColorStyles = (color: string) => {
        return stackColors[color] || stackColors.slate;
    };

    return (
        <div>
            {/* Graph View */}
            {viewMode === "graph" && (
                <div className="p-6 rounded-4xl bg-b-surface2 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-bold">Service Dependencies</h3>
                        <span className="text-xs text-t-tertiary">Click on a node to view details</span>
                    </div>
                    
                    {/* Visual Graph */}
                    <div className="relative min-h-[400px] rounded-2xl bg-b-surface1 overflow-hidden">
                        {/* Center Hub - Project */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center size-20 rounded-full bg-primary1 fill-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                                    <Icon className="!w-10 !h-10" name="cube" />
                                </div>
                                <span className="mt-2 text-small font-medium text-t-primary">Project</span>
                            </div>
                        </div>

                        {/* Stack Nodes - arranged in a circle */}
                        {stacks.map((stack, index) => {
                            const angle = (index / stacks.length) * 2 * Math.PI - Math.PI / 2;
                            const radius = 150;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            const colors = getColorStyles(stack.color);
                            const stackServices = getStackServices(stack.id);

                            return (
                                <div
                                    key={stack.id}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 cursor-pointer"
                                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                                >
                                    {/* Connection Line */}
                                    <svg
                                        className="absolute top-1/2 left-1/2 pointer-events-none"
                                        style={{
                                            width: Math.abs(x) + 40,
                                            height: Math.abs(y) + 40,
                                            transform: `translate(${x > 0 ? -40 : -Math.abs(x)}px, ${y > 0 ? -40 : -Math.abs(y)}px)`,
                                        }}
                                    >
                                        <line
                                            x1={x > 0 ? 0 : Math.abs(x)}
                                            y1={y > 0 ? 0 : Math.abs(y)}
                                            x2={x > 0 ? Math.abs(x) : 0}
                                            y2={y > 0 ? Math.abs(y) : 0}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            className="text-stroke-subtle"
                                        />
                                    </svg>
                                    
                                    {/* Stack Node */}
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "flex items-center justify-center size-14 rounded-2xl border-2 shadow-md",
                                            colors.bg,
                                            colors.border,
                                            colors.fill
                                        )}>
                                            <Icon className="!w-7 !h-7" name={stack.icon || "cube"} />
                                        </div>
                                        <span className="mt-1.5 text-xs font-medium text-t-primary max-w-[80px] truncate text-center">
                                            {stack.name}
                                        </span>
                                        <span className="text-xs text-t-tertiary">
                                            {stackServices.length} services
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Ungrouped indicator */}
                        {ungroupedServices.length > 0 && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-b-surface2">
                                <div className="w-2 h-2 rounded-full bg-t-tertiary" />
                                <span className="text-xs text-t-secondary">
                                    {ungroupedServices.length} ungrouped
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary1" />
                            <span className="text-xs text-t-secondary">Project Hub</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-b-surface2 border border-stroke-subtle" />
                            <span className="text-xs text-t-secondary">Stack</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 border-t-2 border-dashed border-stroke-subtle" />
                            <span className="text-xs text-t-secondary">Connection</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stacks List View */}
            {viewMode === "list" && (
            <div className="space-y-4">
                {stacks.map((stack) => {
                    const stackServices = getStackServices(stack.id);
                    const stackCost = getStackCost(stack.id);
                    const isExpanded = expandedStacks.includes(stack.id);
                    const colors = getColorStyles(stack.color);

                    return (
                        <div
                            key={stack.id}
                            className={cn(
                                "rounded-3xl border-[1.5px] overflow-hidden transition-all",
                                colors.border,
                                colors.bg
                            )}
                        >
                            {/* Stack Header */}
                            <button
                                onClick={() => toggleStack(stack.id)}
                                className="w-full flex items-center justify-between p-5 hover:bg-b-surface2/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "flex items-center justify-center size-12 rounded-2xl border-[1.5px]",
                                        colors.bg,
                                        colors.border
                                    )}>
                                        <Icon 
                                            className={cn("!w-6 !h-6", colors.fill)} 
                                            name={stack.icon || "cube"} 
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-body font-semibold">{stack.name}</h3>
                                        {stack.description && (
                                            <p className="text-small text-t-secondary">{stack.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={cn("text-body font-semibold", colors.text)}>
                                            ${Math.round(stackCost)}/mo
                                        </p>
                                        <p className="text-small text-t-tertiary">
                                            {stackServices.length} service{stackServices.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <Icon 
                                        className={cn(
                                            "!w-5 !h-5 fill-t-tertiary transition-transform",
                                            isExpanded ? "rotate-180" : ""
                                        )} 
                                        name="chevron" 
                                    />
                                </div>
                            </button>

                            {/* Stack Services */}
                            {isExpanded && stackServices.length > 0 && (
                                <div className="px-5 pb-5">
                                    <div className="bg-b-surface1 rounded-2xl divide-y divide-stroke-subtle">
                                        {stackServices.map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center justify-between p-4 hover:bg-b-surface2/50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface2">
                                                        <Icon className="!w-5 !h-5 fill-t-secondary" name="cube" />
                                                    </div>
                                                    <div>
                                                        <p className="text-body font-medium">{service.name}</p>
                                                        <p className="text-small text-t-tertiary">{service.plan || 'No plan'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                                        getStatusColor(service.status).bg,
                                                        getStatusColor(service.status).text
                                                    )}>
                                                        {service.status}
                                                    </span>
                                                    <p className="text-body font-medium text-t-secondary">
                                                        ${service.costAmount}/{service.costFrequency === 'monthly' ? 'mo' : 'yr'}
                                                    </p>
                                                    <Icon className="!w-4 !h-4 fill-t-tertiary" name="chevron" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty Stack State */}
                            {isExpanded && stackServices.length === 0 && (
                                <div className="px-5 pb-5">
                                    <div className="flex flex-col items-center justify-center py-8 bg-b-surface1 rounded-2xl">
                                        <Icon className="!w-8 !h-8 fill-t-tertiary mb-2" name="cube" />
                                        <p className="text-small text-t-tertiary">No services in this stack</p>
                                        <Button className="mt-3" isStroke>
                                            <Icon className="mr-2 !w-4 !h-4" name="plus" />
                                            Add Service
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Ungrouped Services */}
                {ungroupedServices.length > 0 && (() => {
                    const isUngroupedExpanded = expandedStacks.includes('ungrouped');
                    const ungroupedCost = ungroupedServices.reduce((sum, s) => {
                        if (s.costFrequency === "monthly") return sum + s.costAmount;
                        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
                        return sum;
                    }, 0);
                    
                    return (
                        <div className="rounded-3xl border-[1.5px] border-stroke-subtle bg-b-surface2 overflow-hidden">
                            <button
                                onClick={() => toggleStack('ungrouped')}
                                className="w-full flex items-center justify-between p-5 hover:bg-b-surface1/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center size-12 rounded-2xl bg-b-surface1 border-[1.5px] border-stroke-subtle">
                                        <Icon className="!w-6 !h-6 fill-t-tertiary" name="cube" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-body font-semibold text-t-secondary">Ungrouped</h3>
                                        <p className="text-small text-t-tertiary">Services not assigned to a stack</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-body font-semibold text-t-secondary">
                                            ${Math.round(ungroupedCost)}/mo
                                        </p>
                                        <p className="text-small text-t-tertiary">
                                            {ungroupedServices.length} service{ungroupedServices.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <Icon 
                                        className={cn(
                                            "!w-5 !h-5 fill-t-tertiary transition-transform",
                                            isUngroupedExpanded ? "rotate-180" : ""
                                        )} 
                                        name="chevron" 
                                    />
                                </div>
                            </button>
                            
                            {isUngroupedExpanded && (
                                <div className="px-5 pb-5">
                                    <div className="bg-b-surface1 rounded-2xl divide-y divide-stroke-subtle">
                                        {ungroupedServices.map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center justify-between p-4 hover:bg-b-surface2/50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface2">
                                                        <Icon className="!w-5 !h-5 fill-t-secondary" name="cube" />
                                                    </div>
                                                    <div>
                                                        <p className="text-body font-medium">{service.name}</p>
                                                        <p className="text-small text-t-tertiary">{service.plan || 'No plan'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button isStroke className="!h-8 !px-3 text-xs">
                                                        Assign to Stack
                                                    </Button>
                                                    <p className="text-body font-medium text-t-secondary">
                                                        ${service.costAmount}/{service.costFrequency === 'monthly' ? 'mo' : 'yr'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
            )}
        </div>
    );
};

export default Stacks;
