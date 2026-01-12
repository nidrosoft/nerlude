"use client";

import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import SettingsSidebar from "../SettingsSidebar";
import { BillingHistoryItem, PaymentMethod, formatDate, formatCurrency } from "@/data/mockBilling";
import { getStatusColor } from "@/utils/categoryColors";
import { useWorkspaceStore } from "@/stores";
import { useToast } from "@/components/Toast";

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
    const { currentWorkspace } = useWorkspaceStore();
    const toast = useToast();
    const [currentPlan, setCurrentPlan] = useState("free");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [projectCount, setProjectCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);

    // Fetch subscription and billing data
    const fetchBillingData = useCallback(async () => {
        if (!currentWorkspace) return;
        
        setIsLoading(true);
        try {
            // Fetch workspace details (includes subscription)
            const workspaceRes = await fetch(`/api/workspaces/${currentWorkspace.id}`);
            if (workspaceRes.ok) {
                const data = await workspaceRes.json();
                // Map subscription plan to our plan IDs
                const planMap: Record<string, string> = {
                    'free': 'free',
                    'starter': 'free',
                    'pro': 'pro',
                    'team': 'team',
                    'enterprise': 'team',
                };
                setCurrentPlan(planMap[data.subscription?.plan_id || 'free'] || 'free');
            }

            // Fetch projects count
            const projectsRes = await fetch(`/api/projects?workspace_id=${currentWorkspace.id}`);
            if (projectsRes.ok) {
                const projects = await projectsRes.json();
                setProjectCount(projects.length);
            }

            // Fetch members count
            const membersRes = await fetch(`/api/workspaces/${currentWorkspace.id}/members`);
            if (membersRes.ok) {
                const members = await membersRes.json();
                setMemberCount(members.length);
            }

            // Note: Billing history and payment methods would typically come from Stripe
            // For now, we show empty states until Stripe integration is complete
            setBillingHistory([]);
            setPaymentMethods([]);

        } catch (error) {
            console.error('Error fetching billing data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    const currentPlanData = plans.find((p) => p.id === currentPlan);

    const handleSelectPlan = (plan: Plan) => {
        if (plan.id === currentPlan) return;
        setSelectedPlan(plan);
        setShowUpgradeModal(true);
    };

    const handleConfirmUpgrade = async () => {
        if (!selectedPlan || !currentWorkspace) return;
        
        setIsUpgrading(true);
        try {
            // In production, this would redirect to Stripe Checkout or update via Stripe API
            toast.info("Upgrade", "Stripe integration required for plan upgrades. Contact support.");
            setShowUpgradeModal(false);
        } catch (error) {
            console.error('Error upgrading plan:', error);
            toast.error("Error", "Failed to upgrade plan");
        } finally {
            setIsUpgrading(false);
        }
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
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="plan" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center gap-4 py-4">
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
                    </div>
                </div>
                
                <div className="center">
                    {/* Main Content */}
                    <div className="w-full">

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
                                            <span className="text-small font-medium">{projectCount} / {currentPlanData?.projectLimit === -1 ? "∞" : currentPlanData?.projectLimit}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-b-surface2 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-primary1"
                                                style={{ width: currentPlanData?.projectLimit === -1 ? "10%" : `${Math.min((projectCount / currentPlanData!.projectLimit) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-small text-t-secondary">Team Members</span>
                                            <span className="text-small font-medium">{memberCount} / {currentPlanData?.teamLimit === -1 ? "∞" : currentPlanData?.teamLimit}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-b-surface2 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-green-500"
                                                style={{ width: currentPlanData?.teamLimit === -1 ? "10%" : `${Math.min((memberCount / currentPlanData!.teamLimit) * 100, 100)}%` }}
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

                            {/* Payment Methods */}
                            <div className="mt-8 p-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-body-bold">Payment Methods</h2>
                                    <button className="text-small text-primary1 hover:underline">
                                        Add new
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {paymentMethods.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Icon className="!w-12 !h-12 fill-t-tertiary mb-3" name="wallet" />
                                            <p className="text-small text-t-secondary">No payment methods added</p>
                                            <p className="text-xs text-t-tertiary mt-1">Add a payment method to upgrade your plan</p>
                                        </div>
                                    ) : (
                                    paymentMethods.map((method) => (
                                        <div 
                                            key={method.id}
                                            className={`flex items-center p-4 rounded-2xl bg-b-surface1 ${method.isDefault ? "ring-2 ring-primary1" : ""}`}
                                        >
                                            <div className="flex items-center justify-center size-10 mr-4 rounded-xl bg-b-surface2 fill-t-secondary">
                                                <Icon className="!w-5 !h-5" name="wallet" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-small font-medium text-t-primary">
                                                        {method.brand} •••• {method.last4}
                                                    </span>
                                                    {method.isDefault && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary1/10 text-primary1">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-t-tertiary">
                                                    Expires {method.expiryMonth}/{method.expiryYear}
                                                </p>
                                            </div>
                                            <button className="text-small text-t-tertiary hover:text-t-primary transition-colors">
                                                Edit
                                            </button>
                                        </div>
                                    ))
                                    )}
                                </div>
                            </div>

                            {/* Billing History */}
                            <div className="mt-8 p-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-body-bold">Billing History</h2>
                                    {billingHistory.length > 0 && (
                                        <button className="text-small text-primary1 hover:underline">
                                            Download all
                                        </button>
                                    )}
                                </div>
                                {billingHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl bg-b-surface1">
                                        <Icon className="!w-12 !h-12 fill-t-tertiary mb-3" name="documents" />
                                        <p className="text-small text-t-secondary">No billing history</p>
                                        <p className="text-xs text-t-tertiary mt-1">Your invoices will appear here after your first payment</p>
                                    </div>
                                ) : (
                                <div className="overflow-hidden rounded-2xl bg-b-surface1">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-stroke-subtle">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-t-tertiary uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-t-tertiary uppercase tracking-wider">Description</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-t-tertiary uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-t-tertiary uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-t-tertiary uppercase tracking-wider">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stroke-subtle">
                                            {billingHistory.map((item) => (
                                                <tr key={item.id} className="hover:bg-b-surface2/50 transition-colors">
                                                    <td className="px-4 py-3 text-small text-t-secondary whitespace-nowrap">
                                                        {formatDate(item.date)}
                                                    </td>
                                                    <td className="px-4 py-3 text-small text-t-primary">
                                                        {item.description}
                                                    </td>
                                                    <td className="px-4 py-3 text-small text-t-primary font-medium">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(item.status).bg} ${getStatusColor(item.status).text}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <a 
                                                            href={item.invoiceUrl}
                                                            className="text-small text-primary1 hover:underline"
                                                        >
                                                            Download
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                )}
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
