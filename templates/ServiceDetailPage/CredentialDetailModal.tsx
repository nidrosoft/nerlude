"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Credential } from "./types";
import { CredentialTypeId, getCredentialType } from "./credentialTypes";
import { credentialIconMap, CredentialKeyIcon } from "./CredentialIcons";

interface CredentialDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    credential: Credential;
    onCopy: (value: string, label: string) => void;
}

const maskValue = (value: string, showFirst: number = 1): string => {
    if (!value || value.length <= showFirst) return "•".repeat(8);
    return value.substring(0, showFirst) + "•".repeat(Math.min(value.length - showFirst, 20));
};

const CredentialDetailModal = ({
    isOpen,
    onClose,
    credential,
    onCopy,
}: CredentialDetailModalProps) => {
    const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());

    const toggleFieldVisibility = (fieldKey: string) => {
        setRevealedFields(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fieldKey)) {
                newSet.delete(fieldKey);
            } else {
                newSet.add(fieldKey);
            }
            return newSet;
        });
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const typeDef = credential.credentialType 
        ? getCredentialType(credential.credentialType as CredentialTypeId)
        : null;
    
    const IconComponent = credential.credentialType && credentialIconMap[credential.credentialType]
        ? credentialIconMap[credential.credentialType]
        : CredentialKeyIcon;

    const colors = typeDef ? {
        bg: typeDef.bgColor,
        border: typeDef.borderColor,
        text: typeDef.iconColor.replace('fill-', 'text-'),
    } : {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-500',
    };

    const isSensitiveField = (fieldKey: string): boolean => {
        const sensitiveKeys = ['password', 'secret', 'token', 'key', 'api_key', 'apiKey', 'private', 'passphrase', 'private_key', 'privateKey'];
        return sensitiveKeys.some(k => fieldKey.toLowerCase().includes(k));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 bg-[#282828]/90" />
            <div className="relative z-10 w-full max-w-lg mx-4 p-6 rounded-4xl bg-b-surface1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center size-14 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg}`}>
                            <IconComponent className={`w-7 h-7 ${colors.text}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${colors.bg} ${colors.text} capitalize`}>
                                    {typeDef?.label || credential.credentialType || "Credential"}
                                </span>
                                <span className="px-2 py-0.5 text-xs rounded-lg bg-b-surface2 text-t-tertiary capitalize">
                                    {credential.environment}
                                </span>
                            </div>
                            <h3 className="text-h4">{credential.label}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-b-surface2 transition-colors fill-t-secondary hover:fill-t-primary"
                    >
                        <Icon className="!w-5 !h-5" name="close" />
                    </button>
                </div>

                {/* Description */}
                {credential.description && (
                    <div className="mb-6 p-4 rounded-2xl bg-b-surface2">
                        <p className="text-small text-t-secondary">{credential.description}</p>
                    </div>
                )}

                {/* Credential Fields */}
                <div className="space-y-4 mb-6">
                    {credential.fields && Object.entries(credential.fields).length > 0 ? (
                        Object.entries(credential.fields).map(([key, value]) => {
                            const isSensitive = isSensitiveField(key);
                            const isRevealed = revealedFields.has(key);
                            const displayValue = isSensitive && !isRevealed ? maskValue(value) : value;
                            
                            return (
                                <div key={key} className="p-4 rounded-2xl bg-b-surface2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-medium text-t-tertiary uppercase tracking-wide">
                                            {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <div className="flex items-center gap-1">
                                            {isSensitive && (
                                                <button
                                                    onClick={() => toggleFieldVisibility(key)}
                                                    className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                                                    title={isRevealed ? "Hide" : "Reveal"}
                                                >
                                                    <Icon className="!w-4 !h-4" name={isRevealed ? "eye-slash" : "eye"} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onCopy(value, key)}
                                                className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                                                title="Copy"
                                            >
                                                <Icon className="!w-4 !h-4" name="copy" />
                                            </button>
                                        </div>
                                    </div>
                                    <code className="text-small font-mono text-t-primary break-all">
                                        {displayValue}
                                    </code>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-4 rounded-2xl bg-b-surface2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-t-tertiary uppercase tracking-wide">
                                    Value
                                </label>
                                <div className="flex items-center gap-1">
                                    {credential.isSecret && (
                                        <button
                                            onClick={() => toggleFieldVisibility('value')}
                                            className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                                            title={revealedFields.has('value') ? "Hide" : "Reveal"}
                                        >
                                            <Icon className="!w-4 !h-4" name={revealedFields.has('value') ? "eye-slash" : "eye"} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onCopy(credential.value, credential.label)}
                                        className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                                        title="Copy"
                                    >
                                        <Icon className="!w-4 !h-4" name="copy" />
                                    </button>
                                </div>
                            </div>
                            <code className="text-small font-mono text-t-primary break-all">
                                {credential.isSecret && !revealedFields.has('value') 
                                    ? maskValue(credential.value) 
                                    : credential.value
                                }
                            </code>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke-subtle">
                    <div className="text-xs text-t-tertiary">
                        {credential.createdAt && (
                            <>Added {new Date(credential.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                        )}
                    </div>
                    <Button isStroke onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CredentialDetailModal;
