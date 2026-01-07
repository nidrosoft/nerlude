import { ServiceStack } from "@/types";

export const mockStacks: ServiceStack[] = [
    // ============================================
    // SaaS Dashboard (project 1) - Full Stack App
    // ============================================
    {
        id: "stack-1-frontend",
        projectId: "1",
        name: "Frontend Stack",
        description: "Web application frontend services",
        color: "blue",
        icon: "code",
        order: 1,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },
    {
        id: "stack-1-backend",
        projectId: "1",
        name: "Backend Stack",
        description: "API and database services",
        color: "purple",
        icon: "cube",
        order: 2,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },
    {
        id: "stack-1-payments",
        projectId: "1",
        name: "Payments Stack",
        description: "Payment processing and billing",
        color: "green",
        icon: "wallet",
        order: 3,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },
    {
        id: "stack-1-observability",
        projectId: "1",
        name: "Observability Stack",
        description: "Monitoring, logging, and error tracking",
        color: "orange",
        icon: "post",
        order: 4,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },

    // ============================================
    // Mobile App (project 2)
    // ============================================
    {
        id: "stack-2-app",
        projectId: "2",
        name: "App Infrastructure",
        description: "Mobile app backend and services",
        color: "cyan",
        icon: "mobile",
        order: 1,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },
    {
        id: "stack-2-distribution",
        projectId: "2",
        name: "Distribution",
        description: "App stores and marketing",
        color: "pink",
        icon: "share",
        order: 2,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },

    // ============================================
    // API Service (project 3)
    // ============================================
    {
        id: "stack-3-core",
        projectId: "3",
        name: "Core API",
        description: "Main API infrastructure",
        color: "teal",
        icon: "cube",
        order: 1,
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-12-19T00:00:00Z",
    },
];

// Stack colors for UI
export const stackColors: Record<string, { bg: string; border: string; text: string; fill: string }> = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600", fill: "fill-blue-600" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600", fill: "fill-purple-600" },
    green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-600", fill: "fill-green-600" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-600", fill: "fill-orange-600" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600", fill: "fill-cyan-600" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-600", fill: "fill-pink-600" },
    teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600", fill: "fill-teal-600" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600", fill: "fill-amber-600" },
    red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-600", fill: "fill-red-600" },
    slate: { bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-600", fill: "fill-slate-600" },
};
