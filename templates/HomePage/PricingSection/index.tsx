"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

const plans = [
    {
        name: "Free",
        price: 0,
        period: "forever",
        description: "Perfect for getting started with your first project.",
        features: [
            "1 project",
            "1 team member",
            "Basic renewal alerts",
            "Credential storage",
            "Community support",
        ],
        cta: "Get started free",
        popular: false,
        color: "default",
    },
    {
        name: "Pro",
        price: 19.99,
        period: "per month",
        description: "For founders managing multiple products.",
        features: [
            "10 projects",
            "5 team members",
            "Advanced alerts (email + Slack)",
            "Cost tracking & analytics",
            "Environment separation",
            "Priority support",
        ],
        cta: "Start free trial",
        popular: true,
        color: "primary1",
    },
    {
        name: "Team",
        price: 39.99,
        period: "per month",
        description: "For agencies and growing teams.",
        features: [
            "Unlimited projects",
            "Unlimited team members",
            "All Pro features",
            "Role-based access control",
            "Audit logging",
            "API access",
            "Dedicated support",
        ],
        cta: "Start free trial",
        popular: false,
        color: "primary2",
    },
];

const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);

    const getPrice = (price: number) => {
        if (price === 0) return "0";
        const finalPrice = isYearly ? price * 0.9 : price;
        return finalPrice.toFixed(2);
    };

    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary2/10 text-primary2 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary2"></span>
                                Pricing
                            </div>
                            <h2 className="mb-4 text-h1">
                                Simple pricing for founders and teams
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Start free, upgrade when you grow. No hidden fees, cancel anytime.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <span className={`text-body ${!isYearly ? "text-t-primary" : "text-t-secondary"}`}>
                                Monthly
                            </span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className="relative w-14 h-8 rounded-full bg-b-dark1 p-1 transition-colors"
                            >
                                <div
                                    className={`w-6 h-6 rounded-full bg-b-surface2 shadow-md transition-transform duration-200 ${
                                        isYearly ? "translate-x-6" : "translate-x-0"
                                    }`}
                                />
                            </button>
                            <span className={`text-body ${isYearly ? "text-t-primary" : "text-t-secondary"}`}>
                                Yearly
                            </span>
                            <span className={`px-2 py-1 rounded-full bg-primary2/10 text-primary2 text-small transition-opacity ${isYearly ? "opacity-100" : "opacity-0"}`}>
                                Save 10%
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-4">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`group relative flex flex-col p-8 rounded-3xl bg-b-surface2 border transition-all duration-300 max-md:p-6 ${
                                        plan.popular
                                            ? "border-primary1/40 shadow-hover"
                                            : "border-stroke-subtle hover:border-stroke-highlight hover:shadow-hover"
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary1 text-t-light text-small font-bold">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-h5">{plan.name}</h3>
                                        <p className="text-body text-t-secondary">{plan.description}</p>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-h2">${getPrice(plan.price)}</span>
                                            <span className="text-body text-t-secondary">/{plan.period}</span>
                                        </div>
                                        {isYearly && plan.price > 0 && (
                                            <div className="mt-1 text-small text-primary2">
                                                Billed ${(plan.price * 0.9 * 12).toFixed(0)}/year
                                            </div>
                                        )}
                                    </div>
                                    <ul className="mb-8 flex-1 space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-primary2/20 flex items-center justify-center shrink-0">
                                                    <svg className="w-3 h-3 text-primary2" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span className="text-body">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        isSecondary={plan.popular}
                                        isStroke={!plan.popular}
                                        as="link"
                                        href="/onboarding"
                                    >
                                        {plan.cta}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center text-body text-t-secondary">
                            All plans include a 14-day free trial. No credit card required.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
