"use client";

import { Lamp } from "iconsax-react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ExtractedProject, ServiceCategory } from "@/types";

type Props = {
    projects: ExtractedProject[];
    onConfirm: () => void;
    onBack: () => void;
};

const categoryLabels: Record<ServiceCategory, string> = {
    infrastructure: 'Infrastructure',
    identity: 'Identity & Access',
    payments: 'Payments',
    communications: 'Communications',
    analytics: 'Analytics & Monitoring',
    domains: 'Domains & DNS',
    distribution: 'Distribution',
    devtools: 'Developer Tools',
    other: 'Other',
};

const ConfirmCreate = ({ projects, onConfirm, onBack }: Props) => {
    const confirmedProjects = projects.filter((p) => p.isConfirmed);
    const totalServices = confirmedProjects.reduce((sum, p) => sum + p.services.length, 0);
    const totalMonthlyCost = confirmedProjects.reduce((sum, p) => sum + p.totalMonthlyCost, 0);
    const totalDocuments = confirmedProjects.reduce((sum, p) => sum + p.documents.length, 0);

    return (
        <div>
            <div className="text-center mb-8">
                <div className="flex items-center justify-center size-16 mx-auto mb-4 rounded-2xl bg-green-500/10">
                    <Icon className="!w-8 !h-8 fill-green-500" name="check" />
                </div>
                <h2 className="text-h4 text-t-primary mb-2">Ready to Create</h2>
                <p className="text-small text-t-secondary">
                    Review the summary below and confirm to create your projects.
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8 max-md:grid-cols-2">
                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                    <div className="text-h3 text-t-primary mb-1">{confirmedProjects.length}</div>
                    <div className="text-xs text-t-tertiary">Project{confirmedProjects.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                    <div className="text-h3 text-t-primary mb-1">{totalServices}</div>
                    <div className="text-xs text-t-tertiary">Service{totalServices !== 1 ? 's' : ''}</div>
                </div>
                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                    <div className="text-h3 text-t-primary mb-1">${totalMonthlyCost.toFixed(0)}</div>
                    <div className="text-xs text-t-tertiary">Monthly Cost</div>
                </div>
                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                    <div className="text-h3 text-t-primary mb-1">{totalDocuments}</div>
                    <div className="text-xs text-t-tertiary">Document{totalDocuments !== 1 ? 's' : ''}</div>
                </div>
            </div>

            {/* Projects Preview */}
            <div className="space-y-4 mb-8">
                {confirmedProjects.map((project) => (
                    <div
                        key={project.id}
                        className="p-4 rounded-3xl bg-b-surface1 border border-stroke-subtle"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10 text-xl shrink-0">
                                {project.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-body-bold text-t-primary mb-1">{project.name.value}</h3>
                                <div className="flex items-center gap-3 text-small text-t-secondary mb-3">
                                    <span>{project.services.length} service{project.services.length !== 1 ? 's' : ''}</span>
                                    <span>•</span>
                                    <span className="font-medium">${project.totalMonthlyCost.toFixed(2)}/mo</span>
                                </div>

                                {/* Services Tree */}
                                <div className="space-y-2">
                                    {project.services.map((service, index) => (
                                        <div key={service.id} className="flex items-center gap-2 text-small">
                                            <div className="flex items-center gap-2 text-t-tertiary">
                                                {index === project.services.length - 1 ? '└' : '├'}
                                                <span className="w-1.5 h-1.5 rounded-full bg-t-tertiary" />
                                            </div>
                                            <span className="text-t-primary">{service.name.value}</span>
                                            <span className="text-t-tertiary">
                                                ({categoryLabels[service.category.value]})
                                            </span>
                                            <span className="ml-auto text-t-secondary">
                                                {service.currency.value}{service.costAmount.value}/{service.costFrequency.value === 'monthly' ? 'mo' : 'yr'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Documents */}
                                {project.documents.length > 0 && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stroke-subtle">
                                        <Icon className="!w-4 !h-4 fill-t-tertiary" name="documents" />
                                        <span className="text-xs text-t-tertiary">
                                            {project.documents.length} document{project.documents.length !== 1 ? 's' : ''} will be saved to resources
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* What happens next */}
            <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 mb-8">
                <div className="flex items-start gap-3">
                    <Lamp size={20} color="#8B5CF6" variant="Bold" className="shrink-0 mt-0.5" />
                    <div className="text-small">
                        <p className="font-medium text-t-primary mb-2">What happens next:</p>
                        <ul className="text-t-secondary space-y-1">
                            <li>• Your projects will be created with all services and costs</li>
                            <li>• Uploaded documents will be saved to each project's resources folder</li>
                            <li>• Renewal alerts will be set up based on detected dates</li>
                            <li>• You can edit any details from the project dashboard</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-6 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack}>
                    Back to Review
                </Button>
                <Button isPrimary onClick={onConfirm}>
                    <Icon className="mr-2 !w-5 !h-5" name="check" />
                    Create {confirmedProjects.length} Project{confirmedProjects.length !== 1 ? 's' : ''}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmCreate;
