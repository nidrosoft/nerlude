"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useWorkspaceStore } from "@/stores";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

const workspaceTypes = [
    {
        id: "personal",
        title: "Personal",
        description: "For individual projects and side hustles",
        icon: "profile",
        color: "blue",
    },
    {
        id: "startup",
        title: "Startup",
        description: "For early-stage companies and small teams",
        icon: "lightning",
        color: "purple",
    },
    {
        id: "agency",
        title: "Agency",
        description: "For agencies managing multiple client projects",
        icon: "briefcase",
        color: "green",
    },
    {
        id: "enterprise",
        title: "Enterprise",
        description: "For large organizations with complex needs",
        icon: "building",
        color: "amber",
    },
];

const NewWorkspacePage = () => {
    const router = useRouter();
    const toast = useToast();
    const { addWorkspace, setCurrentWorkspace, workspaces } = useWorkspaceStore();
    const { plan, isLoading: isLoadingSubscription, isDemoAccount } = useSubscription();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceType, setWorkspaceType] = useState<string | null>(null);
    const [workspaceUrl, setWorkspaceUrl] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Check workspace limit on mount
    useEffect(() => {
        if (!isLoadingSubscription && !isDemoAccount) {
            const currentWorkspaceCount = workspaces?.length || 0;
            const maxWorkspaces = plan.maxWorkspaces;
            if (maxWorkspaces !== -1 && currentWorkspaceCount >= maxWorkspaces) {
                setShowUpgradeModal(true);
            }
        }
    }, [isLoadingSubscription, isDemoAccount, workspaces, plan.maxWorkspaces]);

    const handleNameChange = (value: string) => {
        setWorkspaceName(value);
        // Auto-generate URL slug
        setWorkspaceUrl(value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
    };

    const handleContinue = () => {
        if (step === 1 && workspaceName) {
            setStep(2);
        } else if (step === 2 && workspaceType) {
            setStep(3);
        } else if (step === 3) {
            handleCreateWorkspace();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as 1 | 2);
        }
    };

    const handleCreateWorkspace = async () => {
        setIsCreating(true);
        try {
            const response = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: workspaceName,
                    workspace_type: workspaceType,
                }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create workspace');
            }
            
            const workspace = await response.json();
            
            // Add to store and set as current
            addWorkspace({
                id: workspace.id,
                name: workspace.name,
                slug: workspace.slug,
                ownerId: workspace.owner_id,
                workspaceType: workspace.workspace_type,
                createdAt: workspace.created_at,
                updatedAt: workspace.updated_at,
            });
            setCurrentWorkspace({
                id: workspace.id,
                name: workspace.name,
                slug: workspace.slug,
                ownerId: workspace.owner_id,
                workspaceType: workspace.workspace_type,
                createdAt: workspace.created_at,
                updatedAt: workspace.updated_at,
            });
            
            toast.success("Workspace created!", `Welcome to ${workspaceName}`);
            router.push("/dashboard");
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to create workspace");
        } finally {
            setIsCreating(false);
        }
    };

    const canContinue = () => {
        if (step === 1) return workspaceName.length >= 2;
        if (step === 2) return workspaceType !== null;
        return true;
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="w-full max-w-xl mx-4">
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all ${
                                    s === step ? "w-8 bg-primary1" : s < step ? "w-8 bg-primary1/50" : "w-8 bg-b-surface2"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Name */}
                    {step === 1 && (
                        <div className="text-center">
                            <div className="flex items-center justify-center size-20 mx-auto mb-6 rounded-3xl bg-primary1/10 text-primary1">
                                <Icon className="!w-10 !h-10" name="cube" />
                            </div>
                            <h1 className="text-h2 mb-2">Name your workspace</h1>
                            <p className="text-body text-t-secondary mb-8">
                                This is where you'll manage all your projects and services.
                            </p>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={workspaceName}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Acme Corp, My Projects"
                                    className="w-full px-6 py-4 rounded-2xl bg-b-surface2 text-h4 text-center text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                    autoFocus
                                />
                            </div>

                            {workspaceUrl && (
                                <p className="text-small text-t-tertiary mb-8">
                                    Your workspace URL: <span className="text-t-secondary">nelrude.com/{workspaceUrl}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Type */}
                    {step === 2 && (
                        <div className="text-center">
                            <h1 className="text-h2 mb-2">What type of workspace?</h1>
                            <p className="text-body text-t-secondary mb-8">
                                This helps us customize your experience.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8 max-md:grid-cols-1">
                                {workspaceTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setWorkspaceType(type.id)}
                                        className={`p-5 rounded-2xl text-left transition-all ${
                                            workspaceType === type.id
                                                ? "bg-primary1/10 border-2 border-primary1"
                                                : "bg-b-surface2 border-2 border-transparent hover:border-stroke-subtle"
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center size-12 mb-3 rounded-xl ${
                                            type.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                                            type.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                                            type.color === "green" ? "bg-green-500/10 text-green-500" :
                                            "bg-amber-500/10 text-amber-500"
                                        }`}>
                                            <Icon className="!w-6 !h-6" name={type.icon} />
                                        </div>
                                        <h3 className="text-body-bold mb-1">{type.title}</h3>
                                        <p className="text-small text-t-secondary">{type.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <div className="text-center">
                            <div className="flex items-center justify-center size-20 mx-auto mb-6 rounded-3xl bg-green-500/10 text-green-500">
                                <Icon className="!w-10 !h-10" name="check" />
                            </div>
                            <h1 className="text-h2 mb-2">You're all set!</h1>
                            <p className="text-body text-t-secondary mb-8">
                                Your workspace is ready to go. Let's get started.
                            </p>

                            <div className="p-6 rounded-3xl bg-b-surface2 mb-8 text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center justify-center size-14 rounded-2xl bg-primary1/10 text-primary1">
                                        <Icon className="!w-7 !h-7" name="cube" />
                                    </div>
                                    <div>
                                        <h3 className="text-h4">{workspaceName}</h3>
                                        <p className="text-small text-t-secondary capitalize">
                                            {workspaceTypes.find((t) => t.id === workspaceType)?.title} workspace
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-small">
                                    <div className="flex justify-between py-2 border-t border-stroke-subtle">
                                        <span className="text-t-secondary">URL</span>
                                        <span className="text-t-primary">nelrude.com/{workspaceUrl}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-t border-stroke-subtle">
                                        <span className="text-t-secondary">Plan</span>
                                        <span className="text-t-primary">Free (upgrade anytime)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button isStroke className="flex-1" onClick={handleBack}>
                                <Icon className="mr-2 !w-4 !h-4 rotate-90" name="chevron" />
                                Back
                            </Button>
                        )}
                        <Button
                            isPrimary
                            className="flex-1"
                            onClick={handleContinue}
                            disabled={!canContinue() || isCreating}
                        >
                            {step === 3 ? (
                                isCreating ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Create Workspace
                                        <Icon className="ml-2 !w-4 !h-4" name="arrow-right" />
                                    </>
                                )
                            ) : (
                                <>
                                    Continue
                                    <Icon className="ml-2 !w-4 !h-4 -rotate-90" name="chevron" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Skip */}
                    {step < 3 && (
                        <button
                            onClick={() => router.push("/")}
                            className="w-full mt-4 text-center text-small text-t-tertiary hover:text-t-secondary transition-colors"
                        >
                            Skip for now
                        </button>
                    )}
                </div>
            </div>
            
            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => {
                    setShowUpgradeModal(false);
                    router.push("/dashboard");
                }}
                title="Workspace Limit Reached"
                message={`You've reached your workspace limit of ${plan.maxWorkspaces}. Upgrade to create more workspaces.`}
                suggestedPlan={plan.id === "free" ? "Pro" : "Team"}
                limitType="projects"
            />
        </Layout>
    );
};

export default NewWorkspacePage;
