"use client";

import Link from "next/link";
import { Service, ServiceCategory } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor, getStatusColor } from "@/utils/categoryColors";

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
                                        <Link
                                            key={service.id}
                                            href={`/projects/${projectId}/services/${service.id}`}
                                            className="group w-[calc(33.333%-1rem)] mt-3 mx-2 p-4 rounded-4xl bg-b-surface2 hover:shadow-hover transition-all cursor-pointer max-lg:w-[calc(50%-1rem)] max-md:w-full max-md:mx-0"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`flex items-center justify-center size-10 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}>
                                                    <Icon className="!w-5 !h-5" name={categoryIcons[category] || "star"} />
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(service.status).bg} ${getStatusColor(service.status).text}`}>
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
                                        </Link>
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
