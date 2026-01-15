"use client";

import { useState } from "react";
import Link from "next/link";
import { Service, ServiceCategory } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor, getStatusColor } from "@/utils/categoryColors";
import { cn } from "@/lib/utils";

type Props = {
    services: Service[];
    projectId: string;
    activeCategory: ServiceCategory | "all";
};

const Services = ({ services, projectId, activeCategory }: Props) => {
    const servicesByCategory = services.reduce((acc, service) => {
        if (!acc[service.categoryId]) {
            acc[service.categoryId] = [];
        }
        acc[service.categoryId].push(service);
        return acc;
    }, {} as Record<ServiceCategory, Service[]>);

    const categories = Object.keys(servicesByCategory) as ServiceCategory[];
    
    // All categories expanded by default
    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);
    
    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };
    
    const filteredCategories = activeCategory === "all" 
        ? categories 
        : categories.filter(c => c === activeCategory);

    const totalMonthlyCost = services.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);

    
    return (
        <div>
            {categories.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-b-surface2">
                    <div className="flex items-center justify-center size-12 mx-auto mb-4 rounded-full bg-primary1/5 border-[1.5px] border-primary1/15 fill-primary1">
                        <Icon name="post" />
                    </div>
                    <div className="text-body-bold mb-2">No services yet</div>
                    <div className="text-small text-t-secondary mb-4">
                        Add your first service to start tracking
                    </div>
                    <Button isSecondary as="link" href={`/projects/${projectId}/services/new`}>
                        Add Service
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCategories.map((category) => {
                        const colors = getCategoryColor(category);
                        const categoryServices = servicesByCategory[category];
                        const isExpanded = expandedCategories.includes(category);
                        const categoryCost = categoryServices.reduce((sum, s) => {
                            if (s.costFrequency === "monthly") return sum + s.costAmount;
                            if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
                            return sum;
                        }, 0);
                        
                        return (
                            <div 
                                key={category}
                                className={cn(
                                    "rounded-3xl border-[1.5px] overflow-hidden transition-all",
                                    colors.border,
                                    colors.bg
                                )}
                            >
                                {/* Category Header - Clickable to expand/collapse */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-b-surface2/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex items-center justify-center size-12 rounded-2xl border-[1.5px]",
                                            colors.bg,
                                            colors.border,
                                            colors.icon
                                        )}>
                                            <Icon className="!w-6 !h-6" name={categoryIcons[category] || "star"} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-body font-semibold">{categoryLabels[category] || category}</h3>
                                            <p className="text-small text-t-secondary">
                                                {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className={cn("text-body font-semibold", colors.text)}>
                                                ${Math.round(categoryCost)}/mo
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

                                {/* Category Services - 3 column grid */}
                                {isExpanded && categoryServices.length > 0 && (
                                    <div className="px-5 pb-5">
                                        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                                            {categoryServices.map((service) => (
                                                <Link
                                                    key={service.id}
                                                    href={`/projects/${projectId}/services/${service.id}`}
                                                    className="group p-4 rounded-2xl bg-b-surface1 hover:shadow-hover transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={cn(
                                                            "flex items-center justify-center size-10 rounded-xl border-[1.5px]",
                                                            colors.border,
                                                            colors.bg,
                                                            colors.icon
                                                        )}>
                                                            <Icon className="!w-5 !h-5" name={categoryIcons[category] || "star"} />
                                                        </div>
                                                        <span className={cn(
                                                            "px-2 py-0.5 text-xs rounded-full capitalize",
                                                            getStatusColor(service.status).bg,
                                                            getStatusColor(service.status).text
                                                        )}>
                                                            {service.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-body-bold mb-0.5 group-hover:text-primary1 transition-colors truncate">
                                                        {service.name}
                                                    </div>
                                                    {service.plan && (
                                                        <div className="text-small text-t-secondary mb-2 truncate">{service.plan}</div>
                                                    )}
                                                    <div className="flex items-center justify-between text-small">
                                                        <span className="font-medium text-t-primary">
                                                            {service.costAmount === 0 ? "Free" : `$${service.costAmount}/${service.costFrequency === "monthly" ? "mo" : service.costFrequency === "yearly" ? "yr" : "once"}`}
                                                        </span>
                                                        {service.renewalDate && (
                                                            <span className="text-xs text-t-tertiary">
                                                                {new Date(service.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Services;
