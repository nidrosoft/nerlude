"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceRegistryItem } from "@/registry";
import { categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";
import { useToast } from "@/components/Toast";

interface ConfigureStepProps {
    selectedService: ServiceRegistryItem;
    selectedPlan: string;
    setSelectedPlan: (plan: string) => void;
    customCost: string;
    setCustomCost: (cost: string) => void;
    renewalDate: string;
    setRenewalDate: (date: string) => void;
    credentials: Record<string, string>;
    setCredentials: (credentials: Record<string, string>) => void;
    visibleCredentials: Record<string, boolean>;
    setVisibleCredentials: (visible: Record<string, boolean>) => void;
    onBack: () => void;
    onContinue: () => void;
}

const ConfigureStep = ({
    selectedService,
    selectedPlan,
    setSelectedPlan,
    customCost,
    setCustomCost,
    renewalDate,
    setRenewalDate,
    credentials,
    setCredentials,
    visibleCredentials,
    setVisibleCredentials,
    onBack,
    onContinue,
}: ConfigureStepProps) => {
    const toast = useToast();
    const colors = getCategoryColor(selectedService.category);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div
                        className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                    >
                        <Icon className="!w-6 !h-6" name={categoryIcons[selectedService.category] || "star"} />
                    </div>
                    <div>
                        <h2 className="text-body-bold">{selectedService.name}</h2>
                        <p className="text-small text-t-secondary">{selectedService.description}</p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="text-small text-t-secondary hover:text-t-primary transition-colors"
                >
                    ← Change service
                </button>
            </div>

            {/* Plan Selection */}
            {selectedService.plans.length > 0 && (
                <div className="mb-6">
                    <label className="block mb-2 text-small font-medium text-t-secondary">
                        Plan
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {selectedService.plans.map((plan) => (
                            <button
                                key={plan.name}
                                onClick={() => setSelectedPlan(plan.name)}
                                className={`px-4 py-2 rounded-xl text-small font-medium transition-all ${
                                    selectedPlan === plan.name
                                        ? "bg-t-primary text-b-surface1"
                                        : "bg-b-surface1 text-t-secondary hover:bg-b-surface1/80"
                                }`}
                            >
                                {plan.name}
                                {plan.price > 0 && (
                                    <span className="ml-1 opacity-75">
                                        ${plan.price}/{plan.frequency === "monthly" ? "mo" : "yr"}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Cost */}
            <div className="mb-6">
                <label className="block mb-2 text-small font-medium text-t-secondary">
                    Monthly Cost (optional override)
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-t-tertiary">$</span>
                    <input
                        type="number"
                        value={customCost}
                        onChange={(e) => setCustomCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-b-surface1 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                    />
                </div>
            </div>

            {/* Renewal Date */}
            <div className="mb-6">
                <label className="block mb-2 text-small font-medium text-t-secondary">
                    Next Renewal Date (optional)
                </label>
                <input
                    type="date"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                />
            </div>

            {/* Credentials */}
            {selectedService.credentialFields.length > 0 && (
                <div className="mb-6">
                    <label className="block mb-3 text-small font-medium text-t-secondary">
                        Credentials (optional - stored securely)
                    </label>
                    <div className="space-y-3">
                        {selectedService.credentialFields.map((field) => {
                            const isPassword = field.type === "password";
                            const isVisible = visibleCredentials[field.key] || false;
                            const hasValue = credentials[field.key] && credentials[field.key].length > 0;
                            
                            return (
                                <div key={field.key}>
                                    <label className="block mb-1 text-xs text-t-tertiary">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={isPassword && !isVisible ? "password" : "text"}
                                            value={credentials[field.key] || ""}
                                            onChange={(e) =>
                                                setCredentials({ ...credentials, [field.key]: e.target.value })
                                            }
                                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                            className="w-full px-4 py-3 pr-20 rounded-xl bg-b-surface1 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {isPassword && (
                                                <button
                                                    type="button"
                                                    onClick={() => setVisibleCredentials({
                                                        ...visibleCredentials,
                                                        [field.key]: !isVisible
                                                    })}
                                                    className="p-2 rounded-lg hover:bg-b-surface2 transition-colors fill-t-tertiary hover:fill-t-primary"
                                                    title={isVisible ? "Hide" : "Show"}
                                                >
                                                    <Icon className="!w-4 !h-4" name={isVisible ? "eye-hide" : "eye"} />
                                                </button>
                                            )}
                                            {hasValue && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(credentials[field.key]);
                                                        toast.success("Copied", "Credential copied to clipboard");
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-b-surface2 transition-colors fill-t-tertiary hover:fill-t-primary"
                                                    title="Copy"
                                                >
                                                    <Icon className="!w-4 !h-4" name="copy" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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

export default ConfigureStep;
