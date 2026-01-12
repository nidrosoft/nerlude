"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Credential } from "./types";
import AddCredentialModal from "./AddCredentialModal";
import CredentialDetailModal from "./CredentialDetailModal";
import { CredentialTypeId, getCredentialType } from "./credentialTypes";
import { CredentialKeyIcon, credentialIconMap } from "./CredentialIcons";

type Environment = "production" | "staging" | "development";

interface CredentialsTabProps {
    credentials: Credential[];
    visibleSecrets: string[];
    onToggleVisibility: (id: string) => void;
    onCopy: (value: string, label: string) => void;
    onAddCredential?: (data: {
        type: CredentialTypeId;
        environment: Environment;
        fields: Record<string, string>;
        description?: string;
    }) => Promise<void>;
}

const CredentialsTab = ({
    credentials,
    visibleSecrets,
    onToggleVisibility,
    onCopy,
    onAddCredential,
}: CredentialsTabProps) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeEnvironment, setActiveEnvironment] = useState<Environment | "all">("all");

    const environments: (Environment | "all")[] = ["all", "production", "staging", "development"];

    const filteredCredentials = activeEnvironment === "all" 
        ? credentials 
        : credentials.filter(c => c.environment === activeEnvironment);

    const handleSaveCredential = async (data: {
        type: CredentialTypeId;
        environment: Environment;
        fields: Record<string, string>;
        description?: string;
    }) => {
        if (!onAddCredential) return;
        
        setIsSaving(true);
        try {
            await onAddCredential(data);
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to save credential:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewCredential = (cred: Credential) => {
        setSelectedCredential(cred);
        setShowDetailModal(true);
    };

    const getCredentialDisplayName = (cred: Credential): string => {
        return cred.label;
    };

    const getCredentialIconComponent = (cred: Credential) => {
        if (cred.credentialType && credentialIconMap[cred.credentialType]) {
            return credentialIconMap[cred.credentialType];
        }
        return CredentialKeyIcon;
    };

    const getCredentialTypeColor = (cred: Credential) => {
        if (cred.credentialType) {
            const typeDef = getCredentialType(cred.credentialType as CredentialTypeId);
            if (typeDef) {
                return {
                    bg: typeDef.bgColor,
                    border: typeDef.borderColor,
                    text: typeDef.iconColor.replace('fill-', 'text-'),
                };
            }
        }
        return {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-500',
        };
    };

    const getEmptyStateMessage = () => {
        if (activeEnvironment === "all") {
            return {
                title: "No credentials yet",
                description: "Click \"Add Credential\" above to securely store API keys, passwords, and secrets."
            };
        }
        if (activeEnvironment === "production") {
            return {
                title: "No production credentials",
                description: "Click \"Add Credential\" above to add credentials for your production environment."
            };
        }
        if (activeEnvironment === "staging") {
            return {
                title: "No staging credentials",
                description: "Click \"Add Credential\" above to add credentials for your staging environment."
            };
        }
        return {
            title: "No development credentials",
            description: "Click \"Add Credential\" above to add credentials for your development environment."
        };
    };

    return (
        <>
            <div className="p-6 rounded-4xl bg-b-surface2">
                {/* Header with Environment Filter and Add Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-small text-t-secondary">Environment:</span>
                        <div className="flex gap-1 p-1 rounded-xl bg-b-surface1">
                            {environments.map((env) => (
                                <button
                                    key={env}
                                    onClick={() => setActiveEnvironment(env)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                                        activeEnvironment === env
                                            ? "bg-b-surface2 text-t-primary"
                                            : "text-t-tertiary hover:text-t-secondary"
                                    }`}
                                >
                                    {env === "all" ? "All" : env}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button isStroke onClick={() => setShowAddModal(true)}>
                        <Icon className="mr-2 !w-4 !h-4" name="plus" />
                        Add Credential
                    </Button>
                </div>

                {/* Credentials List */}
                {filteredCredentials.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="flex items-center justify-center size-16 rounded-2xl border-[1.5px] border-blue-500/20 bg-blue-500/10 mx-auto mb-4">
                            <CredentialKeyIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h4 className="text-body-bold text-t-secondary mb-2">{getEmptyStateMessage().title}</h4>
                        <p className="text-small text-t-tertiary">
                            {getEmptyStateMessage().description}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredCredentials.map((cred) => {
                            const IconComponent = getCredentialIconComponent(cred);
                            const colors = getCredentialTypeColor(cred);
                            const typeDef = cred.credentialType 
                                ? getCredentialType(cred.credentialType as CredentialTypeId)
                                : null;
                            
                            return (
                            <div
                                key={cred.id}
                                className="p-4 rounded-2xl bg-b-surface1 hover:shadow-sm transition-shadow border border-transparent hover:border-stroke-subtle"
                            >
                                {/* Header: Type label and environment */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${colors.bg} ${colors.text} capitalize`}>
                                            {typeDef?.label || cred.credentialType || "Credential"}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs rounded-lg bg-b-surface2 text-t-tertiary capitalize">
                                            {cred.environment}
                                        </span>
                                        {cred.isSecret && (
                                            <span className="px-2 py-0.5 text-xs rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                Secret
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleViewCredential(cred)}
                                        className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface2 fill-t-tertiary hover:fill-t-primary transition-colors"
                                        title="View Details"
                                    >
                                        <Icon className="!w-4 !h-4" name="eye" />
                                    </button>
                                </div>

                                {/* Description if available */}
                                {cred.description && (
                                    <p className="text-xs text-t-tertiary mb-3 line-clamp-2">
                                        {cred.description}
                                    </p>
                                )}

                                {/* Main content: Icon and credential info */}
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center size-10 rounded-xl border-[1.5px] ${colors.border} ${colors.bg} shrink-0`}>
                                        <IconComponent className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-small font-medium text-t-primary block truncate mb-0.5">
                                            {getCredentialDisplayName(cred)}
                                        </span>
                                        <code className="text-xs text-t-secondary font-mono block truncate">
                                            {"•".repeat(24)}
                                        </code>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Credential Modal */}
            <AddCredentialModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleSaveCredential}
                isSaving={isSaving}
            />

            {/* Credential Detail Modal */}
            {selectedCredential && (
                <CredentialDetailModal
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedCredential(null);
                    }}
                    credential={selectedCredential}
                    onCopy={onCopy}
                />
            )}
        </>
    );
};

export default CredentialsTab;
