"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ProjectType, UploadedDocument, ExtractedProject } from "@/types";
import { useToast } from "@/components/Toast";
import MethodSelector, { ImportMethod } from "./MethodSelector";
import DocumentUpload from "./DocumentUpload";
import ProcessingScreen from "./ProcessingScreen";
import ReviewProjects from "./ReviewProjects";
import ConfirmCreate from "./ConfirmCreate";
import SuccessScreen from "./SuccessScreen";
import { extractProjectsFromDocuments } from "./utils/mockExtraction";
import { Step, FlowType, ProjectTemplate } from "./types";
import ProgressSteps from "./ProgressSteps";
import BasicsStep from "./BasicsStep";
import TemplateStep from "./TemplateStep";
import ServicesStep from "./ServicesStep";
import ConfirmStep from "./ConfirmStep";

const NewProjectPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [currentStep, setCurrentStep] = useState<Step>("method");
    const [flowType, setFlowType] = useState<FlowType | null>(null);
    
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
            setFlowType('documents');
            setCurrentStep('upload');
        } else if (method === 'manual') {
            setFlowType('manual');
            setCurrentStep('basics');
        }
    };

    // Document upload flow handlers
    const handleDocumentsChange = useCallback((docs: UploadedDocument[]) => {
        setUploadedDocuments(docs);
    }, []);

    const handleStartProcessing = () => {
        setCurrentStep('processing');
    };

    const handleProcessingComplete = useCallback(async () => {
        const projects = await extractProjectsFromDocuments(uploadedDocuments);
        setExtractedProjects(projects);
        setCurrentStep('review');
    }, [uploadedDocuments]);

    const handleProjectsChange = useCallback((projects: ExtractedProject[]) => {
        setExtractedProjects(projects);
    }, []);

    const handleConfirmImport = () => {
        setCurrentStep('confirm-import');
    };

    const handleCreateImportedProjects = () => {
        const confirmedProjects = extractedProjects.filter(p => p.isConfirmed);
        console.log("Creating projects:", confirmedProjects);
        toast.success("Projects imported", `${confirmedProjects.length} project(s) have been created.`);
        setCurrentStep('success');
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
        } else if (currentStep === "review") {
            setCurrentStep("upload");
        } else if (currentStep === "confirm-import") {
            setCurrentStep("review");
        }
    };

    const handleContinue = () => {
        if (currentStep === "basics") {
            if (!projectName.trim()) return;
            setCurrentStep("template");
        } else if (currentStep === "template") {
            setCurrentStep("services");
        } else if (currentStep === "services") {
            setCurrentStep("confirm");
        }
    };

    const handleCreateProject = () => {
        console.log("Creating project:", {
            name: projectName,
            type: projectType,
            customTypeName: showCustomType ? customTypeName : undefined,
            icon: projectIcon,
            template: selectedTemplate?.id,
            services: selectedServices,
        });
        toast.success("Project created", `${projectName} has been created successfully.`);
        router.push("/dashboard");
    };

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
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
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NewProjectPage;
