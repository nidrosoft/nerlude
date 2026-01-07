"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";

const trustItems = [
    {
        icon: "wallet",
        title: "30-Day Money Back",
        description: "Full refund, no questions asked.",
    },
    {
        icon: "chart",
        title: "99.9% Uptime SLA",
        description: "Always accessible when you need it.",
    },
    {
        icon: "chat",
        title: "Priority Support",
        description: "Real humans, within 24 hours.",
    },
    {
        icon: "export",
        title: "Data Export Anytime",
        description: "Export everything with one click.",
    },
];

const TrustElements = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="p-8 rounded-4xl bg-gradient-to-r from-b-surface2 to-b-surface3 border border-stroke-subtle max-md:p-6">
                            <div className="grid grid-cols-2 gap-8 items-center max-lg:grid-cols-1">
                                <div>
                                    <h2 className="mb-4 text-h2">
                                        Risk-free guarantee
                                    </h2>
                                    <p className="mb-6 text-body-lg text-t-secondary">
                                        We're confident you'll love Nerlude. But if it's not the right fit, 
                                        we'll refund your payment—no questions asked.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Button isPrimary as="link" href="/signup">
                                            Start for Free
                                        </Button>
                                        <Button isStroke as="link" href="#pricing">
                                            View Pricing
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                    {trustItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-4 rounded-2xl bg-b-surface1 border border-stroke-subtle"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary1/10 shrink-0">
                                                <Icon className="!w-5 !h-5 fill-primary1" name={item.icon} />
                                            </div>
                                            <div>
                                                <div className="text-small font-medium text-t-primary mb-0.5">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-t-tertiary">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustElements;
