"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import { ProjectType } from "@/types";

type Step = "basics" | "template" | "services" | "confirm";

interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: ProjectType;
    suggestedServices: string[];
}

const templates: ProjectTemplate[] = [
    {
        id: "saas",
        name: "SaaS Starter",
        description: "Full-stack SaaS with auth, payments, and database",
        icon: "🚀",
        type: "web",
        suggestedServices: ["vercel", "supabase", "clerk", "stripe", "resend"],
    },
    {
        id: "landing",
        name: "Landing Page",
        description: "Marketing site with analytics and forms",
        icon: "📄",
        type: "landing",
        suggestedServices: ["vercel", "posthog", "resend"],
    },
    {
        id: "mobile",
        name: "Mobile App",
        description: "React Native or Flutter app with backend",
        icon: "📱",
        type: "mobile",
        suggestedServices: ["supabase", "clerk", "sentry", "cloudinary"],
    },
    {
        id: "api",
        name: "API / Backend",
        description: "REST or GraphQL API service",
        icon: "⚡",
        type: "api",
        suggestedServices: ["railway", "supabase", "redis", "sentry"],
    },
    {
        id: "extension",
        name: "Browser Extension",
        description: "Chrome or Firefox extension",
        icon: "🧩",
        type: "extension",
        suggestedServices: ["supabase", "posthog", "sentry"],
    },
    {
        id: "blank",
        name: "Blank Project",
        description: "Start from scratch with no pre-selected services",
        icon: "✨",
        type: "web",
        suggestedServices: [],
    },
];

const projectTypes: { value: ProjectType; label: string; icon: string; color: string }[] = [
    { value: "web", label: "Web App", icon: "align-right", color: "bg-blue-500/10 border-blue-500/20 fill-blue-500" },
    { value: "mobile", label: "Mobile App", icon: "mobile", color: "bg-purple-500/10 border-purple-500/20 fill-purple-500" },
    { value: "extension", label: "Browser Extension", icon: "cube", color: "bg-amber-500/10 border-amber-500/20 fill-amber-500" },
    { value: "desktop", label: "Desktop App", icon: "post", color: "bg-green-500/10 border-green-500/20 fill-green-500" },
    { value: "api", label: "API / Backend", icon: "edit", color: "bg-pink-500/10 border-pink-500/20 fill-pink-500" },
    { value: "landing", label: "Landing Page", icon: "external-link", color: "bg-cyan-500/10 border-cyan-500/20 fill-cyan-500" },
    { value: "embedded", label: "Embedded / IoT", icon: "bulb", color: "bg-orange-500/10 border-orange-500/20 fill-orange-500" },
    { value: "game", label: "Game", icon: "star", color: "bg-red-500/10 border-red-500/20 fill-red-500" },
    { value: "ai", label: "AI / ML Project", icon: "generation", color: "bg-violet-500/10 border-violet-500/20 fill-violet-500" },
];

const emojiOptions = [
    "🚀", "💼", "🎯", "📦", "🔥", "⚡", "🎨", "🛠️", "📱", "🌐", "💡", "🎮",
    "🤖", "🧠", "💎", "🔮", "🎵", "📸", "🛒", "💬", "📊", "🔐",
];

const NewProjectPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>("basics");
    
    // Form state
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState<ProjectType>("web");
    const [projectIcon, setProjectIcon] = useState("🚀");
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [customTypeName, setCustomTypeName] = useState("");
    const [showCustomType, setShowCustomType] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const hasUnsavedChanges = projectName.trim() !== "" || selectedTemplate !== null || selectedServices.length > 0;

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

    const handleBack = () => {
        if (currentStep === "template") {
            setCurrentStep("basics");
        } else if (currentStep === "services") {
            setCurrentStep("template");
        } else if (currentStep === "confirm") {
            setCurrentStep("services");
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
        // In a real app, this would save to the database
        console.log("Creating project:", {
            name: projectName,
            type: projectType,
            customTypeName: showCustomType ? customTypeName : undefined,
            icon: projectIcon,
            template: selectedTemplate?.id,
            services: selectedServices,
        });
        router.push("/dashboard");
    };

    const steps = [
        { id: "basics", label: "Basics", number: 1 },
        { id: "template", label: "Template", number: 2 },
        { id: "services", label: "Services", number: 3 },
        { id: "confirm", label: "Confirm", number: 4 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    const serviceNames: Record<string, string> = {
        vercel: "Vercel",
        supabase: "Supabase",
        clerk: "Clerk",
        stripe: "Stripe",
        resend: "Resend",
        posthog: "PostHog",
        sentry: "Sentry",
        cloudinary: "Cloudinary",
        railway: "Railway",
        redis: "Redis Cloud",
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
                        {/* Step 1: Basics */}
                        {currentStep === "basics" && (
                            <div>
                                <h2 className="text-body-bold mb-6">Project Details</h2>

                                {/* Project Name */}
                                <div className="mb-6">
                                    <Field
                                        label="Project Name"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="My Awesome Project"
                                        required
                                    />
                                </div>

                                {/* Project Icon */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-small font-medium text-t-secondary">
                                        Project Icon
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {emojiOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => setProjectIcon(emoji)}
                                                className={`flex items-center justify-center size-12 rounded-2xl text-xl transition-all ${
                                                    projectIcon === emoji
                                                        ? "bg-primary1/10 border-2 border-primary1"
                                                        : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Project Type */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-small font-medium text-t-secondary">
                                        Project Type
                                    </label>
                                    <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
                                        {projectTypes.map((type) => {
                                            const colorClasses = type.color.split(" ");
                                            return (
                                                <button
                                                    key={type.value}
                                                    onClick={() => {
                                                        setProjectType(type.value);
                                                        setShowCustomType(false);
                                                        setCustomTypeName("");
                                                    }}
                                                    className={`flex items-center p-3 rounded-2xl text-left transition-all ${
                                                        projectType === type.value && !showCustomType
                                                            ? "bg-primary1/10 border-2 border-primary1"
                                                            : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                                    }`}
                                                >
                                                    <div className={`flex items-center justify-center size-8 mr-3 rounded-xl border-[1.5px] ${colorClasses[0]} ${colorClasses[1]} ${colorClasses[2]}`}>
                                                        <Icon className="!w-4 !h-4" name={type.icon} />
                                                    </div>
                                                    <span className="text-small font-medium">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Custom Type Option */}
                                    <button
                                        onClick={() => {
                                            setShowCustomType(true);
                                            setProjectType("custom");
                                        }}
                                        className={`flex items-center w-full mt-3 p-3 rounded-2xl text-left transition-all ${
                                            showCustomType
                                                ? "bg-primary1/10 border-2 border-primary1"
                                                : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center size-8 mr-3 rounded-xl border-[1.5px] bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/20 fill-violet-500">
                                            <Icon className="!w-4 !h-4" name="edit" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-small font-medium">Custom Type</span>
                                            <span className="text-xs text-t-tertiary ml-2">Define your own project type</span>
                                        </div>
                                        <Icon className="!w-4 !h-4 fill-t-tertiary" name="arrow-right" />
                                    </button>
                                    
                                    {/* Custom Type Input */}
                                    {showCustomType && (
                                        <div className="mt-3 p-4 rounded-2xl bg-b-surface1 border-2 border-primary1/20">
                                            <label className="block mb-2 text-xs text-t-tertiary">
                                                Enter your custom project type
                                            </label>
                                            <input
                                                type="text"
                                                value={customTypeName}
                                                onChange={(e) => setCustomTypeName(e.target.value)}
                                                placeholder="e.g., Blockchain DApp, CLI Tool, WordPress Plugin..."
                                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-stroke-subtle">
                                    <Button
                                        isPrimary
                                        onClick={handleContinue}
                                        disabled={!projectName.trim() || (showCustomType && !customTypeName.trim())}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Template */}
                        {currentStep === "template" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-body-bold">Choose a Template</h2>
                                    <button
                                        onClick={handleBack}
                                        className="text-small text-t-secondary hover:text-t-primary transition-colors"
                                    >
                                        ← Back
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 max-md:grid-cols-1">
                                    {templates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleTemplateSelect(template)}
                                            className={`flex items-start p-4 rounded-3xl text-left transition-all ${
                                                selectedTemplate?.id === template.id
                                                    ? "bg-primary1/10 border-2 border-primary1"
                                                    : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                            }`}
                                        >
                                            <span className="text-2xl mr-3">{template.icon}</span>
                                            <div>
                                                <div className="font-medium text-t-primary">{template.name}</div>
                                                <div className="text-small text-t-secondary mt-0.5">
                                                    {template.description}
                                                </div>
                                                {template.suggestedServices.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {template.suggestedServices.slice(0, 3).map((s) => (
                                                            <span
                                                                key={s}
                                                                className="px-2 py-0.5 text-xs rounded-full bg-b-surface2 text-t-tertiary"
                                                            >
                                                                {serviceNames[s] || s}
                                                            </span>
                                                        ))}
                                                        {template.suggestedServices.length > 3 && (
                                                            <span className="px-2 py-0.5 text-xs rounded-full bg-b-surface2 text-t-tertiary">
                                                                +{template.suggestedServices.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

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

                        {/* Step 3: Services */}
                        {currentStep === "services" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-body-bold">Select Services</h2>
                                        <p className="text-small text-t-secondary mt-1">
                                            Choose which services to add to your project
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleBack}
                                        className="text-small text-t-secondary hover:text-t-primary transition-colors"
                                    >
                                        ← Back
                                    </button>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {Object.entries(serviceNames).map(([id, name]) => (
                                        <button
                                            key={id}
                                            onClick={() => toggleService(id)}
                                            className={`flex items-center w-full p-3 rounded-2xl text-left transition-all ${
                                                selectedServices.includes(id)
                                                    ? "bg-primary1/10 border-2 border-primary1"
                                                    : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                            }`}
                                        >
                                            <div
                                                className={`flex items-center justify-center size-6 mr-3 rounded-lg border-2 transition-all ${
                                                    selectedServices.includes(id)
                                                        ? "bg-primary1 border-primary1"
                                                        : "border-stroke-subtle"
                                                }`}
                                            >
                                                {selectedServices.includes(id) && (
                                                    <Icon className="!w-4 !h-4 fill-white" name="check" />
                                                )}
                                            </div>
                                            <span className="font-medium text-t-primary">{name}</span>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-xs text-t-tertiary mb-4">
                                    You can always add more services later from the project dashboard.
                                </p>

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
                        {currentStep === "confirm" && (
                            <div>
                                <h2 className="text-body-bold mb-6">Review & Create</h2>

                                <div className="p-4 rounded-3xl bg-b-surface1 mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center justify-center size-14 mr-4 rounded-2xl bg-primary1/10 text-2xl">
                                            {projectIcon}
                                        </div>
                                        <div>
                                            <div className="text-h4 text-t-primary">{projectName}</div>
                                            <div className="text-small text-t-secondary">
                                                {showCustomType ? customTypeName : projectTypes.find((t) => t.value === projectType)?.label}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-small">
                                        {selectedTemplate && (
                                            <div className="flex justify-between">
                                                <span className="text-t-secondary">Template</span>
                                                <span className="text-t-primary">{selectedTemplate.name}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-t-secondary">Services</span>
                                            <span className="text-t-primary">
                                                {selectedServices.length > 0
                                                    ? `${selectedServices.length} selected`
                                                    : "None selected"}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedServices.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-stroke-subtle">
                                            {selectedServices.map((s) => (
                                                <span
                                                    key={s}
                                                    className="px-2 py-1 text-xs rounded-full bg-b-surface2 text-t-secondary"
                                                >
                                                    {serviceNames[s] || s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-stroke-subtle">
                                    <Button isStroke onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button isPrimary onClick={handleCreateProject}>
                                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                        Create Project
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

export default NewProjectPage;
