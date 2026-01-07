"use client";

import Icon from "@/components/Icon";

const features = [
    {
        icon: "bell",
        title: "Never Miss a Renewal",
        description: "Proactive alerts for domains, SSL certs, and subscriptions before they expire. Get notified 30, 14, and 7 days ahead.",
        color: "primary1",
    },
    {
        icon: "wallet",
        title: "Know Your True Costs",
        description: "See exactly what each product costs to run. Track burn rate per project and identify waste before it adds up.",
        color: "primary2",
    },
    {
        icon: "lock",
        title: "Secure Credentials",
        description: "AES-256 encrypted storage with environment separation. Share with team members without exposing raw secrets.",
        color: "accent",
    },
    {
        icon: "arrow",
        title: "One-Click Context",
        description: "Jump between projects and instantly see everything: credentials, services, status, docs. No more hunting.",
        color: "primary1",
    },
    {
        icon: "users",
        title: "Team Access Control",
        description: "Invite contractors with time-limited access. Revoke when done. Know exactly who has access to what.",
        color: "primary2",
    },
    {
        icon: "edit-list",
        title: "Project Documentation",
        description: "Architecture decisions, notes, and assets—all tied to the project they belong to. Ready for handoff or sale.",
        color: "accent",
    },
];

const colorClasses: Record<string, { bg: string; fill: string }> = {
    primary1: { bg: "bg-primary1/10", fill: "fill-primary1" },
    primary2: { bg: "bg-primary2/10", fill: "fill-primary2" },
    accent: { bg: "bg-accent/10", fill: "fill-accent" },
};

const Features = () => {
    return (
        <div id="features" className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden scroll-mt-20">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary2/10 text-primary2 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary2"></span>
                                Features
                            </div>
                            <h2 className="mb-4 text-h1">
                                Everything you need to stay in control
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                One platform to organize services, credentials, costs, and team access across all your products.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative p-6 rounded-3xl bg-b-surface2 border border-stroke-subtle hover:border-stroke-highlight hover:shadow-hover transition-all duration-300 max-md:p-5"
                                >
                                    <div className={`mb-4 w-12 h-12 rounded-2xl ${colorClasses[feature.color].bg} flex items-center justify-center`}>
                                        <div className={colorClasses[feature.color].fill}>
                                            <Icon name={feature.icon} />
                                        </div>
                                    </div>
                                    <h3 className="mb-2 text-body-lg-bold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-body text-t-secondary">
                                        {feature.description}
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

export default Features;
