"use client";

import Icon from "@/components/Icon";
import { Service } from "@/types";
import { categoryLabels } from "@/data/mockServices";

interface OverviewTabProps {
    service: Service;
    onEditService?: () => void;
}

const OverviewTab = ({ service, onEditService }: OverviewTabProps) => {
    const formatCost = () => {
        if (service.costAmount === 0) return "Free";
        const freq = service.costFrequency === "monthly" ? "mo" : 
                     service.costFrequency === "yearly" ? "yr" : 
                     service.costFrequency === "one-time" ? "" : "mo";
        return freq ? `$${service.costAmount}/${freq}` : `$${service.costAmount}`;
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric", 
            year: "numeric" 
        });
    };

    return (
        <div className="space-y-6">
            {/* Service Details Card */}
            <div className="p-8 rounded-4xl bg-b-surface2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-h4">Service Details</h3>
                    {onEditService && (
                        <button
                            onClick={onEditService}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-small font-medium text-t-secondary hover:text-t-primary bg-b-surface1 hover:bg-b-surface1/80 fill-t-secondary hover:fill-t-primary transition-colors"
                        >
                            <Icon className="!w-4 !h-4" name="edit" />
                            Edit Details
                        </button>
                    )}
                </div>
                
                {/* Two Column Layout for Details */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-md:grid-cols-1">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center py-4 border-b border-stroke-subtle">
                            <span className="text-body text-t-secondary">Category</span>
                            <span className="text-body font-medium text-t-primary">{categoryLabels[service.categoryId]}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-stroke-subtle">
                            <span className="text-body text-t-secondary">Plan</span>
                            <span className="text-body font-medium text-t-primary">{service.plan || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-body text-t-secondary">Added</span>
                            <span className="text-body font-medium text-t-primary">{formatDate(service.createdAt)}</span>
                        </div>
                    </div>
                    
                    {/* Right Column - Billing Info */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center py-4 border-b border-stroke-subtle">
                            <span className="text-body text-t-secondary">Cost</span>
                            <span className="text-body font-semibold text-t-primary">{formatCost()}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-stroke-subtle">
                            <span className="text-body text-t-secondary">Billing Cycle</span>
                            <span className="text-body font-medium text-t-primary capitalize">{service.costFrequency}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-stroke-subtle">
                            <span className="text-body text-t-secondary">Next Renewal</span>
                            <span className="text-body font-medium text-t-primary">{formatDate(service.renewalDate)}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-body text-t-secondary">Last Payment</span>
                            <span className="text-body font-medium text-t-primary">{formatDate(service.lastPaymentDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {service.notes && (
                <div className="p-8 rounded-4xl bg-b-surface2">
                    <h3 className="text-h4 mb-4">Notes</h3>
                    <p className="text-body text-t-secondary whitespace-pre-wrap">{service.notes}</p>
                </div>
            )}

            {/* Quick Links */}
            {service.quickLinks && service.quickLinks.length > 0 && (
                <div className="p-8 rounded-4xl bg-b-surface2">
                    <h3 className="text-h4 mb-5">Quick Links</h3>
                    <div className="flex flex-wrap gap-3">
                        {service.quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-b-surface1 text-body text-t-secondary hover:text-t-primary fill-t-secondary hover:fill-t-primary transition-colors"
                            >
                                <Icon className="!w-4.5 !h-4.5" name="export" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
