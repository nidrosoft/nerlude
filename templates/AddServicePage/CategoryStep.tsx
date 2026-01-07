"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceCategory } from "@/types";
import { serviceRegistry, getServicesByCategory, ServiceRegistryItem } from "@/registry";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";

interface CategoryStepProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    bulkMode: boolean;
    setBulkMode: (mode: boolean) => void;
    selectedServices: ServiceRegistryItem[];
    toggleServiceSelection: (service: ServiceRegistryItem) => void;
    isServiceSelected: (serviceId: string) => boolean;
    recentlyUsedServices: ServiceRegistryItem[];
    onCategorySelect: (category: ServiceCategory) => void;
    onServiceSelect: (service: ServiceRegistryItem) => void;
    onBulkAdd: () => void;
}

const CategoryStep = ({
    searchQuery,
    setSearchQuery,
    bulkMode,
    setBulkMode,
    selectedServices,
    toggleServiceSelection,
    isServiceSelected,
    recentlyUsedServices,
    onCategorySelect,
    onServiceSelect,
    onBulkAdd,
}: CategoryStepProps) => {
    const categories = Array.from(new Set(serviceRegistry.map((s) => s.category)));

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-body-bold">Select a category</h2>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-4">
                <Icon 
                    className="absolute left-4 top-1/2 -translate-y-1/2 !w-5 !h-5 fill-t-tertiary" 
                    name="search" 
                />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-b-surface1 border border-stroke-subtle text-body placeholder:text-t-tertiary focus:outline-none focus:border-stroke-focus transition-colors"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 fill-t-tertiary hover:fill-t-primary transition-colors"
                    >
                        <Icon className="!w-4 !h-4" name="close" />
                    </button>
                )}
            </div>
            
            {/* Recently Used Services */}
            {!searchQuery.trim() && recentlyUsedServices.length > 0 && !bulkMode && (
                <div className="mb-6">
                    <h3 className="text-small font-medium text-t-secondary mb-3">Recently used in other projects</h3>
                    <div className="flex flex-wrap gap-2">
                        {recentlyUsedServices.map((service) => {
                            const colors = getCategoryColor(service.category);
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => {
                                        onCategorySelect(service.category);
                                        onServiceSelect(service);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-b-surface1 hover:shadow-hover transition-all"
                                >
                                    <div className={`flex items-center justify-center size-6 rounded-lg border ${colors.border} ${colors.bg} ${colors.icon}`}>
                                        <Icon className="!w-3.5 !h-3.5" name={categoryIcons[service.category] || "star"} />
                                    </div>
                                    <span className="text-small font-medium text-t-primary">{service.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Show search results if searching */}
            {searchQuery.trim() ? (
                <div className="space-y-3">
                    {serviceRegistry
                        .filter(service => 
                            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 10)
                        .map((service) => {
                            const colors = getCategoryColor(service.category);
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => {
                                        onCategorySelect(service.category);
                                        onServiceSelect(service);
                                    }}
                                    className="flex items-center w-full p-4 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all text-left"
                                >
                                    <div
                                        className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                                    >
                                        <Icon className="!w-6 !h-6" name={categoryIcons[service.category] || "star"} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-body-bold text-t-primary">{service.name}</div>
                                        <div className="text-small text-t-secondary truncate">{service.description}</div>
                                        <div className="text-xs text-t-tertiary mt-1">{categoryLabels[service.category]}</div>
                                    </div>
                                    <Icon className="!w-5 !h-5 fill-t-tertiary ml-2" name="arrow-right" />
                                </button>
                            );
                        })
                    }
                    {serviceRegistry.filter(service => 
                        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                        <div className="text-center py-8 text-t-secondary">
                            No services found for "{searchQuery}"
                        </div>
                    )}
                </div>
            ) : bulkMode ? (
                /* Bulk Mode - Show all services with checkboxes */
                <div>
                    <div className="space-y-3 mb-6">
                        {serviceRegistry.map((service) => {
                            const colors = getCategoryColor(service.category);
                            const selected = isServiceSelected(service.id);
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => toggleServiceSelection(service)}
                                    className={`flex items-center w-full p-4 rounded-3xl transition-all text-left ${
                                        selected 
                                            ? "bg-primary1/10 ring-2 ring-primary1" 
                                            : "bg-b-surface1 hover:shadow-hover"
                                    }`}
                                >
                                    <div className={`flex items-center justify-center size-6 mr-4 rounded-lg border-2 transition-colors ${
                                        selected 
                                            ? "bg-primary1 border-primary1" 
                                            : "border-stroke-subtle"
                                    }`}>
                                        {selected && (
                                            <Icon className="!w-4 !h-4 fill-white" name="check" />
                                        )}
                                    </div>
                                    <div
                                        className={`flex items-center justify-center size-10 mr-3 rounded-xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                                    >
                                        <Icon className="!w-5 !h-5" name={categoryIcons[service.category] || "star"} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-body-bold text-t-primary">{service.name}</div>
                                        <div className="text-small text-t-secondary truncate">{service.description}</div>
                                    </div>
                                    <span className="text-xs text-t-tertiary px-2 py-1 rounded-lg bg-b-surface2">
                                        {categoryLabels[service.category]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {selectedServices.length > 0 && (
                        <div className="sticky bottom-0 pt-4 pb-2 bg-b-surface2 border-t border-stroke-subtle -mx-6 px-6">
                            <Button
                                className="w-full"
                                isPrimary
                                onClick={onBulkAdd}
                            >
                                Add {selectedServices.length} Service{selectedServices.length !== 1 ? "s" : ""}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
                    {categories.map((category) => {
                        const colors = getCategoryColor(category);
                        const count = getServicesByCategory(category).length;
                        return (
                            <button
                                key={category}
                                onClick={() => onCategorySelect(category)}
                                className="flex flex-col items-center p-5 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all text-center"
                            >
                                <div
                                    className={`flex items-center justify-center size-12 mb-3 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                                >
                                    <Icon className="!w-6 !h-6" name={categoryIcons[category] || "star"} />
                                </div>
                                <div className="text-small font-medium text-t-primary">
                                    {categoryLabels[category] || category}
                                </div>
                                <div className="text-xs text-t-tertiary mt-1">
                                    {count} service{count !== 1 ? "s" : ""}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoryStep;
