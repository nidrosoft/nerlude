"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceCategory, UploadedDocument } from "@/types";
import { serviceRegistry, ServiceRegistryItem } from "@/registry";
import { useToast } from "@/components/Toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Step, FlowType, manualSteps, uploadSteps } from "./types";
import CategoryStep from "./CategoryStep";
import ServiceStep from "./ServiceStep";
import ConfigureStep from "./ConfigureStep";
import ConfirmStep from "./ConfirmStep";
import UploadStep from "./UploadStep";
import ProcessingScreen from "./ProcessingScreen";
import ReviewExtractedStep, { ExtractedServiceItem } from "./ReviewExtractedStep";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import { ConfidenceLevel } from "@/types";

type Props = {
    projectId: string;
};

const AddServicePage = ({ projectId }: Props) => {
    const router = useRouter();
    const toast = useToast();
    const { canAddService, getUpgradeMessage, isLoading: isLoadingSubscription } = useSubscription();
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [flowType, setFlowType] = useState<FlowType>("manual");
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceRegistryItem | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [customCost, setCustomCost] = useState<string>("");
    const [renewalDate, setRenewalDate] = useState<string>("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeModalConfig, setUpgradeModalConfig] = useState({ title: "", message: "", suggestedPlan: "Pro" });
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedServices, setSelectedServices] = useState<ServiceRegistryItem[]>([]);
    const [projectName, setProjectName] = useState<string>("Project");
    const [currentServiceCount, setCurrentServiceCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Upload flow state
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [extractedServices, setExtractedServices] = useState<ExtractedServiceItem[]>([]);

    const hasUnsavedChanges = selectedCategory !== null || selectedService !== null || Object.keys(credentials).some(k => credentials[k]) || uploadedDocuments.length > 0;

    // Fetch project name and service count
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProjectName(data.name);
                }
                
                // Fetch current service count
                const servicesRes = await fetch(`/api/projects/${projectId}/services`);
                if (servicesRes.ok) {
                    const services = await servicesRes.json();
                    setCurrentServiceCount(services.length || 0);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchProject();
    }, [projectId]);

    // Check service limit on mount
    useEffect(() => {
        if (!isLoadingSubscription && currentServiceCount > 0) {
            const serviceCheck = canAddService(currentServiceCount);
            if (!serviceCheck.allowed) {
                const upgradeMsg = getUpgradeMessage("services");
                setUpgradeModalConfig({
                    title: upgradeMsg.title,
                    message: upgradeMsg.message,
                    suggestedPlan: upgradeMsg.suggestedPlan,
                });
                setShowUpgradeModal(true);
            }
        }
    }, [isLoadingSubscription, currentServiceCount, canAddService, getUpgradeMessage]);

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowCancelModal(true);
        } else {
            router.push(`/projects/${projectId}`);
        }
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        router.push(`/projects/${projectId}`);
    };

    const handleCategorySelect = (category: ServiceCategory) => {
        setSelectedCategory(category);
        setCurrentStep("service");
    };

    const handleServiceSelect = (service: ServiceRegistryItem) => {
        setSelectedService(service);
        if (service.plans.length > 0) {
            setSelectedPlan(service.plans[0].name);
        }
        setCurrentStep("configure");
    };

    const handleBack = () => {
        if (currentStep === "service") {
            setCurrentStep("category");
            setSelectedCategory(null);
        } else if (currentStep === "configure") {
            setCurrentStep("service");
            setSelectedService(null);
        } else if (currentStep === "confirm") {
            setCurrentStep("configure");
        } else if (currentStep === "upload") {
            setCurrentStep("category");
            setFlowType("manual");
            setUploadedDocuments([]);
        } else if (currentStep === "review-extracted") {
            setCurrentStep("upload");
            setExtractedServices([]);
        } else if (currentStep === "processing") {
            setCurrentStep("upload");
        }
    };

    const handleUploadClick = () => {
        setFlowType("upload");
        setCurrentStep("upload");
    };

    const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.5) return 'medium';
        return 'low';
    };

    const handleAnalyzeDocuments = async () => {
        if (uploadedDocuments.length === 0 || isAnalyzing) return;
        
        setIsAnalyzing(true);
        setCurrentStep("processing");
        setAnalysisProgress(0);
        setAnalysisStep(0);
        
        // Simulate progress steps
        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => Math.min(prev + 2, 90));
        }, 100);
        
        const stepInterval = setInterval(() => {
            setAnalysisStep(prev => Math.min(prev + 1, 2));
        }, 1500);

        try {
            // Call the analyze-documents API
            const documentInputs = await Promise.all(
                uploadedDocuments.map(async (doc) => {
                    const mimeType = doc.file.type;
                    const isText = mimeType.startsWith('text/') || mimeType === 'application/json';
                    
                    if (isText) {
                        const text = await doc.file.text();
                        return {
                            type: 'text' as const,
                            content: text,
                            filename: doc.name,
                            mimeType,
                        };
                    } else {
                        const base64 = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(doc.file);
                            reader.onload = () => {
                                const result = reader.result as string;
                                resolve(result.split(',')[1]);
                            };
                            reader.onerror = reject;
                        });
                        return {
                            type: 'image' as const,
                            content: base64,
                            filename: doc.name,
                            mimeType,
                        };
                    }
                })
            );

            const response = await fetch('/api/projects/analyze-documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documents: documentInputs }),
            });

            clearInterval(progressInterval);
            clearInterval(stepInterval);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to analyze documents');
            }

            const result = await response.json();
            
            if (result.success && result.data?.services && result.data.services.length > 0) {
                const services: ExtractedServiceItem[] = result.data.services.map((s: any, index: number) => {
                    const confidence = s.confidence || 0.5;
                    const confidenceLevel = getConfidenceLevel(confidence);
                    const category = (s.registryId 
                        ? result.serviceRegistry?.find((r: any) => r.id === s.registryId)?.category 
                        : 'other') as ServiceCategory || 'other';
                    
                    return {
                        id: `extracted-${index}`,
                        name: { value: s.detectedName || 'Unknown Service', confidence: confidenceLevel },
                        category: { value: category, confidence: confidenceLevel },
                        plan: s.planName ? { value: s.planName, confidence: confidenceLevel } : null,
                        costAmount: { value: s.billing?.amount || 0, confidence: confidenceLevel },
                        costFrequency: { value: s.billing?.frequency || 'monthly', confidence: confidenceLevel },
                        currency: { value: s.billing?.currency || 'USD', confidence: confidenceLevel },
                        renewalDate: s.renewalDate ? { value: s.renewalDate, confidence: confidenceLevel } : null,
                        registryId: s.registryId || null,
                        isConfirmed: false,
                        documents: uploadedDocuments,
                    };
                });
                
                setAnalysisProgress(100);
                setExtractedServices(services);
                
                // Short delay before showing review
                setTimeout(() => {
                    setCurrentStep("review-extracted");
                    setIsAnalyzing(false);
                }, 500);
            } else {
                // No services found - show error, go back to upload
                setCurrentStep("upload");
                setIsAnalyzing(false);
                toast.error("No services found", "We couldn't extract any services from your documents. Please try uploading clearer invoices or receipts.");
            }
        } catch (error) {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
            console.error('Error analyzing documents:', error);
            setCurrentStep("upload");
            setIsAnalyzing(false);
            toast.error("Analysis failed", error instanceof Error ? error.message : "Failed to analyze documents. Please try again.");
        }
    };

    const handleAddExtractedServices = async () => {
        const confirmedServices = extractedServices.filter(s => s.isConfirmed);
        if (confirmedServices.length === 0 || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const promises = confirmedServices.map(service => 
                fetch(`/api/projects/${projectId}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        registry_id: service.registryId,
                        category_id: service.category.value,
                        name: service.name.value,
                        plan: service.plan?.value || null,
                        cost_amount: service.costAmount.value || 0,
                        cost_frequency: service.costFrequency.value || 'monthly',
                        renewal_date: service.renewalDate?.value || null,
                    }),
                })
            );

            await Promise.all(promises);
            
            toast.success(
                `${confirmedServices.length} service${confirmedServices.length !== 1 ? 's' : ''} added`, 
                `Services have been added to your project.`
            );
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error adding services:', error);
            toast.error("Error", "Failed to add some services");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMoreFiles = () => {
        setCurrentStep("upload");
    };

    const handleContinue = () => {
        if (currentStep === "configure") {
            setCurrentStep("confirm");
        }
    };

    const handleAddService = async () => {
        if (!selectedService || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const plan = selectedService.plans.find(p => p.name === selectedPlan);
            const cost = customCost ? parseFloat(customCost) : (plan?.price || 0);
            
            // Step 1: Create the service
            const response = await fetch(`/api/projects/${projectId}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registry_id: selectedService.id,
                    category_id: selectedService.category,
                    name: selectedService.name,
                    plan: selectedPlan,
                    cost_amount: cost,
                    cost_frequency: plan?.frequency || 'monthly',
                    renewal_date: renewalDate || null,
                    notes: credentials.notes || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add service');
            }

            const createdService = await response.json();
            
            // Step 2: Save credentials if any were provided (excluding 'notes' which is already saved)
            const credentialFields = Object.entries(credentials).filter(
                ([key, value]) => key !== 'notes' && value && value.trim() !== ''
            );
            
            if (credentialFields.length > 0) {
                // Build the fields object from the credential entries
                const fields: Record<string, string> = {};
                credentialFields.forEach(([key, value]) => {
                    fields[key] = value;
                });
                
                // Determine credential type based on the service's credential fields
                const credentialType = selectedService.credentialFields.some(f => f.type === 'password') 
                    ? 'api_key' 
                    : 'environment_variable';
                
                const credResponse = await fetch(
                    `/api/projects/${projectId}/services/${createdService.id}/credentials`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            environment: 'production',
                            type: credentialType,
                            fields: fields,
                            description: `${selectedService.name} credentials`,
                        }),
                    }
                );

                if (!credResponse.ok) {
                    console.error('Failed to save credentials, but service was created');
                }
            }

            toast.success("Service added", `${selectedService.name} has been added to your project.`);
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error("Error", error instanceof Error ? error.message : "Failed to add service");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkAddServices = async () => {
        if (selectedServices.length === 0 || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const promises = selectedServices.map(service => 
                fetch(`/api/projects/${projectId}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        registry_id: service.id,
                        category_id: service.category,
                        name: service.name,
                        plan: service.plans[0]?.name || null,
                        cost_amount: service.plans[0]?.price || 0,
                        cost_frequency: service.plans[0]?.frequency || 'monthly',
                    }),
                })
            );

            await Promise.all(promises);
            
            toast.success(
                `${selectedServices.length} services added`, 
                `${selectedServices.map(s => s.name).join(", ")} have been added to your project.`
            );
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error adding services:', error);
            toast.error("Error", "Failed to add some services");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleServiceSelection = (service: ServiceRegistryItem) => {
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id);
            if (isSelected) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const isServiceSelected = (serviceId: string) => {
        return selectedServices.some(s => s.id === serviceId);
    };

    // Get recently used services (popular ones from registry)
    const recentlyUsedServices = serviceRegistry.slice(0, 5);

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Breadcrumb Navigation */}
                    <Breadcrumb 
                        className="mb-6"
                        items={[
                            { label: "Dashboard", href: "/dashboard" },
                            { label: projectName, href: `/projects/${projectId}` },
                            { label: "Add Service" },
                        ]}
                    />
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-[1.5px] border-green-500/30">
                            <Icon className="!w-6 !h-6 fill-green-500" name="plus" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-h3">Add Service{bulkMode ? "s" : ""}</h1>
                            <p className="text-small text-t-secondary">
                                {bulkMode 
                                    ? `Select multiple services (${selectedServices.length} selected)`
                                    : "Connect a new service to your project"
                                }
                            </p>
                        </div>
                        {currentStep === "category" && (
                            <button
                                onClick={() => {
                                    setBulkMode(!bulkMode);
                                    setSelectedServices([]);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-small font-medium transition-all ${
                                    bulkMode 
                                        ? "bg-primary1 text-white" 
                                        : "bg-b-surface2 text-t-secondary hover:bg-b-surface1 hover:text-t-primary"
                                }`}
                            >
                                <Icon className="!w-4 !h-4" name="post" />
                                {bulkMode ? "Bulk Mode On" : "Bulk Add"}
                            </button>
                        )}
                        <button
                            onClick={handleCancel}
                            className="flex items-center justify-center size-12 rounded-full bg-b-surface2 hover:shadow-hover hover:bg-b-surface1 transition-all fill-t-secondary hover:fill-t-primary"
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
                            <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
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
                    {(() => {
                        const steps = flowType === "upload" ? uploadSteps : manualSteps;
                        const currentStepIdx = steps.findIndex((s) => s.id === currentStep);
                        return (
                            <div className="flex items-center gap-2 mb-8">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center">
                                        <div
                                            className={`flex items-center justify-center size-8 rounded-full text-small font-medium transition-all ${
                                                index <= currentStepIdx
                                                    ? "bg-t-primary text-b-surface1"
                                                    : "bg-b-surface2 text-t-tertiary"
                                            }`}
                                        >
                                            {index < currentStepIdx ? (
                                                <Icon className="!w-4 !h-4 fill-b-surface1" name="check" />
                                            ) : (
                                                step.number
                                            )}
                                        </div>
                                        <span
                                            className={`ml-2 text-small font-medium ${
                                                index <= currentStepIdx ? "text-t-primary" : "text-t-tertiary"
                                            }`}
                                        >
                                            {step.label}
                                        </span>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`w-8 h-0.5 mx-3 ${
                                                    index < currentStepIdx ? "bg-t-primary" : "bg-b-surface2"
                                                }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* Step Content */}
                    <div className="p-6 rounded-4xl bg-b-surface2">
                        {currentStep === "category" && (
                            <CategoryStep
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                bulkMode={bulkMode}
                                setBulkMode={setBulkMode}
                                selectedServices={selectedServices}
                                toggleServiceSelection={toggleServiceSelection}
                                isServiceSelected={isServiceSelected}
                                recentlyUsedServices={recentlyUsedServices}
                                onCategorySelect={handleCategorySelect}
                                onServiceSelect={handleServiceSelect}
                                onBulkAdd={handleBulkAddServices}
                                onUploadClick={handleUploadClick}
                            />
                        )}

                        {currentStep === "service" && selectedCategory && (
                            <ServiceStep
                                selectedCategory={selectedCategory}
                                onServiceSelect={handleServiceSelect}
                                onBack={handleBack}
                            />
                        )}

                        {currentStep === "configure" && selectedService && (
                            <ConfigureStep
                                selectedService={selectedService}
                                selectedPlan={selectedPlan}
                                setSelectedPlan={setSelectedPlan}
                                customCost={customCost}
                                setCustomCost={setCustomCost}
                                renewalDate={renewalDate}
                                setRenewalDate={setRenewalDate}
                                credentials={credentials}
                                setCredentials={setCredentials}
                                visibleCredentials={visibleCredentials}
                                setVisibleCredentials={setVisibleCredentials}
                                onBack={handleBack}
                                onContinue={handleContinue}
                            />
                        )}

                        {currentStep === "confirm" && selectedService && (
                            <ConfirmStep
                                selectedService={selectedService}
                                selectedPlan={selectedPlan}
                                customCost={customCost}
                                renewalDate={renewalDate}
                                credentials={credentials}
                                onBack={handleBack}
                                onAddService={handleAddService}
                            />
                        )}

                        {currentStep === "upload" && (
                            <UploadStep
                                documents={uploadedDocuments}
                                onDocumentsChange={setUploadedDocuments}
                                onAnalyze={handleAnalyzeDocuments}
                                onBack={handleBack}
                                isAnalyzing={isAnalyzing}
                            />
                        )}

                        {currentStep === "processing" && (
                            <ProcessingScreen
                                documents={uploadedDocuments}
                                progress={analysisProgress}
                                currentStep={analysisStep}
                            />
                        )}

                        {currentStep === "review-extracted" && (
                            <ReviewExtractedStep
                                services={extractedServices}
                                onServicesChange={setExtractedServices}
                                onAddServices={handleAddExtractedServices}
                                onBack={handleBack}
                                onAddMore={handleAddMoreFiles}
                                isAdding={isSubmitting}
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
                    router.push(`/projects/${projectId}`);
                }}
                title={upgradeModalConfig.title}
                message={upgradeModalConfig.message}
                suggestedPlan={upgradeModalConfig.suggestedPlan}
                limitType="services"
            />
        </Layout>
    );
};

export default AddServicePage;
