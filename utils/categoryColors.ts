import { ServiceCategory } from "@/types";

export interface CategoryColorConfig {
    bg: string;
    border: string;
    icon: string;
}

export const categoryColors: Record<string, CategoryColorConfig> = {
    // Primary categories
    infrastructure: { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "fill-blue-500" },
    identity: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "fill-purple-500" },
    payments: { bg: "bg-green-500/10", border: "border-green-500/20", icon: "fill-green-500" },
    communications: { bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "fill-orange-500" },
    analytics: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "fill-cyan-500" },
    domains: { bg: "bg-teal-500/10", border: "border-teal-500/20", icon: "fill-teal-500" },
    distribution: { bg: "bg-pink-500/10", border: "border-pink-500/20", icon: "fill-pink-500" },
    devtools: { bg: "bg-slate-500/10", border: "border-slate-500/20", icon: "fill-slate-500" },
    other: { bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "fill-gray-500" },
    // Sub-categories (used in service registry) - all distinct colors
    hosting: { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "fill-blue-500" },
    database: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "fill-emerald-500" },
    storage: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "fill-amber-500" },
    domain: { bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "fill-violet-500" },
    auth: { bg: "bg-rose-500/10", border: "border-rose-500/20", icon: "fill-rose-500" },
    email: { bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "fill-orange-500" },
    monitoring: { bg: "bg-teal-500/10", border: "border-teal-500/20", icon: "fill-teal-500" },
    ai: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", icon: "fill-fuchsia-500" },
    appstores: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: "fill-indigo-500" },
    custom: { bg: "bg-slate-500/10", border: "border-slate-500/20", icon: "fill-slate-500" },
};

export const getCategoryColor = (category: string): CategoryColorConfig => {
    return categoryColors[category] || { bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "fill-gray-500" };
};

export const statusColors = {
    active: { bg: "bg-green-500/10", text: "text-green-600", dot: "bg-green-500" },
    paused: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
    inactive: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-500" },
    error: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
    // Billing statuses
    paid: { bg: "bg-green-500/10", text: "text-green-600", dot: "bg-green-500" },
    pending: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
    failed: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
};

export const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.inactive;
};
