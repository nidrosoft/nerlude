"use client";

import { useState, useMemo } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { serviceRegistry, ServiceRegistryItem } from "@/registry/services";
import { serviceCategories, CategoryInfo } from "@/registry/categories";
import { ServiceCategory } from "@/types";

interface ServicesStepProps {
    selectedServices: string[];
    onToggleService: (serviceId: string) => void;
    onBack: () => void;
    onContinue: () => void;
}

// Get category icon based on slug
const getCategoryIcon = (slug: ServiceCategory): string => {
    const icons: Record<ServiceCategory, string> = {
        infrastructure: "cube",
        identity: "lock",
        payments: "wallet",
        communications: "envelope",
        analytics: "post",
        domains: "globe",
        distribution: "share",
        marketing: "chart",
        devtools: "edit",
        other: "plus",
    };
    return icons[slug] || "cube";
};

// Get category color classes
const getCategoryColorClasses = (slug: ServiceCategory): string => {
    const colors: Record<ServiceCategory, string> = {
        infrastructure: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        identity: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        payments: "bg-green-500/10 text-green-600 dark:text-green-400",
        communications: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        analytics: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        domains: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
        distribution: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
        marketing: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        devtools: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        other: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
    return colors[slug] || "bg-gray-500/10 text-gray-600";
};

const ServicesStep = ({
    selectedServices,
    onToggleService,
    onBack,
    onContinue,
}: ServicesStepProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<ServiceCategory[]>([
        "infrastructure",
        "identity",
        "payments",
        "marketing",
    ]);

    // Group services by category
    const servicesByCategory = useMemo(() => {
        const grouped: Record<ServiceCategory, ServiceRegistryItem[]> = {} as Record<ServiceCategory, ServiceRegistryItem[]>;
        
        serviceRegistry.forEach((service) => {
            if (!grouped[service.category]) {
                grouped[service.category] = [];
            }
            grouped[service.category].push(service);
        });

        return grouped;
    }, []);

    // Filter services based on search query
    const filteredServicesByCategory = useMemo(() => {
        if (!searchQuery.trim()) {
            return servicesByCategory;
        }

        const query = searchQuery.toLowerCase();
        const filtered: Record<ServiceCategory, ServiceRegistryItem[]> = {} as Record<ServiceCategory, ServiceRegistryItem[]>;

        Object.entries(servicesByCategory).forEach(([category, services]) => {
            const matchingServices = services.filter(
                (service) =>
                    service.name.toLowerCase().includes(query) ||
                    service.description.toLowerCase().includes(query)
            );
            if (matchingServices.length > 0) {
                filtered[category as ServiceCategory] = matchingServices;
            }
        });

        return filtered;
    }, [servicesByCategory, searchQuery]);

    // Get ordered categories (prioritize ones with selected services or matches)
    const orderedCategories = useMemo(() => {
        const categories = serviceCategories.filter(
            (cat) => filteredServicesByCategory[cat.slug]?.length > 0
        );

        // Sort to prioritize categories with selected services
        return categories.sort((a, b) => {
            const aHasSelected = filteredServicesByCategory[a.slug]?.some((s) =>
                selectedServices.includes(s.id)
            );
            const bHasSelected = filteredServicesByCategory[b.slug]?.some((s) =>
                selectedServices.includes(s.id)
            );

            if (aHasSelected && !bHasSelected) return -1;
            if (!aHasSelected && bHasSelected) return 1;
            return 0;
        });
    }, [filteredServicesByCategory, selectedServices]);

    const toggleCategory = (categorySlug: ServiceCategory) => {
        setExpandedCategories((prev) =>
            prev.includes(categorySlug)
                ? prev.filter((c) => c !== categorySlug)
                : [...prev, categorySlug]
        );
    };

    // Expand all categories when searching
    const effectiveExpandedCategories = searchQuery.trim()
        ? orderedCategories.map((c) => c.slug)
        : expandedCategories;

    const totalServices = serviceRegistry.length;
    const selectedCount = selectedServices.length;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-body-bold">Select Services</h2>
                    <p className="text-small text-t-secondary mt-1">
                        Choose services to add to your project ({selectedCount} selected)
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="text-small text-t-secondary hover:text-t-primary transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Search Box */}
            <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon className="!w-5 !h-5 fill-t-tertiary" name="search" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${totalServices} services...`}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-b-surface1 border border-stroke-subtle text-body placeholder:text-t-tertiary focus:outline-none focus:border-primary1 transition-colors"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-t-tertiary hover:text-t-primary"
                    >
                        <Icon className="!w-4 !h-4 fill-current" name="close" />
                    </button>
                )}
            </div>

            {/* Selected Services Summary */}
            {selectedCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-primary1/5 rounded-xl border border-primary1/20">
                    <span className="text-small text-t-secondary mr-1">Selected:</span>
                    {selectedServices.slice(0, 5).map((id) => {
                        const service = serviceRegistry.find((s) => s.id === id);
                        return service ? (
                            <span
                                key={id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary1/10 text-primary1 text-xs font-medium"
                            >
                                {service.name}
                                <button
                                    onClick={() => onToggleService(id)}
                                    className="hover:text-primary1/70"
                                >
                                    ×
                                </button>
                            </span>
                        ) : null;
                    })}
                    {selectedCount > 5 && (
                        <span className="text-xs text-t-tertiary">
                            +{selectedCount - 5} more
                        </span>
                    )}
                </div>
            )}

            {/* Services by Category */}
            <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-stroke-subtle scrollbar-track-transparent pr-1">
                {orderedCategories.map((category) => {
                    const services = filteredServicesByCategory[category.slug] || [];
                    const isExpanded = effectiveExpandedCategories.includes(category.slug);
                    const selectedInCategory = services.filter((s) =>
                        selectedServices.includes(s.id)
                    ).length;

                    return (
                        <div
                            key={category.slug}
                            className="border border-stroke-subtle rounded-2xl overflow-hidden"
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.slug)}
                                className="flex items-center justify-between w-full p-3 bg-b-surface2 hover:bg-b-highlight transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex items-center justify-center size-8 rounded-lg ${getCategoryColorClasses(
                                            category.slug
                                        )}`}
                                    >
                                        <Icon
                                            className="!w-4 !h-4 fill-current"
                                            name={getCategoryIcon(category.slug)}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <span className="font-medium text-t-primary">
                                            {category.name}
                                        </span>
                                        <span className="text-xs text-t-tertiary ml-2">
                                            {services.length} services
                                            {selectedInCategory > 0 && (
                                                <span className="text-primary1 ml-1">
                                                    ({selectedInCategory} selected)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Icon
                                    className={`!w-4 !h-4 fill-t-tertiary transition-transform ${
                                        isExpanded ? "rotate-180" : ""
                                    }`}
                                    name="chevron"
                                />
                            </button>

                            {/* Services List */}
                            {isExpanded && (
                                <div className="p-2 bg-b-surface1 grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                    {services.map((service) => {
                                        const isSelected = selectedServices.includes(service.id);
                                        return (
                                            <button
                                                key={service.id}
                                                onClick={() => onToggleService(service.id)}
                                                className={`flex items-center p-2.5 rounded-xl text-left transition-all ${
                                                    isSelected
                                                        ? "bg-primary1/10 border-2 border-primary1"
                                                        : "bg-b-surface2 border-2 border-transparent hover:border-stroke-subtle"
                                                }`}
                                            >
                                                <div
                                                    className={`flex items-center justify-center size-5 mr-2.5 rounded-md border-2 transition-all shrink-0 ${
                                                        isSelected
                                                            ? "bg-primary1 border-primary1"
                                                            : "border-stroke-subtle"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <Icon
                                                            className="!w-3 !h-3 fill-white"
                                                            name="check"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-medium text-t-primary text-sm block truncate">
                                                        {service.name}
                                                    </span>
                                                    <span className="text-xs text-t-tertiary block truncate">
                                                        {service.description.length > 40
                                                            ? service.description.slice(0, 40) + "..."
                                                            : service.description}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {orderedCategories.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-t-tertiary">
                        <Icon className="!w-12 !h-12 fill-t-tertiary mx-auto mb-2" name="search" />
                        <p>No services found for "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-primary1 text-sm mt-2 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            <p className="text-xs text-t-tertiary mb-4">
                You can always add more services later from the project dashboard.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack}>
                    Back
                </Button>
                <Button isPrimary onClick={onContinue}>
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default ServicesStep;
