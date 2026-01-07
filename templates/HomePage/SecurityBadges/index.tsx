"use client";

import Icon from "@/components/Icon";

const badges = [
    {
        icon: "lock",
        title: "Bank-Level Encryption",
        description: "AES-256 encrypted credentials",
    },
    {
        icon: "verification",
        title: "SOC 2 Ready",
        description: "Enterprise security practices",
    },
    {
        icon: "shield",
        title: "GDPR Compliant",
        description: "Your data stays yours",
    },
    {
        icon: "chart",
        title: "99.9% Uptime",
        description: "Always available",
    },
];

const SecurityBadges = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-10 text-center max-md:text-left max-md:mb-8">
                            <div className="relative inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-button">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Security First
                            </div>
                            <h2 className="mb-4 text-h2">
                                Your credentials are safe with us
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                We take security seriously. Your data is encrypted at rest and in transit.
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {badges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center p-6 rounded-3xl bg-b-surface2 border border-stroke-subtle"
                                >
                                    <div className="mb-4 w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                        <div className="fill-green-500">
                                            <Icon className="!w-6 !h-6" name={badge.icon} />
                                        </div>
                                    </div>
                                    <h3 className="mb-1 text-body-bold">
                                        {badge.title}
                                    </h3>
                                    <p className="text-small text-t-secondary">
                                        {badge.description}
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

export default SecurityBadges;
