"use client";

import { DocumentUpload, Sms, Bank, Edit2 } from "iconsax-react";

type ImportMethod = 'documents' | 'email' | 'bank' | 'manual';

interface MethodOption {
    id: ImportMethod;
    title: string;
    description: string;
    IconComponent: React.ComponentType<{ size?: number | string; color?: string; variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone" }>;
    iconBg: string;
    iconColor: string;
    isAvailable: boolean;
    badge?: string;
}

const methods: MethodOption[] = [
    {
        id: 'documents',
        title: 'Upload Documents',
        description: 'Drop receipts, invoices, or screenshots. AI will extract and organize everything.',
        IconComponent: DocumentUpload,
        iconBg: 'bg-violet-500/10',
        iconColor: '#8B5CF6',
        isAvailable: true,
        badge: 'Recommended',
    },
    {
        id: 'email',
        title: 'Sync from Email',
        description: 'Connect your inbox to automatically import receipts and invoices.',
        IconComponent: Sms,
        iconBg: 'bg-blue-500/10',
        iconColor: '#3B82F6',
        isAvailable: true,
        badge: 'New',
    },
    {
        id: 'bank',
        title: 'Connect Bank Account',
        description: 'Link your payment method to track subscriptions automatically.',
        IconComponent: Bank,
        iconBg: 'bg-green-500/10',
        iconColor: '#22C55E',
        isAvailable: false,
        badge: 'Coming Soon',
    },
    {
        id: 'manual',
        title: 'Add Manually',
        description: 'Create a project from scratch and add services one by one.',
        IconComponent: Edit2,
        iconBg: 'bg-amber-500/10',
        iconColor: '#F59E0B',
        isAvailable: true,
    },
];

type Props = {
    onSelect: (method: ImportMethod) => void;
};

const MethodSelector = ({ onSelect }: Props) => {
    return (
        <div>
            <h2 className="text-body-bold mb-2">How would you like to add your project?</h2>
            <p className="text-small text-t-secondary mb-6">
                Choose the fastest way to get started. You can always add more details later.
            </p>

            <div className="space-y-3">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => method.isAvailable && onSelect(method.id)}
                        disabled={!method.isAvailable}
                        className={`relative flex items-start w-full p-4 rounded-3xl text-left transition-all ${
                            method.isAvailable
                                ? 'bg-b-surface1 border-2 border-transparent hover:border-stroke-highlight hover:shadow-hover cursor-pointer'
                                : 'bg-b-surface1/50 border-2 border-transparent cursor-not-allowed opacity-60'
                        }`}
                    >
                        <div className={`flex items-center justify-center size-12 mr-4 rounded-2xl ${method.iconBg}`}>
                            <method.IconComponent size={24} color={method.iconColor} variant="Bold" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-t-primary">{method.title}</span>
                                {method.badge && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        method.badge === 'Recommended'
                                            ? 'bg-violet-500/10 text-violet-500'
                                            : method.badge === 'New'
                                            ? 'bg-blue-500/10 text-blue-500'
                                            : 'bg-b-surface2 text-t-tertiary'
                                    }`}>
                                        {method.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-small text-t-secondary">{method.description}</p>
                        </div>
                        {method.isAvailable && (
                            <svg className="w-5 h-5 text-t-tertiary mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MethodSelector;
export type { ImportMethod };
