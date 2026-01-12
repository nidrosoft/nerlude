"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ProjectType } from "@/types";
import { ProjectTemplate } from "./types";
import { projectTypes, serviceNames } from "./data";

interface ConfirmStepProps {
    projectName: string;
    projectType: ProjectType;
    projectIcon: string;
    showCustomType: boolean;
    customTypeName: string;
    selectedTemplate: ProjectTemplate | null;
    selectedServices: string[];
    onBack: () => void;
    onCreateProject: () => void;
    isCreating?: boolean;
}

const ConfirmStep = ({
    projectName,
    projectType,
    projectIcon,
    showCustomType,
    customTypeName,
    selectedTemplate,
    selectedServices,
    onBack,
    onCreateProject,
    isCreating = false,
}: ConfirmStepProps) => {
    return (
        <div>
            <h2 className="text-body-bold mb-6">Review & Create</h2>

            <div className="p-4 rounded-3xl bg-b-surface1 mb-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center size-14 mr-4 rounded-2xl bg-primary1/10 text-2xl">
                        {projectIcon}
                    </div>
                    <div>
                        <div className="text-h4 text-t-primary">{projectName}</div>
                        <div className="text-small text-t-secondary">
                            {showCustomType ? customTypeName : projectTypes.find((t) => t.value === projectType)?.label}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-small">
                    {selectedTemplate && (
                        <div className="flex justify-between">
                            <span className="text-t-secondary">Template</span>
                            <span className="text-t-primary">{selectedTemplate.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-t-secondary">Services</span>
                        <span className="text-t-primary">
                            {selectedServices.length > 0
                                ? `${selectedServices.length} selected`
                                : "None selected"}
                        </span>
                    </div>
                </div>

                {selectedServices.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-stroke-subtle">
                        {selectedServices.map((s) => (
                            <span
                                key={s}
                                className="px-2 py-1 text-xs rounded-full bg-b-surface2 text-t-secondary"
                            >
                                {serviceNames[s] || s}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack} disabled={isCreating}>
                    Back
                </Button>
                <Button isPrimary onClick={onCreateProject} disabled={isCreating}>
                    {isCreating ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Creating...
                        </>
                    ) : (
                        <>
                            <Icon className="mr-2 !w-5 !h-5" name="plus" />
                            Create Project
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmStep;
