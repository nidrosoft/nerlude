"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceRegistryItem } from "@/registry";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";

interface ConfirmStepProps {
    selectedService: ServiceRegistryItem;
    selectedPlan: string;
    customCost: string;
    renewalDate: string;
    credentials: Record<string, string>;
    onBack: () => void;
    onAddService: () => void;
}

const ConfirmStep = ({
    selectedService,
    selectedPlan,
    customCost,
    renewalDate,
    credentials,
    onBack,
    onAddService,
}: ConfirmStepProps) => {
    const colors = getCategoryColor(selectedService.category);

    return (
        <div>
            <h2 className="text-body-bold mb-6">Review & Confirm</h2>

            <div className="p-4 rounded-3xl bg-b-surface1 mb-6">
                <div className="flex items-center mb-4">
                    <div
                        className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                    >
                        <Icon className="!w-6 !h-6" name={categoryIcons[selectedService.category] || "star"} />
                    </div>
                    <div>
                        <div className="font-medium text-t-primary">{selectedService.name}</div>
                        <div className="text-small text-t-secondary">{selectedPlan} plan</div>
                    </div>
                </div>

                <div className="space-y-2 text-small">
                    <div className="flex justify-between">
                        <span className="text-t-secondary">Category</span>
                        <span className="text-t-primary">{categoryLabels[selectedService.category]}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-t-secondary">Monthly Cost</span>
                        <span className="text-t-primary">
                            {customCost
                                ? `$${customCost}`
                                : selectedService.plans.find((p) => p.name === selectedPlan)?.price === 0
                                ? "Free"
                                : `$${selectedService.plans.find((p) => p.name === selectedPlan)?.price}/mo`}
                        </span>
                    </div>
                    {renewalDate && (
                        <div className="flex justify-between">
                            <span className="text-t-secondary">Next Renewal</span>
                            <span className="text-t-primary">
                                {new Date(renewalDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-t-secondary">Credentials</span>
                        <span className="text-t-primary">
                            {Object.keys(credentials).filter((k) => credentials[k]).length > 0
                                ? `${Object.keys(credentials).filter((k) => credentials[k]).length} field(s) saved`
                                : "None provided"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack}>
                    Back
                </Button>
                <Button isPrimary onClick={onAddService}>
                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                    Add Service
                </Button>
            </div>
        </div>
    );
};

export default ConfirmStep;
