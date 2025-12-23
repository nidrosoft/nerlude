"use client";

import Icon from "@/components/Icon";

type FeatureStatus = boolean | "partial";

interface Feature {
    name: string;
    notion: FeatureStatus;
    onepassword: FeatureStatus;
    nelrude: FeatureStatus;
}

const features: Feature[] = [
    { name: "Project organization", notion: false, onepassword: false, nelrude: true },
    { name: "Renewal alerts", notion: false, onepassword: false, nelrude: true },
    { name: "Cost tracking", notion: false, onepassword: false, nelrude: true },
    { name: "Credential encryption", notion: false, onepassword: true, nelrude: true },
    { name: "Team access control", notion: "partial", onepassword: true, nelrude: true },
    { name: "Environment separation", notion: false, onepassword: false, nelrude: true },
    { name: "Service registry", notion: false, onepassword: false, nelrude: true },
    { name: "Per-project costs", notion: false, onepassword: false, nelrude: true },
];

const StatusIcon = ({ status }: { status: boolean | "partial" }) => {
    if (status === true) {
        return (
            <div className="w-7 h-7 rounded-full bg-primary2/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        );
    }
    if (status === "partial") {
        return (
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
            </div>
        );
    }
    return (
        <div className="w-7 h-7 rounded-full bg-t-tertiary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-t-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    );
};

const Comparison = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary1/10 text-primary1 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary1"></span>
                                Why Nelrude?
                            </div>
                            <h2 className="mb-4 text-h1">
                                The tool you&apos;ve been missing
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Notion is great for docs. 1Password is great for passwords. Nelrude is built specifically for product infrastructure.
                            </p>
                        </div>
                        <div className="relative p-1.5 border-[1.5px] border-stroke-subtle rounded-4xl overflow-hidden">
                            <div className="rounded-3xl bg-b-surface2 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-stroke-subtle">
                                                <th className="p-6 text-left text-body-bold max-md:p-4">Feature</th>
                                                <th className="p-6 text-center text-body-bold max-md:p-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-t-secondary">Notion</span>
                                                    </div>
                                                </th>
                                                <th className="p-6 text-center text-body-bold max-md:p-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-t-secondary">1Password</span>
                                                    </div>
                                                </th>
                                                <th className="p-6 text-center text-body-bold bg-primary1/5 max-md:p-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-primary1">Nelrude</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {features.map((feature, index) => (
                                                <tr
                                                    key={index}
                                                    className={index !== features.length - 1 ? "border-b border-stroke-subtle" : ""}
                                                >
                                                    <td className="p-6 text-body max-md:p-4">{feature.name}</td>
                                                    <td className="p-6 max-md:p-4">
                                                        <div className="flex justify-center">
                                                            <StatusIcon status={feature.notion} />
                                                        </div>
                                                    </td>
                                                    <td className="p-6 max-md:p-4">
                                                        <div className="flex justify-center">
                                                            <StatusIcon status={feature.onepassword} />
                                                        </div>
                                                    </td>
                                                    <td className="p-6 bg-primary1/5 max-md:p-4">
                                                        <div className="flex justify-center">
                                                            <StatusIcon status={feature.nelrude} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comparison;
