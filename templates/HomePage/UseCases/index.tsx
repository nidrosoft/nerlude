"use client";

import Icon from "@/components/Icon";

const personas = [
    {
        icon: "star",
        title: "Portfolio Founders",
        subtitle: "Running 2-8 products?",
        description: "Keep all your apps, domains, and services organized in one place. Never lose track of what powers what.",
        features: ["Multi-project dashboard", "Cost tracking per product", "Renewal alerts"],
        iconBg: "bg-primary1/10",
        iconFill: "fill-primary1",
    },
    {
        icon: "cube",
        title: "Agencies",
        subtitle: "Managing 50+ client projects?",
        description: "Stop the credential chaos. Organize client infrastructure, track costs, and onboard team members safely.",
        features: ["Client project separation", "Team access control", "Billing attribution"],
        iconBg: "bg-primary2/10",
        iconFill: "fill-primary2",
    },
    {
        icon: "users",
        title: "Startup Teams",
        subtitle: "Scaling your engineering team?",
        description: "Onboard engineers in minutes. Offboard contractors securely. Keep your infrastructure documented.",
        features: ["Role-based access", "Time-limited permissions", "Audit logging"],
        iconBg: "bg-accent/10",
        iconFill: "fill-accent",
    },
];

const UseCases = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary2/10 text-primary2 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary2"></span>
                                Who it&apos;s for
                            </div>
                            <h2 className="mb-4 text-h1">
                                Built for builders like you
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Whether you&apos;re a solo founder or leading a team, Nelrude adapts to how you work.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-4">
                            {personas.map((persona, index) => (
                                <div
                                    key={index}
                                    className="group relative flex flex-col p-8 rounded-3xl bg-b-surface2 hover:shadow-hover transition-all duration-300 max-md:p-6"
                                >
                                    <div className={`mb-6 w-14 h-14 rounded-2xl ${persona.iconBg} flex items-center justify-center`}>
                                        <div className={persona.iconFill}>
                                            <Icon name={persona.icon} />
                                        </div>
                                    </div>
                                    <div className="mb-2 text-button text-t-secondary">
                                        {persona.subtitle}
                                    </div>
                                    <h3 className="mb-3 text-h5">
                                        {persona.title}
                                    </h3>
                                    <p className="mb-6 text-body text-t-secondary flex-1">
                                        {persona.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {persona.features.map((feature, featureIndex) => (
                                            <span
                                                key={featureIndex}
                                                className="px-3 py-1.5 rounded-full text-small bg-b-subtle text-t-secondary"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseCases;
