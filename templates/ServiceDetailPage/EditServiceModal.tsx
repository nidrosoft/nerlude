"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Service, CostFrequency } from "@/types";

interface EditServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service;
    onSave: (updates: Partial<Service>) => Promise<void>;
    isSaving?: boolean;
}

const frequencyOptions: { value: CostFrequency; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "one-time", label: "One-time" },
];

const EditServiceModal = ({
    isOpen,
    onClose,
    service,
    onSave,
    isSaving = false,
}: EditServiceModalProps) => {
    const [plan, setPlan] = useState(service.plan || "");
    const [costAmount, setCostAmount] = useState(service.costAmount.toString());
    const [costFrequency, setCostFrequency] = useState<CostFrequency>(service.costFrequency);
    const [renewalDate, setRenewalDate] = useState(service.renewalDate || "");
    const [lastPaymentDate, setLastPaymentDate] = useState(service.lastPaymentDate || "");

    useEffect(() => {
        if (isOpen) {
            setPlan(service.plan || "");
            setCostAmount(service.costAmount.toString());
            setCostFrequency(service.costFrequency);
            setRenewalDate(service.renewalDate ? service.renewalDate.split("T")[0] : "");
            setLastPaymentDate(service.lastPaymentDate ? service.lastPaymentDate.split("T")[0] : "");
        }
    }, [isOpen, service]);

    const handleSave = async () => {
        await onSave({
            plan: plan || undefined,
            costAmount: parseFloat(costAmount) || 0,
            costFrequency,
            renewalDate: renewalDate || undefined,
            lastPaymentDate: lastPaymentDate || undefined,
        });
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isSaving) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 bg-[#282828]/90" />
            <div className="relative z-10 w-full max-w-lg mx-4 p-8 rounded-4xl bg-b-surface1">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-h4">Edit Service Details</h3>
                        <p className="text-small text-t-secondary mt-1">
                            Update billing and cost information
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-b-surface2 transition-colors fill-t-secondary hover:fill-t-primary disabled:opacity-50"
                    >
                        <Icon className="!w-5 !h-5" name="close" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    {/* Plan */}
                    <div>
                        <label className="block mb-2 text-small font-medium text-t-secondary">
                            Plan
                        </label>
                        <input
                            type="text"
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            placeholder="e.g., Pro, Enterprise, Hobby"
                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>

                    {/* Cost Amount & Frequency */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Cost Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-t-tertiary">$</span>
                                <input
                                    type="number"
                                    value={costAmount}
                                    onChange={(e) => setCostAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-b-surface2 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Billing Cycle
                            </label>
                            <select
                                value={costFrequency}
                                onChange={(e) => setCostFrequency(e.target.value as CostFrequency)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20 appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                            >
                                {frequencyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Renewal Date & Last Payment Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Next Renewal
                            </label>
                            <input
                                type="date"
                                value={renewalDate}
                                onChange={(e) => setRenewalDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Last Payment
                            </label>
                            <input
                                type="date"
                                value={lastPaymentDate}
                                onChange={(e) => setLastPaymentDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                    </div>

                    {/* Helper text */}
                    <p className="text-xs text-t-tertiary">
                        Set the renewal date to get notified before your next billing cycle.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-stroke-subtle">
                    <Button
                        className="flex-1"
                        isStroke
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        isPrimary
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditServiceModal;
