"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ProjectTemplate } from "./types";
import { templates, serviceNames } from "./data";

interface TemplateStepProps {
    selectedTemplate: ProjectTemplate | null;
    onTemplateSelect: (template: ProjectTemplate) => void;
    onBack: () => void;
    onContinue: () => void;
}

const TemplateStep = ({
    selectedTemplate,
    onTemplateSelect,
    onBack,
    onContinue,
}: TemplateStepProps) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-body-bold">Choose a Template</h2>
                <button
                    onClick={onBack}
                    className="text-small text-t-secondary hover:text-t-primary transition-colors"
                >
                    ← Back
                </button>
            </div>

            <div className="flex gap-6 max-lg:flex-col">
                {/* Template List */}
                <div className="flex-1 space-y-3">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => onTemplateSelect(template)}
                            className={`flex items-start w-full p-4 rounded-3xl text-left transition-all ${
                                selectedTemplate?.id === template.id
                                    ? "bg-primary1/10 border-2 border-primary1"
                                    : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                            }`}
                        >
                            <span className="text-2xl mr-3">{template.icon}</span>
                            <div className="flex-1">
                                <div className="font-medium text-t-primary">{template.name}</div>
                                <div className="text-small text-t-secondary mt-0.5">
                                    {template.description}
                                </div>
                            </div>
                            <span className="text-xs text-t-tertiary bg-b-surface2 px-2 py-1 rounded-lg">
                                {template.suggestedServices.length} services
                            </span>
                        </button>
                    ))}
                </div>

                {/* Template Preview Panel */}
                <div className="w-72 max-lg:w-full">
                    <div className="sticky top-4 p-5 rounded-3xl bg-b-surface1 border border-stroke-subtle">
                        {selectedTemplate ? (
                            <>
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stroke-subtle">
                                    <span className="text-3xl">{selectedTemplate.icon}</span>
                                    <div>
                                        <h3 className="font-medium text-t-primary">{selectedTemplate.name}</h3>
                                        <p className="text-xs text-t-tertiary">{selectedTemplate.type} project</p>
                                    </div>
                                </div>
                                <h4 className="text-small font-medium text-t-secondary mb-3">
                                    Included Services ({selectedTemplate.suggestedServices.length})
                                </h4>
                                {selectedTemplate.suggestedServices.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedTemplate.suggestedServices.map((serviceId) => (
                                            <div
                                                key={serviceId}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-b-surface2"
                                            >
                                                <div className="flex items-center justify-center size-6 rounded-lg bg-primary1/10 fill-primary1">
                                                    <Icon className="!w-3.5 !h-3.5" name="check" />
                                                </div>
                                                <span className="text-small text-t-primary">
                                                    {serviceNames[serviceId] || serviceId}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-small text-t-tertiary">
                                        No pre-selected services. You can add services after creating the project.
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="flex items-center justify-center size-12 mx-auto mb-3 rounded-2xl bg-b-surface2 fill-t-tertiary">
                                    <Icon className="!w-6 !h-6" name="post" />
                                </div>
                                <p className="text-small text-t-tertiary">
                                    Select a template to preview included services
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

export default TemplateStep;
