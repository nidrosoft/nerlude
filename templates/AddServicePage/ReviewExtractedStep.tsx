"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceCategory, UploadedDocument, ConfidenceLevel } from "@/types";
import { categoryLabels, categoryIcons } from "@/data/mockServices";
import { getCategoryColor } from "@/utils/categoryColors";

export interface ExtractedServiceItem {
    id: string;
    name: { value: string; confidence: ConfidenceLevel };
    category: { value: ServiceCategory; confidence: ConfidenceLevel };
    plan: { value: string; confidence: ConfidenceLevel } | null;
    costAmount: { value: number; confidence: ConfidenceLevel };
    costFrequency: { value: string; confidence: ConfidenceLevel };
    currency: { value: string; confidence: ConfidenceLevel };
    renewalDate: { value: string; confidence: ConfidenceLevel } | null;
    registryId: string | null;
    isConfirmed: boolean;
    documents: UploadedDocument[];
}

type Props = {
    services: ExtractedServiceItem[];
    onServicesChange: (services: ExtractedServiceItem[]) => void;
    onAddServices: () => void;
    onBack: () => void;
    onAddMore: () => void;
    isAdding: boolean;
};

const confidenceColors: Record<ConfidenceLevel, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'High confidence' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'Review recommended' },
    low: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Needs verification' },
};

const ReviewExtractedStep = ({ 
    services, 
    onServicesChange, 
    onAddServices, 
    onBack,
    onAddMore,
    isAdding 
}: Props) => {
    const [expandedService, setExpandedService] = useState<string | null>(services[0]?.id || null);

    const toggleServiceConfirm = (serviceId: string) => {
        onServicesChange(
            services.map((s) =>
                s.id === serviceId ? { ...s, isConfirmed: !s.isConfirmed } : s
            )
        );
    };

    const removeService = (serviceId: string) => {
        onServicesChange(services.filter((s) => s.id !== serviceId));
    };

    const confirmedCount = services.filter((s) => s.isConfirmed).length;
    const totalMonthlyCost = services
        .filter(s => s.isConfirmed)
        .reduce((sum, s) => {
            const amount = s.costAmount.value || 0;
            const freq = s.costFrequency.value;
            if (freq === 'yearly') return sum + (amount / 12);
            if (freq === 'one-time') return sum;
            return sum + amount;
        }, 0);

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

    const formatCost = (amount: number, currency: string, frequency: string) => {
        if (amount === 0) return "Free";
        const freqLabel = frequency === 'yearly' ? '/yr' : frequency === 'one-time' ? '' : '/mo';
        return `${currency}${amount.toFixed(2)}${freqLabel}`;
    };

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-body-bold mb-1">Review Extracted Services</h2>
                    <p className="text-small text-t-secondary">
                        We found {services.length} service{services.length !== 1 ? 's' : ''} in your documents. Review and edit the details below.
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

            {services.length === 0 ? (
                <div className="text-center py-12">
                    <div className="flex items-center justify-center size-16 mx-auto mb-4 rounded-2xl bg-amber-500/10">
                        <Icon className="!w-8 !h-8 fill-amber-500" name="warning" />
                    </div>
                    <h3 className="text-body-bold text-t-primary mb-2">No services found</h3>
                    <p className="text-small text-t-secondary">
                        We couldn't extract any services from your documents. Try uploading clearer invoices or receipts.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 mb-6">
                    {services.map((service) => {
                        const colors = getCategoryColor(service.category.value);
                        return (
                            <div
                                key={service.id}
                                className={`rounded-3xl border-2 transition-all overflow-hidden ${
                                    service.isConfirmed
                                        ? 'border-green-500/30 bg-green-500/5'
                                        : 'border-stroke-subtle bg-b-surface1'
                                }`}
                            >
                                {/* Service Header */}
                                <div
                                    className="flex items-center gap-4 p-4 cursor-pointer"
                                    onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                                >
                                    {/* Category Icon */}
                                    <div className={`flex items-center justify-center size-12 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}>
                                        <Icon className="!w-6 !h-6" name={categoryIcons[service.category.value] || "star"} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-body-bold text-t-primary">
                                                {service.name.value}
                                            </span>
                                            {renderConfidenceBadge(service.name.confidence)}
                                        </div>
                                        <div className="flex items-center gap-3 text-small text-t-secondary">
                                            <span>{categoryLabels[service.category.value] || service.category.value}</span>
                                            {service.plan && (
                                                <>
                                                    <span className="text-t-tertiary">•</span>
                                                    <span>{service.plan.value}</span>
                                                </>
                                            )}
                                            <span className="font-medium text-t-primary">
                                                {formatCost(service.costAmount.value, service.currency.value, service.costFrequency.value)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Confirm Toggle */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleServiceConfirm(service.id);
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                                service.isConfirmed
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-500'
                                                    : 'bg-t-primary border-t-primary text-b-surface1 hover:opacity-90'
                                            }`}
                                        >
                                            <Icon
                                                className={`!w-4 !h-4 ${service.isConfirmed ? 'fill-green-500' : 'fill-b-surface1'}`}
                                                name="check"
                                            />
                                            <span className="text-small font-medium">
                                                {service.isConfirmed ? 'Confirmed' : 'Confirm'}
                                            </span>
                                        </button>

                                        {/* Remove */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeService(service.id);
                                            }}
                                            className="flex items-center justify-center size-10 rounded-xl hover:bg-red-500/10 transition-colors group"
                                        >
                                            <Icon className="!w-4 !h-4 fill-t-tertiary group-hover:fill-red-500" name="trash" />
                                        </button>

                                        {/* Expand/Collapse */}
                                        <Icon
                                            className={`!w-5 !h-5 fill-t-tertiary transition-transform ${
                                                expandedService === service.id ? 'rotate-180' : ''
                                            }`}
                                            name="arrow-down"
                                        />
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedService === service.id && (
                                    <div className="px-4 pb-4 border-t border-stroke-subtle">
                                        {/* Service Details */}
                                        <div className="pt-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs text-t-tertiary mb-1">Cost</label>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium text-t-primary">
                                                            {service.currency.value}{service.costAmount.value.toFixed(2)}
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

                                        {/* Source Documents */}
                                        {service.documents.length > 0 && (
                                            <div className="pt-4 mt-4 border-t border-stroke-subtle">
                                                <label className="block text-xs text-t-tertiary mb-2">
                                                    Source Documents ({service.documents.length})
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.documents.map((doc) => (
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
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary */}
            {services.length > 0 && (
                <div className="p-4 rounded-2xl bg-b-surface1 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-small text-t-secondary">Ready to add:</span>
                            <span className="ml-2 font-medium text-t-primary">
                                {confirmedCount} of {services.length} services
                            </span>
                        </div>
                        <div className="text-small">
                            <span className="text-t-secondary">Total monthly cost:</span>
                            <span className="ml-2 font-bold text-t-primary">
                                ${totalMonthlyCost.toFixed(2)}/mo
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-6 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack} disabled={isAdding}>
                    Back
                </Button>
                <Button
                    isPrimary
                    onClick={onAddServices}
                    disabled={confirmedCount === 0 || isAdding}
                >
                    {isAdding ? (
                        <span className="flex items-center gap-2">
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Adding...
                        </span>
                    ) : (
                        `Add ${confirmedCount} Service${confirmedCount !== 1 ? 's' : ''}`
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ReviewExtractedStep;
