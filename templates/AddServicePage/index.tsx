"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ServiceCategory } from "@/types";
import { serviceRegistry, getServicesByCategory, ServiceRegistryItem } from "@/data/serviceRegistry";
import { categoryLabels, categoryIcons } from "@/data/mockServices";

type Props = {
    projectId: string;
};

type Step = "category" | "service" | "configure" | "confirm";

const AddServicePage = ({ projectId }: Props) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceRegistryItem | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [customCost, setCustomCost] = useState<string>("");
    const [renewalDate, setRenewalDate] = useState<string>("");
    const [showCancelModal, setShowCancelModal] = useState(false);

    const hasUnsavedChanges = selectedCategory !== null || selectedService !== null || Object.keys(credentials).some(k => credentials[k]);

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

    const categories = Array.from(new Set(serviceRegistry.map((s) => s.category)));

    const getCategoryColor = (category: ServiceCategory) => {
        const colors: Record<string, { bg: string; border: string; icon: string }> = {
            hosting: { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "fill-blue-500" },
            database: { bg: "bg-green-500/10", border: "border-green-500/20", icon: "fill-green-500" },
            domain: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "fill-purple-500" },
            auth: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "fill-amber-500" },
            payments: { bg: "bg-pink-500/10", border: "border-pink-500/20", icon: "fill-pink-500" },
            email: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "fill-cyan-500" },
            analytics: { bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "fill-orange-500" },
            storage: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: "fill-indigo-500" },
            ai: { bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "fill-violet-500" },
            monitoring: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "fill-emerald-500" },
            devtools: { bg: "bg-slate-500/10", border: "border-slate-500/20", icon: "fill-slate-500" },
        };
        return colors[category] || { bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "fill-gray-500" };
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

    const handleAddService = () => {
        // In a real app, this would save to the database
        console.log("Adding service:", {
            projectId,
            service: selectedService,
            plan: selectedPlan,
            credentials,
            customCost,
            renewalDate,
        });
        router.push(`/projects/${projectId}`);
    };

    const steps = [
        { id: "category", label: "Category", number: 1 },
        { id: "service", label: "Service", number: 2 },
        { id: "configure", label: "Configure", number: 3 },
        { id: "confirm", label: "Confirm", number: 4 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-[1.5px] border-green-500/30">
                            <Icon className="!w-6 !h-6 fill-green-500" name="plus" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-h3">Add Service</h1>
                            <p className="text-small text-t-secondary">
                                Connect a new service to your project
                            </p>
                        </div>
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
                        {/* Step 1: Category Selection */}
                        {currentStep === "category" && (
                            <div>
                                <h2 className="text-body-bold mb-4">Select a category</h2>
                                <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
                                    {categories.map((category) => {
                                        const colors = getCategoryColor(category);
                                        const count = getServicesByCategory(category).length;
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => handleCategorySelect(category)}
                                                className="flex flex-col items-center p-5 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all text-center"
                                            >
                                                <div
                                                    className={`flex items-center justify-center size-12 mb-3 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                                                >
                                                    <Icon className="!w-6 !h-6" name={categoryIcons[category] || "star"} />
                                                </div>
                                                <div className="text-small font-medium text-t-primary">
                                                    {categoryLabels[category] || category}
                                                </div>
                                                <div className="text-xs text-t-tertiary mt-1">
                                                    {count} service{count !== 1 ? "s" : ""}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Service Selection */}
                        {currentStep === "service" && selectedCategory && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-body-bold">
                                        Select a {categoryLabels[selectedCategory]?.toLowerCase() || selectedCategory} service
                                    </h2>
                                    <button
                                        onClick={handleBack}
                                        className="text-small text-t-secondary hover:text-t-primary transition-colors"
                                    >
                                        ← Back to categories
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {getServicesByCategory(selectedCategory).map((service) => {
                                        const colors = getCategoryColor(selectedCategory);
                                        return (
                                            <button
                                                key={service.id}
                                                onClick={() => handleServiceSelect(service)}
                                                className="flex items-center w-full p-4 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all text-left"
                                            >
                                                <div
                                                    className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${colors.border} ${colors.bg} ${colors.icon}`}
                                                >
                                                    <Icon className="!w-6 !h-6" name={categoryIcons[selectedCategory] || "star"} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-t-primary">{service.name}</div>
                                                    <div className="text-small text-t-secondary truncate">
                                                        {service.description}
                                                    </div>
                                                </div>
                                                <Icon className="!w-5 !h-5 fill-t-tertiary" name="arrow-right" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Configure */}
                        {currentStep === "configure" && selectedService && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div
                                            className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${getCategoryColor(selectedService.category).border} ${getCategoryColor(selectedService.category).bg} ${getCategoryColor(selectedService.category).icon}`}
                                        >
                                            <Icon className="!w-6 !h-6" name={categoryIcons[selectedService.category] || "star"} />
                                        </div>
                                        <div>
                                            <h2 className="text-body-bold">{selectedService.name}</h2>
                                            <p className="text-small text-t-secondary">{selectedService.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleBack}
                                        className="text-small text-t-secondary hover:text-t-primary transition-colors"
                                    >
                                        ← Change service
                                    </button>
                                </div>

                                {/* Plan Selection */}
                                {selectedService.plans.length > 0 && (
                                    <div className="mb-6">
                                        <label className="block mb-2 text-small font-medium text-t-secondary">
                                            Plan
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedService.plans.map((plan) => (
                                                <button
                                                    key={plan.name}
                                                    onClick={() => setSelectedPlan(plan.name)}
                                                    className={`px-4 py-2 rounded-xl text-small font-medium transition-all ${
                                                        selectedPlan === plan.name
                                                            ? "bg-t-primary text-b-surface1"
                                                            : "bg-b-surface1 text-t-secondary hover:bg-b-surface1/80"
                                                    }`}
                                                >
                                                    {plan.name}
                                                    {plan.price > 0 && (
                                                        <span className="ml-1 opacity-75">
                                                            ${plan.price}/{plan.frequency === "monthly" ? "mo" : "yr"}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Custom Cost */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-small font-medium text-t-secondary">
                                        Monthly Cost (optional override)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-t-tertiary">$</span>
                                        <input
                                            type="number"
                                            value={customCost}
                                            onChange={(e) => setCustomCost(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-b-surface1 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                        />
                                    </div>
                                </div>

                                {/* Renewal Date */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-small font-medium text-t-secondary">
                                        Next Renewal Date (optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={renewalDate}
                                        onChange={(e) => setRenewalDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                    />
                                </div>

                                {/* Credentials */}
                                {selectedService.credentialFields.length > 0 && (
                                    <div className="mb-6">
                                        <label className="block mb-3 text-small font-medium text-t-secondary">
                                            Credentials (optional - stored securely)
                                        </label>
                                        <div className="space-y-3">
                                            {selectedService.credentialFields.map((field) => (
                                                <div key={field.key}>
                                                    <label className="block mb-1 text-xs text-t-tertiary">
                                                        {field.label}
                                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                                    </label>
                                                    <input
                                                        type={field.type}
                                                        value={credentials[field.key] || ""}
                                                        onChange={(e) =>
                                                            setCredentials({ ...credentials, [field.key]: e.target.value })
                                                        }
                                                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                                        className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                                    <Button isStroke onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button isPrimary onClick={handleContinue}>
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirm */}
                        {currentStep === "confirm" && selectedService && (
                            <div>
                                <h2 className="text-body-bold mb-6">Review & Confirm</h2>

                                <div className="p-4 rounded-3xl bg-b-surface1 mb-6">
                                    <div className="flex items-center mb-4">
                                        <div
                                            className={`flex items-center justify-center size-12 mr-4 rounded-2xl border-[1.5px] ${getCategoryColor(selectedService.category).border} ${getCategoryColor(selectedService.category).bg} ${getCategoryColor(selectedService.category).icon}`}
                                        >
                                            <Icon className="!w-6 !h-6" name={categoryIcons[selectedService.category] || "star"} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-t-primary">{selectedService.name}</div>
                                            <div className="text-small text-t-secondary">{selectedPlan} plan</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-small">
                                        <div className="flex justify-between">
                                            <span className="text-t-secondary">Category</span>
                                            <span className="text-t-primary">{categoryLabels[selectedService.category]}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-t-secondary">Monthly Cost</span>
                                            <span className="text-t-primary">
                                                {customCost
                                                    ? `$${customCost}`
                                                    : selectedService.plans.find((p) => p.name === selectedPlan)?.price === 0
                                                    ? "Free"
                                                    : `$${selectedService.plans.find((p) => p.name === selectedPlan)?.price}/mo`}
                                            </span>
                                        </div>
                                        {renewalDate && (
                                            <div className="flex justify-between">
                                                <span className="text-t-secondary">Next Renewal</span>
                                                <span className="text-t-primary">
                                                    {new Date(renewalDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-t-secondary">Credentials</span>
                                            <span className="text-t-primary">
                                                {Object.keys(credentials).filter((k) => credentials[k]).length > 0
                                                    ? `${Object.keys(credentials).filter((k) => credentials[k]).length} field(s) saved`
                                                    : "None provided"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                                    <Button isStroke onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button isPrimary onClick={handleAddService}>
                                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                        Add Service
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddServicePage;
