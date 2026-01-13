"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ProjectType, UploadedDocument, ExtractedProject } from "@/types";
import { useToast } from "@/components/Toast";
import { useWorkspaceStore } from "@/stores";
import MethodSelector, { ImportMethod } from "./MethodSelector";
import DocumentUpload from "./DocumentUpload";
import ProcessingScreen from "./ProcessingScreen";
import ReviewProjects from "./ReviewProjects";
import ConfirmCreate from "./ConfirmCreate";
import SuccessScreen from "./SuccessScreen";
import EmailSync from "./EmailSync";
import { extractProjectsFromDocuments, ExtractionResult } from "./utils/aiExtraction";
import { ExtractedEmailService } from "./utils/emailSync";
import { Step, FlowType, ProjectTemplate } from "./types";
import ProgressSteps from "./ProgressSteps";
import BasicsStep from "./BasicsStep";
import TemplateStep from "./TemplateStep";
import ServicesStep from "./ServicesStep";
import ConfirmStep from "./ConfirmStep";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

const NewProjectPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { currentWorkspace } = useWorkspaceStore();
    const { canCreateProject, hasFeature, getUpgradeMessage, isLoading: isLoadingSubscription } = useSubscription();
    const [currentStep, setCurrentStep] = useState<Step>("method");
    const [flowType, setFlowType] = useState<FlowType | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeModalConfig, setUpgradeModalConfig] = useState<{ title: string; message: string; suggestedPlan: string; limitType: "projects" | "team" | "services" | "credentials" | "storage" | "integrations" | "feature" }>({ title: "", message: "", suggestedPlan: "Pro", limitType: "projects" });
    
    // Check project limit on mount
    useEffect(() => {
        if (!isLoadingSubscription) {
            const projectCheck = canCreateProject();
            if (!projectCheck.allowed) {
                const upgradeMsg = getUpgradeMessage("projects");
                setUpgradeModalConfig({
                    title: upgradeMsg.title,
                    message: upgradeMsg.message,
                    suggestedPlan: upgradeMsg.suggestedPlan,
                    limitType: "projects",
                });
                setShowUpgradeModal(true);
            }
        }
    }, [isLoadingSubscription, canCreateProject, getUpgradeMessage]);
    
    // Manual flow state
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState<ProjectType>("web");
    const [projectIcon, setProjectIcon] = useState("🚀");
    const [customIconImage, setCustomIconImage] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [customTypeName, setCustomTypeName] = useState("");
    const [showCustomType, setShowCustomType] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Document upload flow state
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
    const [extractedProjects, setExtractedProjects] = useState<ExtractedProject[]>([]);

    const hasUnsavedChanges = projectName.trim() !== "" || selectedTemplate !== null || selectedServices.length > 0 || uploadedDocuments.length > 0;

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowCancelModal(true);
        } else {
            router.push("/dashboard");
        }
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        router.push("/dashboard");
    };

    const handleTemplateSelect = (template: ProjectTemplate) => {
        console.log('=== TEMPLATE SELECTED ===');
        console.log('Template:', template.name);
        console.log('Suggested services:', template.suggestedServices);
        setSelectedTemplate(template);
        setSelectedServices(template.suggestedServices);
        setProjectType(template.type);
    };

    const toggleService = (serviceId: string) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((s) => s !== serviceId)
                : [...prev, serviceId]
        );
    };

    // Method selection handler
    const handleMethodSelect = (method: ImportMethod) => {
        if (method === 'documents') {
            // Check if user has AI Document Import feature (Pro+ only)
            const aiImportCheck = hasFeature("hasAiDocumentImport");
            if (!aiImportCheck.allowed) {
                const upgradeMsg = getUpgradeMessage("feature", "AI Document Import");
                setUpgradeModalConfig({
                    title: "AI Document Import - Pro Plan",
                    message: "AI-powered document import is available on Pro and Team plans. Upgrade to automatically extract services from receipts and invoices.",
                    suggestedPlan: upgradeMsg.suggestedPlan,
                    limitType: "feature",
                });
                setShowUpgradeModal(true);
                return;
            }
            setFlowType('documents');
            setCurrentStep('upload');
        } else if (method === 'email') {
            setFlowType('email');
            setCurrentStep('email-sync');
        } else if (method === 'manual') {
            setFlowType('manual');
            setCurrentStep('basics');
        }
    };

    // Email sync handlers
    const handleEmailServicesExtracted = useCallback((services: ExtractedEmailService[]) => {
        // Convert email services to ExtractedProject format
        if (services.length === 0) {
            toast.warning(
                "No Services Found",
                "We couldn't detect any services in your emails. Try a longer date range or upload documents instead."
            );
            setCurrentStep('email-sync');
            return;
        }

        // Helper to convert numeric confidence to ConfidenceLevel
        const toConfidenceLevel = (conf: number): 'high' | 'medium' | 'low' => {
            if (conf >= 0.8) return 'high';
            if (conf >= 0.5) return 'medium';
            return 'low';
        };

        // Calculate total monthly cost
        const totalMonthlyCost = services.reduce((sum, service) => {
            const amount = service.amount || 0;
            if (service.billingCycle === 'yearly') return sum + (amount / 12);
            return sum + amount;
        }, 0);

        // Group services into a single project
        const extractedProject: ExtractedProject = {
            id: `email-import-${Date.now()}`,
            name: { value: 'Email Import', confidence: 'high', source: 'email' },
            type: { value: 'web', confidence: 'medium', source: 'email' },
            icon: '📧',
            isConfirmed: true,
            documents: [], // No documents for email import
            totalMonthlyCost,
            services: services.map((service, index) => ({
                id: `email-service-${index}`,
                name: { value: service.name, confidence: toConfidenceLevel(service.confidence), source: 'email' },
                category: { value: 'infrastructure', confidence: 'medium' as const, source: 'email' },
                costAmount: { value: service.amount, confidence: toConfidenceLevel(service.confidence), source: 'email' },
                currency: { value: service.currency === 'USD' ? '$' : service.currency, confidence: 'high' as const, source: 'email' },
                costFrequency: { value: service.billingCycle as 'monthly' | 'yearly' | 'one-time', confidence: 'medium' as const, source: 'email' },
                renewalDate: service.billingDate ? { value: service.billingDate, confidence: 'medium' as const, source: 'email' } : undefined,
            })),
        };

        setExtractedProjects([extractedProject]);
        setCurrentStep('review');
    }, [toast]);

    // Document upload flow handlers
    const handleDocumentsChange = useCallback((docs: UploadedDocument[]) => {
        setUploadedDocuments(docs);
    }, []);

    const handleStartProcessing = () => {
        setCurrentStep('processing');
    };

    const handleProcessingComplete = useCallback(async () => {
        const result = await extractProjectsFromDocuments(uploadedDocuments, currentWorkspace?.id);
        
        if (!result.success) {
            // Show error to user instead of falling back to mock data
            const errorMessage = result.error?.message || 'Failed to analyze documents';
            const errorDetails = result.error?.details;
            
            console.error('Document analysis failed:', result.error);
            
            // Show toast with error
            toast.error(
                "Analysis Failed", 
                errorMessage + (errorDetails ? `\n\nDetails: ${errorDetails}` : '')
            );
            
            // Go back to upload step so user can retry
            setCurrentStep('upload');
            return;
        }
        
        if (result.projects.length === 0) {
            toast.warning(
                "No Services Found",
                "We couldn't detect any services in your documents. Try uploading clearer images or different documents."
            );
            setCurrentStep('upload');
            return;
        }
        
        setExtractedProjects(result.projects);
        setCurrentStep('review');
    }, [uploadedDocuments, currentWorkspace?.id, toast]);

    const handleProjectsChange = useCallback((projects: ExtractedProject[]) => {
        setExtractedProjects(projects);
    }, []);

    const handleConfirmImport = () => {
        setCurrentStep('confirm-import');
    };

    const handleCreateImportedProjects = async () => {
        if (!currentWorkspace) {
            toast.error("Error", "No workspace selected. Please select a workspace first.");
            return;
        }

        const confirmedProjects = extractedProjects.filter(p => p.isConfirmed);
        if (confirmedProjects.length === 0) {
            toast.error("Error", "Please confirm at least one project to import.");
            return;
        }

        setIsCreating(true);

        try {
            // Create each project and its services
            for (const project of confirmedProjects) {
                // First create the project
                const projectResponse = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: project.name.value,
                        type: project.type.value,
                        icon: project.icon,
                        workspace_id: currentWorkspace.id,
                        description: `Imported from documents on ${new Date().toLocaleDateString()}`,
                        services: [], // We'll add services via bulk API
                    }),
                });

                if (!projectResponse.ok) {
                    const error = await projectResponse.json();
                    throw new Error(error.error || `Failed to create project: ${project.name.value}`);
                }

                const createdProject = await projectResponse.json();

                // Then bulk add services to the project
                if (project.services.length > 0) {
                    const servicesPayload = project.services.map(service => ({
                        registryId: null, // Could be enhanced to match registry
                        name: service.name.value,
                        categoryId: service.category.value,
                        billing: {
                            amount: service.costAmount.value,
                            currency: service.currency.value === '$' ? 'USD' : service.currency.value,
                            frequency: service.costFrequency.value,
                        },
                        renewalDate: service.renewalDate?.value || null,
                        planName: service.plan?.value || null,
                    }));

                    const servicesResponse = await fetch(`/api/projects/${createdProject.id}/services/bulk`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ services: servicesPayload }),
                    });

                    if (!servicesResponse.ok) {
                        console.error('Failed to add services to project:', await servicesResponse.json());
                        // Continue anyway - project was created
                    }
                }
            }

            toast.success("Projects imported", `${confirmedProjects.length} project(s) have been created successfully.`);
            setCurrentStep('success');
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to import projects");
        } finally {
            setIsCreating(false);
        }
    };

    const handleAddMoreDocuments = () => {
        setCurrentStep('upload');
    };

    const handleCreateAnother = () => {
        setUploadedDocuments([]);
        setExtractedProjects([]);
        setFlowType(null);
        setCurrentStep('method');
    };

    const handleBack = () => {
        if (currentStep === "method") {
            router.push("/dashboard");
        } else if (currentStep === "template") {
            setCurrentStep("basics");
        } else if (currentStep === "services") {
            setCurrentStep("template");
        } else if (currentStep === "confirm") {
            setCurrentStep("services");
        } else if (currentStep === "basics" && flowType === "manual") {
            setCurrentStep("method");
            setFlowType(null);
        } else if (currentStep === "upload") {
            setCurrentStep("method");
            setFlowType(null);
        } else if (currentStep === "email-sync") {
            setCurrentStep("method");
            setFlowType(null);
        } else if (currentStep === "review") {
            setCurrentStep("upload");
        } else if (currentStep === "confirm-import") {
            setCurrentStep("review");
        }
    };

    const handleContinue = () => {
        console.log('=== CONTINUE CLICKED ===');
        console.log('Current step:', currentStep);
        console.log('Selected services at continue:', selectedServices);
        
        if (currentStep === "basics") {
            if (!projectName.trim()) return;
            setCurrentStep("template");
        } else if (currentStep === "template") {
            setCurrentStep("services");
        } else if (currentStep === "services") {
            setCurrentStep("confirm");
        }
    };

    const handleCreateProject = async () => {
        if (!currentWorkspace) {
            toast.error("Error", "No workspace selected. Please select a workspace first.");
            return;
        }
        
        setIsCreating(true);
        
        const requestBody = {
            name: projectName,
            type: showCustomType ? 'custom' : projectType,
            icon: projectIcon,
            workspace_id: currentWorkspace.id,
            description: selectedTemplate?.description || '',
            services: selectedServices,
            template_id: selectedTemplate?.id || null,
        };
        
        console.log('=== FRONTEND: Creating project ===');
        console.log('Selected services state:', selectedServices);
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create project');
            }
            
            const project = await response.json();
            toast.success("Project created", `${projectName} has been created successfully.`);
            router.push(`/projects/${project.id}`);
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to create project");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            <div className="min-h-[calc(100vh-80px)] py-8 pt-28">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border-[1.5px] border-violet-500/30">
                            <Icon className="!w-6 !h-6 fill-violet-500" name="plus" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-h3">New Project</h1>
                            <p className="text-small text-t-secondary">
                                Create a new project to track your services
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="flex items-center justify-center size-12 rounded-full bg-b-surface2 border border-stroke-subtle hover:border-stroke-primary hover:shadow-hover transition-all fill-t-secondary hover:fill-t-primary"
                        >
                            <Icon className="!w-5 !h-5" name="close" />
                        </button>
                    </div>

                    {/* Cancel Confirmation Modal */}
                    {showCancelModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div 
                                className="absolute inset-0 bg-[#282828]/90"
                                onClick={() => setShowCancelModal(false)}
                            />
                            <div className="relative z-10 w-full max-w-md p-8 rounded-4xl bg-b-surface1">
                                <h3 className="text-h4 mb-2">Discard changes?</h3>
                                <p className="text-small text-t-secondary mb-6">
                                    You have unsaved changes. Your progress will be saved as a draft so you can continue later.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1"
                                        isStroke
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        Keep Editing
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        isPrimary
                                        onClick={handleConfirmCancel}
                                    >
                                        Discard & Exit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Steps */}
                    {flowType && currentStep !== "success" && (
                        <ProgressSteps currentStep={currentStep} flowType={flowType} />
                    )}

                    {/* Step Content */}
                    <div className={`p-6 rounded-4xl ${currentStep === "processing" || currentStep === "success" ? "" : "bg-b-surface2 border border-stroke-subtle"}`}>
                        {/* Method Selection */}
                        {currentStep === "method" && (
                            <MethodSelector onSelect={handleMethodSelect} />
                        )}

                        {/* Document Upload Flow */}
                        {currentStep === "upload" && (
                            <DocumentUpload
                                documents={uploadedDocuments}
                                onDocumentsChange={handleDocumentsChange}
                                onContinue={handleStartProcessing}
                                onBack={handleBack}
                            />
                        )}

                        {currentStep === "processing" && (
                            <ProcessingScreen
                                documents={uploadedDocuments}
                                onComplete={handleProcessingComplete}
                            />
                        )}

                        {/* Email Sync Flow */}
                        {currentStep === "email-sync" && (
                            <EmailSync
                                onServicesExtracted={handleEmailServicesExtracted}
                                onBack={handleBack}
                            />
                        )}

                        {currentStep === "review" && (
                            <ReviewProjects
                                projects={extractedProjects}
                                onProjectsChange={handleProjectsChange}
                                onContinue={handleConfirmImport}
                                onBack={handleBack}
                                onAddMore={handleAddMoreDocuments}
                            />
                        )}

                        {currentStep === "confirm-import" && (
                            <ConfirmCreate
                                projects={extractedProjects}
                                onConfirm={handleCreateImportedProjects}
                                onBack={handleBack}
                            />
                        )}

                        {currentStep === "success" && (
                            <SuccessScreen
                                projects={extractedProjects.filter(p => p.isConfirmed)}
                                onViewDashboard={() => router.push("/dashboard")}
                                onCreateAnother={handleCreateAnother}
                            />
                        )}

                        {/* Manual Flow Steps */}
                        {currentStep === "basics" && (
                            <BasicsStep
                                projectName={projectName}
                                setProjectName={setProjectName}
                                projectType={projectType}
                                setProjectType={setProjectType}
                                projectIcon={projectIcon}
                                setProjectIcon={setProjectIcon}
                                customIconImage={customIconImage}
                                setCustomIconImage={setCustomIconImage}
                                customTypeName={customTypeName}
                                setCustomTypeName={setCustomTypeName}
                                showCustomType={showCustomType}
                                setShowCustomType={setShowCustomType}
                                onContinue={handleContinue}
                            />
                        )}

                        {currentStep === "template" && (
                            <TemplateStep
                                selectedTemplate={selectedTemplate}
                                onTemplateSelect={handleTemplateSelect}
                                onBack={handleBack}
                                onContinue={handleContinue}
                            />
                        )}

                        {currentStep === "services" && (
                            <ServicesStep
                                selectedServices={selectedServices}
                                onToggleService={toggleService}
                                onBack={handleBack}
                                onContinue={handleContinue}
                            />
                        )}

                        {currentStep === "confirm" && (
                            <ConfirmStep
                                projectName={projectName}
                                projectType={projectType}
                                projectIcon={projectIcon}
                                showCustomType={showCustomType}
                                customTypeName={customTypeName}
                                selectedTemplate={selectedTemplate}
                                selectedServices={selectedServices}
                                onBack={handleBack}
                                onCreateProject={handleCreateProject}
                                isCreating={isCreating}
                            />
                        )}
                    </div>
                </div>
            </div>
            
            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => {
                    setShowUpgradeModal(false);
                    router.push("/dashboard");
                }}
                title={upgradeModalConfig.title}
                message={upgradeModalConfig.message}
                suggestedPlan={upgradeModalConfig.suggestedPlan}
                limitType={upgradeModalConfig.limitType}
            />
        </Layout>
    );
};

export default NewProjectPage;
