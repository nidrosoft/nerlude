"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Credential } from "./types";

interface CredentialsTabProps {
    credentials: Credential[];
    visibleSecrets: string[];
    onToggleVisibility: (id: string) => void;
    onCopy: (value: string, label: string) => void;
}

const CredentialsTab = ({
    credentials,
    visibleSecrets,
    onToggleVisibility,
    onCopy,
}: CredentialsTabProps) => {
    return (
        <div className="p-6 rounded-4xl bg-b-surface2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-body-bold">API Credentials</h3>
                    <p className="text-small text-t-secondary mt-1">
                        Manage your API keys and secrets for this service
                    </p>
                </div>
                <Button isSecondary>
                    <Icon className="mr-2 !w-4 !h-4" name="plus" />
                    Add Credential
                </Button>
            </div>

            {/* Environment Filter */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-small text-t-secondary">Environment:</span>
                <div className="flex gap-1 p-1 rounded-xl bg-b-surface1">
                    {["production", "staging", "development"].map((env) => (
                        <button
                            key={env}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize bg-b-surface2 text-t-primary"
                        >
                            {env}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {credentials.map((cred) => (
                    <div
                        key={cred.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1"
                    >
                        <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-small font-medium text-t-primary">{cred.label}</span>
                                {cred.isSecret && (
                                    <span className="px-1.5 py-0.5 text-xs rounded bg-amber-500/10 text-amber-600">
                                        Secret
                                    </span>
                                )}
                                <span className="px-1.5 py-0.5 text-xs rounded bg-b-surface2 text-t-tertiary capitalize">
                                    {cred.environment}
                                </span>
                            </div>
                            <code className="text-xs text-t-secondary font-mono">
                                {cred.isSecret && !visibleSecrets.includes(cred.id)
                                    ? "•".repeat(24)
                                    : cred.value
                                }
                            </code>
                        </div>
                        <div className="flex items-center gap-2">
                            {cred.isSecret && (
                                <button
                                    onClick={() => onToggleVisibility(cred.id)}
                                    className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface2 fill-t-tertiary hover:fill-t-primary transition-colors"
                                    title={visibleSecrets.includes(cred.id) ? "Hide" : "Show"}
                                >
                                    <Icon className="!w-4 !h-4" name={visibleSecrets.includes(cred.id) ? "eye-slash" : "eye"} />
                                </button>
                            )}
                            <button
                                onClick={() => onCopy(cred.value, cred.label)}
                                className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface2 fill-t-tertiary hover:fill-t-primary transition-colors"
                                title="Copy"
                            >
                                <Icon className="!w-4 !h-4" name="copy" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CredentialsTab;
