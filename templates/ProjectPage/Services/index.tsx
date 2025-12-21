"use client";

import { useState } from "react";
import { Service, ServiceCategory } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { categoryLabels, categoryIcons } from "@/data/mockServices";

type Props = {
    services: Service[];
    projectId: string;
};

const Services = ({ services, projectId }: Props) => {
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
    
    const servicesByCategory = services.reduce((acc, service) => {
        if (!acc[service.categoryId]) {
            acc[service.categoryId] = [];
        }
        acc[service.categoryId].push(service);
        return acc;
    }, {} as Record<ServiceCategory, Service[]>);

    const categories = Object.keys(servicesByCategory) as ServiceCategory[];
    
    const filteredCategories = activeCategory === "all" 
        ? categories 
        : categories.filter(c => c === activeCategory);

    const totalMonthlyCost = services.reduce((sum, s) => {
        if (s.costFrequency === "monthly") return sum + s.costAmount;
        if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
        return sum;
    }, 0);

    const getCategoryColor = (category: ServiceCategory) => {
        const colors: Record<string, { bg: string; border: string; icon: string }> = {
            hosting: { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "fill-blue-500" },
            database: { bg: "bg-green-500/10", border: "border-green-500/20", icon: "fill-green-500" },
            domain: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "fill-purple-500" },
            auth: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "fill-amber-500" },
            payments: { bg: "bg-pink-500/10", border: "border-pink-500/20", icon: "fill-pink-500" },
            email: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "fill-cyan-500" },
            analytics: { bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "fill-orange-500" },
            storage: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: "fill-indigo-500" },
            appstores: { bg: "bg-red-500/10", border: "border-red-500/20", icon: "fill-red-500" },
            ai: { bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "fill-violet-500" },
            monitoring: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "fill-emerald-500" },
            communication: { bg: "bg-sky-500/10", border: "border-sky-500/20", icon: "fill-sky-500" },
            devtools: { bg: "bg-slate-500/10", border: "border-slate-500/20", icon: "fill-slate-500" },
            marketing: { bg: "bg-rose-500/10", border: "border-rose-500/20", icon: "fill-rose-500" },
            security: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: "fill-yellow-500" },
            cms: { bg: "bg-teal-500/10", border: "border-teal-500/20", icon: "fill-teal-500" },
            search: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", icon: "fill-fuchsia-500" },
            media: { bg: "bg-lime-500/10", border: "border-lime-500/20", icon: "fill-lime-500" },
        };
        return colors[category] || { bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "fill-gray-500" };
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-h3">Services</h2>
                    <p className="text-small text-t-secondary mt-1">
                        {services.length} services · ${Math.round(totalMonthlyCost)}/mo total
                    </p>
                </div>
                <Button isSecondary as="link" href={`/projects/${projectId}/services/new`}>
                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                    Add Service
                </Button>
            </div>

            {/* Category Filter Tabs - Horizontal Scroll */}
            <div className="relative mb-6 pb-4 border-b border-stroke-subtle">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-small font-medium transition-all ${
                            activeCategory === "all"
                                ? "bg-t-primary text-b-surface1"
                                : "bg-b-surface2 text-t-secondary hover:bg-b-surface1"
                        }`}
                    >
                        All ({services.length})
                    </button>
                    {categories.map((category) => {
                        const colors = getCategoryColor(category);
                        return (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-small font-medium transition-all ${
                                    activeCategory === category
                                        ? "bg-t-primary text-b-surface1"
                                        : "bg-b-surface2 text-t-secondary hover:bg-b-surface1"
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${colors.bg.replace('/10', '')}`} />
                                {categoryLabels[category] || category} ({servicesByCategory[category].length})
                            </button>
                        );
                    })}
                </div>
            </div>

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
                <div className="space-y-8">
                    {filteredCategories.map((category) => {
                        const colors = getCategoryColor(category);
                        const categoryServices = servicesByCategory[category];
                        const categoryCost = categoryServices.reduce((sum, s) => {
                            if (s.costFrequency === "monthly") return sum + s.costAmount;
                            if (s.costFrequency === "yearly") return sum + s.costAmount / 12;
                            return sum;
                        }, 0);
                        
                        return (
                            <div key={category}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`flex items-center justify-center size-9 mr-3 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}>
                                            <Icon className="!w-4 !h-4" name={categoryIcons[category] || "star"} />
                                        </div>
                                        <div>
                                            <h3 className="text-body-bold">{categoryLabels[category] || category}</h3>
                                            <span className="text-xs text-t-tertiary">
                                                {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''} · ${Math.round(categoryCost)}/mo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mt-3 -mx-2">
                                    {categoryServices.map((service) => (
                                        <div
                                            key={service.id}
                                            className="group w-[calc(33.333%-1rem)] mt-3 mx-2 p-4 rounded-4xl bg-b-surface2 hover:shadow-hover transition-all cursor-pointer max-lg:w-[calc(50%-1rem)] max-md:w-full max-md:mx-0"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`flex items-center justify-center size-10 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}>
                                                    <Icon className="!w-5 !h-5" name={categoryIcons[category] || "star"} />
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    service.status === "active"
                                                        ? "bg-green-500/10 text-green-600"
                                                        : service.status === "paused"
                                                        ? "bg-amber-500/10 text-amber-600"
                                                        : "bg-gray-500/10 text-gray-500"
                                                }`}>
                                                    {service.status}
                                                </span>
                                            </div>
                                            <div className="text-body-bold mb-0.5 group-hover:text-primary1 transition-colors">{service.name}</div>
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Services;
