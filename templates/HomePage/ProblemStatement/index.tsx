"use client";

import Icon from "@/components/Icon";

const painPoints = [
    {
        icon: "wallet",
        title: "$847/month bleeding on forgotten tools",
        description: "That analytics tool from 2022. The premium plan for 2 users. Money vanishing every month.",
        iconBg: "bg-primary3/10",
        iconFill: "fill-primary3",
    },
    {
        icon: "lock",
        title: "3am panic: 'Where's the API key?'",
        description: "Digging through Slack, Notion, emails while production is down and users are leaving.",
        iconBg: "bg-accent/10",
        iconFill: "fill-accent",
    },
    {
        icon: "cube",
        title: "Credentials in 47 different places",
        description: "Onboarding a new dev takes 2 days because nobody knows where anything lives.",
        iconBg: "bg-primary1/10",
        iconFill: "fill-primary1",
    },
    {
        icon: "clock",
        title: "'Wait, that renewed yesterday?'",
        description: "Finding out from your credit card statement, not before. Every. Single. Time.",
        iconBg: "bg-accent2/10",
        iconFill: "fill-accent2",
    },
    {
        icon: "users",
        title: "Client handoffs are a nightmare",
        description: "Agencies: spending hours compiling credentials when a project ends. There has to be a better way.",
        iconBg: "bg-primary2/10",
        iconFill: "fill-primary2",
    },
    {
        icon: "chart",
        title: "No idea what you're actually spending",
        description: "Is it $500/month? $2,000? You genuinely don't know until tax season hits.",
        iconBg: "bg-primary1/10",
        iconFill: "fill-primary1",
    },
];

const ProblemStatement = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary3/10 text-primary3 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary3 animate-pulse"></span>
                                Sound familiar?
                            </div>
                            <h2 className="mb-4 text-h1">
                                You&apos;re losing money on tools you forgot exist
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Every founder and agency knows this pain. Scattered credentials, surprise charges, and the constant fear of missing a renewal.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {painPoints.map((point, index) => (
                                <div
                                    key={index}
                                    className="group relative p-6 rounded-3xl bg-b-surface2 border border-stroke-subtle hover:border-primary3/30 transition-all duration-300 max-md:p-5"
                                >
                                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary3/10 flex items-center justify-center max-md:top-5 max-md:right-5">
                                        <span className="text-primary3 text-body-lg-bold">{index + 1}</span>
                                    </div>
                                    <div className={`mb-4 w-12 h-12 rounded-2xl ${point.iconBg} flex items-center justify-center`}>
                                        <div className={point.iconFill}>
                                            <Icon name={point.icon} />
                                        </div>
                                    </div>
                                    <h3 className="mb-2 text-body-lg-bold pr-10">
                                        {point.title}
                                    </h3>
                                    <p className="text-body text-t-secondary">
                                        {point.description}
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

export default ProblemStatement;
