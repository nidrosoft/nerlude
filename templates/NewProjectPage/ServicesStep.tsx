"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { serviceNames } from "./data";

interface ServicesStepProps {
    selectedServices: string[];
    onToggleService: (serviceId: string) => void;
    onBack: () => void;
    onContinue: () => void;
}

const ServicesStep = ({
    selectedServices,
    onToggleService,
    onBack,
    onContinue,
}: ServicesStepProps) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-body-bold">Select Services</h2>
                    <p className="text-small text-t-secondary mt-1">
                        Choose which services to add to your project
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="text-small text-t-secondary hover:text-t-primary transition-colors"
                >
                    ← Back
                </button>
            </div>

            <div className="space-y-2 mb-6">
                {Object.entries(serviceNames).map(([id, name]) => (
                    <button
                        key={id}
                        onClick={() => onToggleService(id)}
                        className={`flex items-center w-full p-3 rounded-2xl text-left transition-all ${
                            selectedServices.includes(id)
                                ? "bg-primary1/10 border-2 border-primary1"
                                : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                        }`}
                    >
                        <div
                            className={`flex items-center justify-center size-6 mr-3 rounded-lg border-2 transition-all ${
                                selectedServices.includes(id)
                                    ? "bg-primary1 border-primary1"
                                    : "border-stroke-subtle"
                            }`}
                        >
                            {selectedServices.includes(id) && (
                                <Icon className="!w-4 !h-4 fill-white" name="check" />
                            )}
                        </div>
                        <span className="font-medium text-t-primary">{name}</span>
                    </button>
                ))}
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
