"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import { ExtractedProject, ExtractedService, ConfidenceLevel, ServiceCategory, ProjectType } from "@/types";

type Props = {
    projects: ExtractedProject[];
    onProjectsChange: (projects: ExtractedProject[]) => void;
    onContinue: () => void;
    onBack: () => void;
    onAddMore: () => void;
};

const confidenceColors: Record<ConfidenceLevel, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'High confidence' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'Review recommended' },
    low: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Needs verification' },
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
    marketing: 'Marketing & Growth',
    other: 'Other',
};

const typeLabels: Record<ProjectType, string> = {
    web: 'Web App',
    mobile: 'Mobile App',
    extension: 'Extension',
    desktop: 'Desktop',
    api: 'API',
    landing: 'Landing Page',
    embedded: 'Embedded',
    game: 'Game',
    ai: 'AI Project',
    custom: 'Custom',
};

const emojiOptions = [
    "🚀", "💼", "🎯", "📦", "🔥", "⚡", "🎨", "🛠️", "📱", "🌐", "💡", "🎮",
];

const ReviewProjects = ({ projects, onProjectsChange, onContinue, onBack, onAddMore }: Props) => {
    const [expandedProject, setExpandedProject] = useState<string | null>(projects[0]?.id || null);
    const [editingField, setEditingField] = useState<{ projectId: string; field: string } | null>(null);

    const updateProjectField = (projectId: string, field: string, value: string) => {
        onProjectsChange(
            projects.map((p) =>
                p.id === projectId
                    ? {
                        ...p,
                        [field]: typeof p[field as keyof ExtractedProject] === 'object'
                            ? { ...(p[field as keyof ExtractedProject] as object), value, confidence: 'high' as ConfidenceLevel }
                            : value,
                    }
                    : p
            )
        );
        setEditingField(null);
    };

    const updateProjectIcon = (projectId: string, icon: string) => {
        onProjectsChange(
            projects.map((p) => (p.id === projectId ? { ...p, icon } : p))
        );
    };

    const updateServiceField = (projectId: string, serviceId: string, field: string, value: string | number) => {
        onProjectsChange(
            projects.map((p) =>
                p.id === projectId
                    ? {
                        ...p,
                        services: p.services.map((s) =>
                            s.id === serviceId
                                ? {
                                    ...s,
                                    [field]: { ...(s[field as keyof ExtractedService] as object), value, confidence: 'high' as ConfidenceLevel },
                                }
                                : s
                        ),
                    }
                    : p
            )
        );
        setEditingField(null);
    };

    const removeService = (projectId: string, serviceId: string) => {
        onProjectsChange(
            projects.map((p) =>
                p.id === projectId
                    ? { ...p, services: p.services.filter((s) => s.id !== serviceId) }
                    : p
            )
        );
    };

    const removeProject = (projectId: string) => {
        onProjectsChange(projects.filter((p) => p.id !== projectId));
    };

    const toggleProjectConfirm = (projectId: string) => {
        onProjectsChange(
            projects.map((p) =>
                p.id === projectId ? { ...p, isConfirmed: !p.isConfirmed } : p
            )
        );
    };

    const confirmedCount = projects.filter((p) => p.isConfirmed).length;

    const renderConfidenceBadge = (confidence: ConfidenceLevel) => {
        const config = confidenceColors[confidence];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.text}`}>
                {confidence === 'high' && <Icon className="!w-3 !h-3 fill-green-500" name="check" />}
                {confidence === 'medium' && <Icon className="!w-3 !h-3 fill-amber-500" name="warning" />}
                {confidence === 'low' && <Icon className="!w-3 !h-3 fill-red-500" name="warning" />}
                {config.label}
            </span>
        );
    };

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-body-bold mb-1">Review Extracted Projects</h2>
                    <p className="text-small text-t-secondary">
                        We found {projects.length} project{projects.length !== 1 ? 's' : ''} in your documents. Review and edit the details below.
                    </p>
                </div>
                <button
                    onClick={onAddMore}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stroke-subtle bg-b-surface1 text-small font-medium text-t-primary hover:border-t-primary hover:shadow-hover transition-all"
                >
                    <Icon className="!w-4 !h-4 fill-current" name="plus" />
                    Add more files
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-b-surface1 mb-6">
                <div className="text-xs text-t-tertiary">Confidence levels:</div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-t-secondary">High confidence</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-t-secondary">Review recommended</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-t-secondary">Needs verification</span>
                </div>
            </div>

            {/* Projects List */}
            <div className="space-y-4 mb-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`rounded-3xl border-2 transition-all overflow-hidden ${
                            project.isConfirmed
                                ? 'border-green-500/30 bg-green-500/5'
                                : 'border-stroke-subtle bg-b-surface1'
                        }`}
                    >
                        {/* Project Header */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer"
                            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                        >
                            {/* Icon Selector */}
                            <div className="relative group">
                                <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10 text-xl">
                                    {project.icon}
                                </div>
                                <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-b-surface2 border border-stroke-subtle">
                                        <Icon className="!w-3 !h-3 fill-t-tertiary" name="edit" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {editingField?.projectId === project.id && editingField?.field === 'name' ? (
                                        <input
                                            type="text"
                                            defaultValue={project.name.value}
                                            autoFocus
                                            className="px-2 py-1 rounded-lg bg-b-surface2 text-body-bold text-t-primary outline-none focus:ring-2 focus:ring-primary1/20"
                                            onBlur={(e) => updateProjectField(project.id, 'name', e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    updateProjectField(project.id, 'name', e.currentTarget.value);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span
                                            className="text-body-bold text-t-primary cursor-text hover:bg-b-surface2 px-1 -mx-1 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingField({ projectId: project.id, field: 'name' });
                                            }}
                                        >
                                            {project.name.value}
                                        </span>
                                    )}
                                    {renderConfidenceBadge(project.name.confidence)}
                                </div>
                                <div className="flex items-center gap-3 text-small text-t-secondary">
                                    <span className="px-2 py-0.5 rounded-full bg-b-surface2">
                                        {typeLabels[project.type.value] || project.type.value}
                                    </span>
                                    <span>{project.services.length} service{project.services.length !== 1 ? 's' : ''}</span>
                                    <span className="font-medium text-t-primary">
                                        ${project.totalMonthlyCost.toFixed(2)}/mo
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Confirm Toggle */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleProjectConfirm(project.id);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                        project.isConfirmed
                                            ? 'bg-green-500/10 border-green-500/30 text-green-500'
                                            : 'bg-t-primary border-t-primary text-b-surface1 hover:opacity-90'
                                    }`}
                                >
                                    <Icon
                                        className={`!w-4 !h-4 ${project.isConfirmed ? 'fill-green-500' : 'fill-b-surface1'}`}
                                        name="check"
                                    />
                                    <span className="text-small font-medium">
                                        {project.isConfirmed ? 'Confirmed' : 'Confirm'}
                                    </span>
                                </button>

                                {/* Remove */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeProject(project.id);
                                    }}
                                    className="flex items-center justify-center size-10 rounded-xl hover:bg-red-500/10 transition-colors group"
                                >
                                    <Icon className="!w-4 !h-4 fill-t-tertiary group-hover:fill-red-500" name="trash" />
                                </button>

                                {/* Expand/Collapse */}
                                <Icon
                                    className={`!w-5 !h-5 fill-t-tertiary transition-transform ${
                                        expandedProject === project.id ? 'rotate-180' : ''
                                    }`}
                                    name="arrow-down"
                                />
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedProject === project.id && (
                            <div className="px-4 pb-4 border-t border-stroke-subtle">
                                {/* Icon Picker */}
                                <div className="py-4 border-b border-stroke-subtle">
                                    <label className="block text-xs text-t-tertiary mb-2">Project Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {emojiOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => updateProjectIcon(project.id, emoji)}
                                                className={`flex items-center justify-center size-10 rounded-xl text-lg transition-all ${
                                                    project.icon === emoji
                                                        ? 'bg-primary1/10 border-2 border-primary1'
                                                        : 'bg-b-surface2 border-2 border-transparent hover:border-stroke-subtle'
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="pt-4">
                                    <label className="block text-xs text-t-tertiary mb-3">Services ({project.services.length})</label>
                                    <div className="space-y-3">
                                        {project.services.map((service) => (
                                            <div
                                                key={service.id}
                                                className="p-4 rounded-2xl bg-b-surface2"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {service.logoUrl ? (
                                                            <img
                                                                src={service.logoUrl}
                                                                alt={service.name.value}
                                                                className="size-8 rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center size-8 rounded-lg bg-b-surface1">
                                                                <Icon className="!w-4 !h-4 fill-t-tertiary" name="cube" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-t-primary">
                                                                    {service.name.value}
                                                                </span>
                                                                {renderConfidenceBadge(service.name.confidence)}
                                                            </div>
                                                            <span className="text-xs text-t-tertiary">
                                                                {categoryLabels[service.category.value] || service.category.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeService(project.id, service.id)}
                                                        className="flex items-center justify-center size-8 rounded-lg hover:bg-red-500/10 transition-colors group"
                                                    >
                                                        <Icon className="!w-4 !h-4 fill-t-tertiary group-hover:fill-red-500" name="close" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3 text-small">
                                                    <div>
                                                        <label className="block text-xs text-t-tertiary mb-1">Cost</label>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium text-t-primary">
                                                                {service.currency.value}{service.costAmount.value}
                                                            </span>
                                                            <span className="text-t-tertiary">
                                                                /{service.costFrequency.value === 'monthly' ? 'mo' : service.costFrequency.value === 'yearly' ? 'yr' : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {service.plan && (
                                                        <div>
                                                            <label className="block text-xs text-t-tertiary mb-1">Plan</label>
                                                            <span className="text-t-primary">{service.plan.value}</span>
                                                        </div>
                                                    )}
                                                    {service.renewalDate && (
                                                        <div>
                                                            <label className="block text-xs text-t-tertiary mb-1">Renewal</label>
                                                            <span className="text-t-primary">{service.renewalDate.value}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="pt-4 mt-4 border-t border-stroke-subtle">
                                    <label className="block text-xs text-t-tertiary mb-2">
                                        Source Documents ({project.documents.length})
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {project.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-b-surface2"
                                            >
                                                <Icon className="!w-4 !h-4 fill-t-tertiary" name="documents" />
                                                <span className="text-xs text-t-secondary truncate max-w-32">
                                                    {doc.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-b-surface1 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-small text-t-secondary">Ready to create:</span>
                        <span className="ml-2 font-medium text-t-primary">
                            {confirmedCount} of {projects.length} projects
                        </span>
                    </div>
                    <div className="text-small">
                        <span className="text-t-secondary">Total monthly cost:</span>
                        <span className="ml-2 font-bold text-t-primary">
                            ${projects.filter(p => p.isConfirmed).reduce((sum, p) => sum + p.totalMonthlyCost, 0).toFixed(2)}/mo
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-6 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack}>
                    Back
                </Button>
                <Button
                    isPrimary
                    onClick={onContinue}
                    disabled={confirmedCount === 0}
                >
                    Create {confirmedCount} Project{confirmedCount !== 1 ? 's' : ''}
                </Button>
            </div>
        </div>
    );
};

export default ReviewProjects;
