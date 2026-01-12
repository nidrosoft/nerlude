"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceCategory } from "@/types";
import { serviceRegistry, ServiceRegistryItem } from "@/registry";
import { useToast } from "@/components/Toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Step, steps } from "./types";
import CategoryStep from "./CategoryStep";
import ServiceStep from "./ServiceStep";
import ConfigureStep from "./ConfigureStep";
import ConfirmStep from "./ConfirmStep";

type Props = {
    projectId: string;
};

const AddServicePage = ({ projectId }: Props) => {
    const router = useRouter();
    const toast = useToast();
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceRegistryItem | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [customCost, setCustomCost] = useState<string>("");
    const [renewalDate, setRenewalDate] = useState<string>("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedServices, setSelectedServices] = useState<ServiceRegistryItem[]>([]);
    const [projectName, setProjectName] = useState<string>("Project");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUnsavedChanges = selectedCategory !== null || selectedService !== null || Object.keys(credentials).some(k => credentials[k]);

    // Fetch project name
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProjectName(data.name);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchProject();
    }, [projectId]);

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
        }
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

    const steps = [
        { id: "category", label: "Category", number: 1 },
        { id: "service", label: "Service", number: 2 },
        { id: "configure", label: "Configure", number: 3 },
        { id: "confirm", label: "Confirm", number: 4 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    
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
                    <div className="flex items-center gap-2 mb-8">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center size-8 rounded-full text-small font-medium transition-all ${
                                        index <= currentStepIndex
                                            ? "bg-t-primary text-b-surface1"
                                            : "bg-b-surface2 text-t-tertiary"
                                    }`}
                                >
                                    {index < currentStepIndex ? (
                                        <Icon className="!w-4 !h-4 fill-b-surface1" name="check" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span
                                    className={`ml-2 text-small font-medium ${
                                        index <= currentStepIndex ? "text-t-primary" : "text-t-tertiary"
                                    }`}
                                >
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-8 h-0.5 mx-3 ${
                                            index < currentStepIndex ? "bg-t-primary" : "bg-b-surface2"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

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
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddServicePage;
