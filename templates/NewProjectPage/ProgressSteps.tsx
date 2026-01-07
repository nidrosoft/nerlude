"use client";

import Icon from "@/components/Icon";
import { Step, FlowType } from "./types";
import { manualSteps, documentSteps } from "./data";

interface ProgressStepsProps {
    currentStep: Step;
    flowType: FlowType;
}

const ProgressSteps = ({ currentStep, flowType }: ProgressStepsProps) => {
    const steps = flowType === "documents" ? documentSteps : manualSteps;
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <div className="flex items-center gap-2 mb-8">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div
                        className={`flex items-center justify-center size-8 rounded-full text-small font-medium transition-all ${
                            index <= currentStepIndex
                                ? "bg-t-primary text-b-surface1"
                                : "bg-b-surface2 text-t-tertiary"
                        }`}
                    >
                        {index < currentStepIndex ? (
                            <Icon className="!w-4 !h-4 fill-b-surface1" name="check" />
                        ) : (
                            step.number
                        )}
                    </div>
                    <span
                        className={`ml-2 text-small font-medium ${
                            index <= currentStepIndex ? "text-t-primary" : "text-t-tertiary"
                        }`}
                    >
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-8 h-0.5 mx-3 ${
                                index < currentStepIndex ? "bg-t-primary" : "bg-b-surface2"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressSteps;
