"use client";

import Icon from "@/components/Icon";
import { ServiceCategory } from "@/types";
import { getServicesByCategory, ServiceRegistryItem } from "@/registry";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";

interface ServiceStepProps {
    selectedCategory: ServiceCategory;
    onServiceSelect: (service: ServiceRegistryItem) => void;
    onBack: () => void;
}

const ServiceStep = ({
    selectedCategory,
    onServiceSelect,
    onBack,
}: ServiceStepProps) => {
    const colors = getCategoryColor(selectedCategory);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-body-bold">
                    Select a {categoryLabels[selectedCategory]?.toLowerCase() || selectedCategory} service
                </h2>
                <button
                    onClick={onBack}
                    className="text-small text-t-secondary hover:text-t-primary transition-colors"
                >
                    ← Back to categories
                </button>
            </div>
            <div className="space-y-3">
                {getServicesByCategory(selectedCategory).map((service) => (
                    <button
                        key={service.id}
                        onClick={() => onServiceSelect(service)}
                        className="flex items-center w-full p-4 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all text-left"
                    >
                        <div
                            className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                        >
                            <Icon className="!w-6 !h-6" name={categoryIcons[selectedCategory] || "star"} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-t-primary">{service.name}</div>
                            <div className="text-small text-t-secondary truncate">
                                {service.description}
                            </div>
                        </div>
                        <Icon className="!w-5 !h-5 fill-t-tertiary" name="arrow-right" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceStep;
