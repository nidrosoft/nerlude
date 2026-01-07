"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

interface TourStep {
    id: string;
    title: string;
    description: string;
    target?: string; // CSS selector for highlighting
    position: "center" | "top" | "bottom" | "left" | "right";
    icon: string;
}

const tourSteps: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to Nelrude! 👋",
        description: "Let's take a quick tour to help you get started. You can skip this tour at any time.",
        position: "center",
        icon: "star",
    },
    {
        id: "dashboard",
        title: "Your Dashboard",
        description: "This is your central hub. View all your projects, track costs, and monitor alerts at a glance.",
        position: "center",
        icon: "post",
    },
    {
        id: "projects",
        title: "Create Projects",
        description: "Organize your services into projects. Each project can have multiple services, team members, and documentation.",
        position: "center",
        icon: "cube",
    },
    {
        id: "services",
        title: "Add Services",
        description: "Connect your SaaS services like Stripe, Supabase, Vercel, and more. Track costs, credentials, and renewal dates.",
        position: "center",
        icon: "plus",
    },
    {
        id: "credentials",
        title: "Secure Credentials",
        description: "Store and manage API keys and secrets securely. Access them anytime from the service detail page.",
        position: "center",
        icon: "lock",
    },
    {
        id: "team",
        title: "Collaborate with Team",
        description: "Invite team members and control access with roles. Everyone stays in sync with shared projects.",
        position: "center",
        icon: "users",
    },
    {
        id: "complete",
        title: "You're All Set! 🎉",
        description: "Start by creating your first project or exploring the demo data. Need help? Click the help button anytime.",
        position: "center",
        icon: "check",
    },
];

interface WelcomeTourProps {
    onComplete: () => void;
    isOpen: boolean;
}

const WelcomeTour = ({ onComplete, isOpen }: WelcomeTourProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        setIsVisible(isOpen);
    }, [isOpen]);

    if (!isVisible) return null;

    const step = tourSteps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tourSteps.length - 1;
    const progress = ((currentStep + 1) / tourSteps.length) * 100;

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        setIsVisible(false);
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#282828]/95" />

            {/* Tour Card */}
            <div className="relative z-10 w-full max-w-lg mx-4">
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="h-1 rounded-full bg-b-surface2 overflow-hidden">
                        <div
                            className="h-full bg-primary1 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-t-tertiary">
                        <span>Step {currentStep + 1} of {tourSteps.length}</span>
                        <button onClick={handleSkip} className="hover:text-t-primary transition-colors">
                            Skip tour
                        </button>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-8 rounded-4xl bg-b-surface1 text-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center size-20 mx-auto mb-6 rounded-3xl bg-primary1/10 fill-primary1">
                        <Icon className="!w-10 !h-10" name={step.icon} />
                    </div>

                    {/* Content */}
                    <h2 className="text-h3 mb-3">{step.title}</h2>
                    <p className="text-body text-t-secondary mb-8 max-w-sm mx-auto">
                        {step.description}
                    </p>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {tourSteps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentStep
                                        ? "w-6 bg-primary1"
                                        : index < currentStep
                                        ? "bg-primary1/50"
                                        : "bg-b-surface2"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        {!isFirstStep && (
                            <Button isStroke className="flex-1" onClick={handlePrevious}>
                                <Icon className="mr-2 !w-4 !h-4 rotate-90" name="chevron" />
                                Previous
                            </Button>
                        )}
                        <Button isPrimary className="flex-1" onClick={handleNext}>
                            {isLastStep ? (
                                <>
                                    Get Started
                                    <Icon className="ml-2 !w-4 !h-4" name="arrow-right" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <Icon className="ml-2 !w-4 !h-4 -rotate-90" name="chevron" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Keyboard Hint */}
                <div className="mt-4 text-center text-xs text-t-tertiary">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">←</kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">→</kbd> to navigate,{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-b-surface2 font-mono">Esc</kbd> to skip
                </div>
            </div>
        </div>
    );
};

export default WelcomeTour;
