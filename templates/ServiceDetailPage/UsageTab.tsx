"use client";

import Icon from "@/components/Icon";
import { UsageStat } from "./types";

interface BillingHistoryItem {
    date: string;
    desc: string;
    amount: string;
    status: string;
}

interface UsageTabProps {
    usageStats: UsageStat[];
    billingHistory?: BillingHistoryItem[];
}

const UsageTab = ({ usageStats, billingHistory = [] }: UsageTabProps) => {
    return (
        <>
            {/* Usage Stats Grid */}
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                {usageStats.map((stat) => (
                    <div key={stat.label} className="p-5 rounded-3xl bg-b-surface2">
                        <div className="text-small text-t-secondary mb-1">{stat.label}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-h3">{stat.value}</span>
                            {stat.change && (
                                <span className={`flex items-center gap-1 text-xs font-medium ${
                                    stat.trend === "up" ? "text-green-500" : 
                                    stat.trend === "down" ? "text-red-500" : "text-t-tertiary"
                                }`}>
                                    <Icon className="!w-3 !h-3" name={stat.trend === "up" ? "arrow-up" : "arrow-down"} />
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Usage Chart Placeholder */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-body-bold">Usage Over Time</h3>
                    <div className="flex gap-2">
                        {["7d", "30d", "90d"].map((period) => (
                            <button
                                key={period}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-b-surface1 text-t-secondary hover:text-t-primary transition-colors"
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-center h-64 rounded-2xl bg-b-surface1">
                    <div className="text-center">
                        <Icon className="!w-12 !h-12 fill-t-tertiary mx-auto mb-3" name="chart" />
                        <p className="text-small text-t-secondary">Usage chart visualization</p>
                        <p className="text-xs text-t-tertiary mt-1">Coming soon</p>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">Billing History</h3>
                {billingHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl bg-b-surface1">
                        <Icon className="!w-10 !h-10 fill-t-tertiary mb-2" name="documents" />
                        <p className="text-small text-t-secondary">No billing history</p>
                        <p className="text-xs text-t-tertiary mt-1">Service billing records will appear here</p>
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-stroke-subtle">
                                <th className="text-left text-xs font-medium text-t-tertiary uppercase tracking-wider py-3 px-4">Date</th>
                                <th className="text-left text-xs font-medium text-t-tertiary uppercase tracking-wider py-3 px-4">Description</th>
                                <th className="text-left text-xs font-medium text-t-tertiary uppercase tracking-wider py-3 px-4">Amount</th>
                                <th className="text-left text-xs font-medium text-t-tertiary uppercase tracking-wider py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingHistory.map((item: BillingHistoryItem, index: number) => (
                                <tr key={index} className="border-b border-stroke-subtle last:border-0">
                                    <td className="py-3 px-4 text-small text-t-secondary">{item.date}</td>
                                    <td className="py-3 px-4 text-small text-t-primary">{item.desc}</td>
                                    <td className="py-3 px-4 text-small text-t-primary font-medium">{item.amount}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600 capitalize">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </>
    );
};

export default UsageTab;
