"use client";

import Icon from "@/components/Icon";
import Image from "@/components/Image";

const caseStudies = [
    {
        metric: "10+ hours",
        metricLabel: "saved per month",
        quote: "I used to spend hours hunting for credentials and checking renewal dates. Now it's all in one place.",
        author: "David Chen",
        role: "Indie Hacker",
        avatar: "/images/avatar-1.png",
        highlight: "Manages 12 SaaS products",
    },
    {
        metric: "$2,400",
        metricLabel: "saved yearly",
        quote: "Caught two forgotten subscriptions I was still paying for. Nerlude paid for itself in the first week.",
        author: "Marcus Johnson",
        role: "Agency Owner",
        avatar: "/images/avatar-2.png",
        highlight: "Runs 8 client projects",
    },
    {
        metric: "1 place",
        metricLabel: "for everything",
        quote: "No more juggling Notion, spreadsheets, and password managers. All my credentials and services live in one dashboard.",
        author: "Alex Rivera",
        role: "Startup Founder",
        avatar: "/images/avatar-3.png",
        highlight: "3 products, 45 services",
    },
];

const CaseStudies = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-10 text-center max-md:text-left max-md:mb-8">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary2/10 text-primary2 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary2"></span>
                                Real Results
                            </div>
                            <h2 className="mb-4 text-h2">
                                See what founders are achieving
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Real numbers from real users who switched to Nerlude.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
                            {caseStudies.map((study, index) => (
                                <div
                                    key={index}
                                    className="relative p-6 pt-14 rounded-3xl bg-b-surface2 border border-stroke-subtle hover:border-stroke-highlight transition-all duration-300"
                                >
                                    <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-primary1/10 text-xs text-primary1">
                                        {study.highlight}
                                    </div>

                                    <div className="mb-6">
                                        <div className="text-h1 text-primary1 mb-1">{study.metric}</div>
                                        <div className="text-small text-t-tertiary">{study.metricLabel}</div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <Icon className="!w-6 !h-6 fill-t-tertiary mb-3" name="quote" />
                                        <p className="text-body text-t-secondary italic">
                                            "{study.quote}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-stroke-subtle">
                                        <Image
                                            className="w-10 h-10 rounded-full opacity-100"
                                            src={study.avatar}
                                            width={40}
                                            height={40}
                                            alt={study.author}
                                        />
                                        <div>
                                            <div className="text-small font-medium text-t-primary">{study.author}</div>
                                            <div className="text-xs text-t-tertiary">{study.role}</div>
                                        </div>
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

export default CaseStudies;
