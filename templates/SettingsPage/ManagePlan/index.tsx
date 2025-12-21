"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SettingsSidebar from "../SettingsSidebar";

interface Plan {
    id: string;
    name: string;
    price: number;
    frequency: string;
    description: string;
    features: string[];
    projectLimit: number;
    teamLimit: number;
    isPopular?: boolean;
}

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        frequency: "forever",
        description: "Perfect for getting started",
        features: [
            "1 project",
            "1 team member",
            "Basic service tracking",
            "Email notifications",
            "Community support",
        ],
        projectLimit: 1,
        teamLimit: 1,
    },
    {
        id: "pro",
        name: "Pro",
        price: 19.99,
        frequency: "month",
        description: "For growing founders",
        features: [
            "Up to 10 projects",
            "5 team members",
            "Advanced service tracking",
            "Priority notifications",
            "Credential encryption",
            "API access",
            "Email support",
        ],
        projectLimit: 10,
        teamLimit: 5,
        isPopular: true,
    },
    {
        id: "team",
        name: "Team",
        price: 39.99,
        frequency: "month",
        description: "For agencies and teams",
        features: [
            "Unlimited projects",
            "Unlimited team members",
            "Advanced service tracking",
            "Priority notifications",
            "Credential encryption",
            "API access",
            "Custom integrations",
            "Priority support",
            "Audit logs",
        ],
        projectLimit: -1,
        teamLimit: -1,
    },
];

const ManagePlanPage = () => {
    const [currentPlan] = useState("free");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const currentPlanData = plans.find((p) => p.id === currentPlan);

    const handleSelectPlan = (plan: Plan) => {
        if (plan.id === currentPlan) return;
        setSelectedPlan(plan);
        setShowUpgradeModal(true);
    };

    const handleConfirmUpgrade = () => {
        console.log("Upgrading to:", selectedPlan?.name);
        setShowUpgradeModal(false);
    };

    const getPrice = (plan: Plan) => {
        if (plan.price === 0) return "Free";
        const price = billingCycle === "yearly" ? (plan.price * 12 * 0.9).toFixed(2) : plan.price.toFixed(2);
        return `$${price}`;
    };

    const getMonthlyEquivalent = (plan: Plan) => {
        if (plan.price === 0) return null;
        if (billingCycle === "yearly") {
            return (plan.price * 0.9).toFixed(2);
        }
        return null;
    };

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex gap-8 max-lg:flex-col">
                        {/* Sidebar */}
                        <SettingsSidebar activeTab="plan" />

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-[1.5px] border-amber-500/30">
                                    <Icon className="!w-6 !h-6 fill-amber-500" name="star-stroke" />
                                </div>
                                <div>
                                    <h1 className="text-h3">Manage Plan</h1>
                                    <p className="text-small text-t-secondary">
                                        View and upgrade your subscription
                                    </p>
                                </div>
                            </div>

                            {/* Current Plan */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-body-bold">Current Plan</h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                                        Active
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-b-surface1">
                                    <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10 border-[1.5px] border-primary1/20">
                                        <Icon className="!w-6 !h-6 fill-primary1" name="star" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-lg">{currentPlanData?.name} Plan</p>
                                        <p className="text-small text-t-secondary">
                                            {currentPlanData?.projectLimit === -1 
                                                ? "Unlimited projects" 
                                                : `${currentPlanData?.projectLimit} projects`} · {currentPlanData?.teamLimit === -1 
                                                ? "Unlimited team members" 
                                                : `${currentPlanData?.teamLimit} team member${currentPlanData?.teamLimit !== 1 ? "s" : ""}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-h4">{getPrice(currentPlanData!)}</p>
                                        {currentPlanData?.price !== 0 && (
                                            <p className="text-small text-t-tertiary">per {billingCycle === "yearly" ? "year" : "month"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Usage */}
                                <div className="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                    <div className="p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-small text-t-secondary">Projects</span>
                                            <span className="text-small font-medium">3 / {currentPlanData?.projectLimit === -1 ? "∞" : currentPlanData?.projectLimit}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-b-surface2 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-primary1"
                                                style={{ width: currentPlanData?.projectLimit === -1 ? "10%" : `${(3 / currentPlanData!.projectLimit) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-small text-t-secondary">Team Members</span>
                                            <span className="text-small font-medium">1 / {currentPlanData?.teamLimit === -1 ? "∞" : currentPlanData?.teamLimit}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-b-surface2 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-green-500"
                                                style={{ width: currentPlanData?.teamLimit === -1 ? "10%" : `${(1 / currentPlanData!.teamLimit) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Cycle Toggle */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex items-center gap-4">
                                    <span className={`text-small font-medium ${billingCycle === "monthly" ? "text-t-primary" : "text-t-tertiary"}`}>
                                        Monthly
                                    </span>
                                    <button
                                        onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                                        className="relative w-14 h-8 rounded-full transition-colors bg-b-dark1 border-2 border-b-dark1"
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-md transition-transform ${
                                                billingCycle === "yearly" ? "translate-x-6" : ""
                                            }`}
                                        />
                                    </button>
                                    <span className={`text-small font-medium ${billingCycle === "yearly" ? "text-t-primary" : "text-t-tertiary"}`}>
                                        Yearly
                                    </span>
                                </div>
                                <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600 transition-opacity ${
                                    billingCycle === "yearly" ? "opacity-100" : "opacity-0"
                                }`}>
                                    Save 10%
                                </span>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1 items-stretch">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative p-6 rounded-4xl transition-all flex flex-col ${
                                            plan.id === currentPlan
                                                ? "bg-primary1/5 border-2 border-primary1"
                                                : plan.isPopular
                                                ? "bg-b-surface2 border-2 border-amber-500/30"
                                                : "bg-b-surface2 border-2 border-transparent"
                                        }`}
                                    >
                                        {plan.isPopular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full bg-amber-500 text-white">
                                                Most Popular
                                            </span>
                                        )}
                                        
                                        <h3 className="text-body-bold mb-1">{plan.name}</h3>
                                        <p className="text-small text-t-secondary mb-4">{plan.description}</p>
                                        
                                        <div className="mb-4 h-16">
                                            <span className="text-h2">{getPrice(plan)}</span>
                                            {plan.price !== 0 && (
                                                <span className="text-small text-t-tertiary">
                                                    /{billingCycle === "yearly" ? "year" : "month"}
                                                </span>
                                            )}
                                            {getMonthlyEquivalent(plan) && (
                                                <p className="text-xs text-t-tertiary mt-1">
                                                    ${getMonthlyEquivalent(plan)}/month
                                                </p>
                                            )}
                                        </div>

                                        <ul className="space-y-2 flex-1">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-small">
                                                    <Icon className="!w-4 !h-4 fill-green-500 shrink-0" name="check" />
                                                    <span className="text-t-secondary">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className="w-full mt-6"
                                            isSecondary={plan.id !== currentPlan}
                                            isStroke={plan.id === currentPlan}
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={plan.id === currentPlan}
                                        >
                                            {plan.id === currentPlan ? "Current Plan" : "Upgrade"}
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Billing History */}
                            <div className="mt-8 p-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-4">Billing History</h2>
                                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                                    <p className="text-small text-t-tertiary">
                                        No billing history yet
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-[#282828]/90"
                        onClick={() => setShowUpgradeModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <h3 className="text-h4 mb-2">Upgrade to {selectedPlan.name}</h3>
                        <p className="text-small text-t-secondary mb-6">
                            You'll be charged {getPrice(selectedPlan)}/{billingCycle === "yearly" ? "year" : "month"} starting today.
                        </p>
                        
                        <div className="p-4 rounded-2xl bg-b-surface2 mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-small text-t-secondary">{selectedPlan.name} Plan</span>
                                <span className="text-small font-medium">{getPrice(selectedPlan)}</span>
                            </div>
                            <div className="flex justify-between text-t-tertiary">
                                <span className="text-small">Billed {billingCycle}</span>
                                <span className="text-small">
                                    {billingCycle === "yearly" 
                                        ? `$${selectedPlan.price * 12 * 0.8}/year` 
                                        : `$${selectedPlan.price}/month`}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => setShowUpgradeModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                isPrimary
                                onClick={handleConfirmUpgrade}
                            >
                                Confirm Upgrade
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManagePlanPage;
