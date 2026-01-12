"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Service, CostFrequency } from "@/types";
import { notificationSettings } from "./data";

interface SettingsTabProps {
    service: Service;
    onDeleteClick: () => void;
    onUpdateService?: (updates: Partial<Service>) => Promise<void>;
    isSaving?: boolean;
}

const frequencyOptions: { value: CostFrequency; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "one-time", label: "One-time" },
];

const SettingsTab = ({ service, onDeleteClick, onUpdateService, isSaving = false }: SettingsTabProps) => {
    // General settings state
    const [name, setName] = useState(service.name);
    const [notes, setNotes] = useState(service.notes || "");
    
    // Billing settings state
    const [plan, setPlan] = useState(service.plan || "");
    const [costAmount, setCostAmount] = useState(service.costAmount.toString());
    const [costFrequency, setCostFrequency] = useState<CostFrequency>(service.costFrequency);
    const [renewalDate, setRenewalDate] = useState(service.renewalDate ? service.renewalDate.split("T")[0] : "");
    const [lastPaymentDate, setLastPaymentDate] = useState(service.lastPaymentDate ? service.lastPaymentDate.split("T")[0] : "");

    // Track if billing has changes
    const [billingHasChanges, setBillingHasChanges] = useState(false);
    const [generalHasChanges, setGeneralHasChanges] = useState(false);

    useEffect(() => {
        const hasChanges = 
            plan !== (service.plan || "") ||
            costAmount !== service.costAmount.toString() ||
            costFrequency !== service.costFrequency ||
            renewalDate !== (service.renewalDate ? service.renewalDate.split("T")[0] : "") ||
            lastPaymentDate !== (service.lastPaymentDate ? service.lastPaymentDate.split("T")[0] : "");
        setBillingHasChanges(hasChanges);
    }, [plan, costAmount, costFrequency, renewalDate, lastPaymentDate, service]);

    useEffect(() => {
        const hasChanges = name !== service.name || notes !== (service.notes || "");
        setGeneralHasChanges(hasChanges);
    }, [name, notes, service]);

    const handleSaveGeneral = async () => {
        if (!onUpdateService) return;
        await onUpdateService({ name, notes: notes || undefined });
    };

    const handleSaveBilling = async () => {
        if (!onUpdateService) return;
        await onUpdateService({
            plan: plan || undefined,
            costAmount: parseFloat(costAmount) || 0,
            costFrequency,
            renewalDate: renewalDate || undefined,
            lastPaymentDate: lastPaymentDate || undefined,
        });
    };
    return (
        <>
            {/* General Settings */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">General Settings</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-small font-medium text-t-secondary mb-2">
                            Service Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>
                    <div>
                        <label className="block text-small font-medium text-t-secondary mb-2">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this service..."
                            rows={3}
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>
                    <div>
                        <Button 
                            isPrimary 
                            onClick={handleSaveGeneral}
                            disabled={!generalHasChanges || isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Billing & Cost */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Icon className="!w-4 !h-4 fill-green-500" name="chart" />
                    </div>
                    <h3 className="text-body-bold">Billing & Cost</h3>
                </div>
                <div className="space-y-6">
                    {/* Plan */}
                    <div>
                        <label className="block text-small font-medium text-t-secondary mb-2">
                            Plan
                        </label>
                        <input
                            type="text"
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            placeholder="e.g., Pro, Enterprise, Hobby"
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>

                    {/* Cost Amount & Frequency */}
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                            <label className="block text-small font-medium text-t-secondary mb-2">
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
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-small font-medium text-t-secondary mb-2">
                                Billing Cycle
                            </label>
                            <select
                                value={costFrequency}
                                onChange={(e) => setCostFrequency(e.target.value as CostFrequency)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20 appearance-none cursor-pointer"
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
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                            <label className="block text-small font-medium text-t-secondary mb-2">
                                Next Renewal
                            </label>
                            <input
                                type="date"
                                value={renewalDate}
                                onChange={(e) => setRenewalDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                        <div>
                            <label className="block text-small font-medium text-t-secondary mb-2">
                                Last Payment
                            </label>
                            <input
                                type="date"
                                value={lastPaymentDate}
                                onChange={(e) => setLastPaymentDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-t-tertiary max-w-md">
                        Set the renewal date to get notified before your next billing cycle. This helps you track spending across all your services.
                    </p>

                    <div>
                        <Button 
                            isPrimary 
                            onClick={handleSaveBilling}
                            disabled={!billingHasChanges || isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Billing Info"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">Notifications</h3>
                <div className="space-y-4">
                    {notificationSettings.map((setting, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-stroke-subtle last:border-0">
                            <div>
                                <div className="text-small font-medium text-t-primary">{setting.label}</div>
                                <div className="text-xs text-t-tertiary">{setting.desc}</div>
                            </div>
                            <button
                                className={`relative w-11 h-6 rounded-full transition-colors ${
                                    setting.enabled ? "bg-primary1" : "bg-b-surface1"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        setting.enabled ? "left-6" : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-4xl bg-b-surface2 border-2 border-red-500/20">
                <h3 className="text-body-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-small text-t-secondary mb-4">
                    These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex gap-3">
                    <Button 
                        isStroke 
                        className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10"
                        onClick={onDeleteClick}
                    >
                        <Icon className="mr-2 !w-4 !h-4 fill-red-500" name="close" />
                        Remove Service
                    </Button>
                </div>
            </div>
        </>
    );
};

export default SettingsTab;
