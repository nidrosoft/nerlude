"use client";

import Icon from "@/components/Icon";

const steps = [
    {
        number: "01",
        icon: "cube",
        title: "Create a Project",
        description: "Add your app, website, API, or any software product. Give it a name, pick an icon, and you're ready to go.",
        color: "primary1",
    },
    {
        number: "02",
        icon: "plus",
        title: "Add Your Services",
        description: "Connect hosting, database, domains, payments, and more. We support 100+ services with smart defaults.",
        color: "primary2",
    },
    {
        number: "03",
        icon: "bell",
        title: "Stay in Control",
        description: "Get renewal alerts, track costs, manage credentials, and share access with your team—all from one place.",
        color: "accent",
    },
];

const colorClasses: Record<string, { bg: string; fill: string; text: string }> = {
    primary1: { bg: "bg-primary1/10", fill: "fill-primary1", text: "text-t-tertiary" },
    primary2: { bg: "bg-primary2/10", fill: "fill-primary2", text: "text-t-tertiary" },
    accent: { bg: "bg-accent/10", fill: "fill-accent", text: "text-t-tertiary" },
};

const HowItWorks = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary1/10 text-primary1 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary1"></span>
                                How it works
                            </div>
                            <h2 className="mb-4 text-h1">
                                Get started in 3 simple steps
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                No complex setup. No learning curve. Just organize your infrastructure and get back to building.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-4">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-3xl bg-b-surface2 hover:shadow-hover transition-all duration-300 max-md:p-6"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${colorClasses[step.color].bg} flex items-center justify-center`}>
                                            <div className={colorClasses[step.color].fill}>
                                                <Icon name={step.icon} />
                                            </div>
                                        </div>
                                        <span className={`text-h2 font-bold ${colorClasses[step.color].text} opacity-20`}>
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-h5">
                                        {step.title}
                                    </h3>
                                    <p className="text-body text-t-secondary">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
