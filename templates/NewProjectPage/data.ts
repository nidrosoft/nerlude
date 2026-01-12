import { ProjectType } from "@/types";
import { ProjectTemplate, ProjectTypeOption } from "./types";

export const templates: ProjectTemplate[] = [
    {
        id: "saas",
        name: "SaaS Starter",
        description: "Full-stack SaaS with auth, payments, and database",
        icon: "🚀",
        type: "web",
        suggestedServices: ["vercel", "supabase", "clerk", "stripe", "resend"],
    },
    {
        id: "landing",
        name: "Landing Page",
        description: "Marketing site with analytics and forms",
        icon: "📄",
        type: "landing",
        suggestedServices: ["vercel", "posthog", "resend"],
    },
    {
        id: "mobile",
        name: "Mobile App",
        description: "React Native or Flutter app with backend",
        icon: "📱",
        type: "mobile",
        suggestedServices: ["supabase", "clerk", "sentry", "cloudinary"],
    },
    {
        id: "api",
        name: "API / Backend",
        description: "REST or GraphQL API service",
        icon: "⚡",
        type: "api",
        suggestedServices: ["railway", "supabase", "redis", "sentry"],
    },
    {
        id: "extension",
        name: "Browser Extension",
        description: "Chrome or Firefox extension",
        icon: "🧩",
        type: "extension",
        suggestedServices: ["supabase", "posthog", "sentry"],
    },
    {
        id: "blank",
        name: "Blank Project",
        description: "Start from scratch with no pre-selected services",
        icon: "✨",
        type: "web",
        suggestedServices: [],
    },
];

export const projectTypes: ProjectTypeOption[] = [
    { value: "web", label: "Web App", icon: "align-right", color: "bg-blue-500/10 border-blue-500/20 fill-blue-500" },
    { value: "mobile", label: "Mobile App", icon: "mobile", color: "bg-purple-500/10 border-purple-500/20 fill-purple-500" },
    { value: "extension", label: "Browser Extension", icon: "cube", color: "bg-amber-500/10 border-amber-500/20 fill-amber-500" },
    { value: "desktop", label: "Desktop App", icon: "post", color: "bg-green-500/10 border-green-500/20 fill-green-500" },
    { value: "api", label: "API / Backend", icon: "edit", color: "bg-pink-500/10 border-pink-500/20 fill-pink-500" },
    { value: "landing", label: "Landing Page", icon: "external-link", color: "bg-cyan-500/10 border-cyan-500/20 fill-cyan-500" },
    { value: "embedded", label: "Embedded / IoT", icon: "bulb", color: "bg-orange-500/10 border-orange-500/20 fill-orange-500" },
    { value: "game", label: "Game", icon: "star", color: "bg-red-500/10 border-red-500/20 fill-red-500" },
    { value: "ai", label: "AI / ML Project", icon: "generation", color: "bg-violet-500/10 border-violet-500/20 fill-violet-500" },
];

export const emojiOptions = [
    "🚀", "💼", "🎯", "📦", "🔥", "⚡", "🎨", "🛠️", "📱", "🌐", "💡", "🎮",
    "🤖", "🧠", "💎", "🔮", "🎵", "📸", "🛒", "💬", "📊", "🔐",
];

export const serviceNames: Record<string, string> = {
    vercel: "Vercel",
    supabase: "Supabase",
    clerk: "Clerk",
    stripe: "Stripe",
    resend: "Resend",
    posthog: "PostHog",
    sentry: "Sentry",
    cloudinary: "Cloudinary",
    railway: "Railway",
    redis: "Redis Cloud",
};

export const manualSteps = [
    { id: "basics", label: "Basics", number: 1 },
    { id: "template", label: "Template", number: 2 },
    { id: "services", label: "Services", number: 3 },
    { id: "confirm", label: "Confirm", number: 4 },
];

export const documentSteps = [
    { id: "upload", label: "Upload", number: 1 },
    { id: "processing", label: "Analyze", number: 2 },
    { id: "review", label: "Review", number: 3 },
    { id: "confirm-import", label: "Create", number: 4 },
];

export const emailSteps = [
    { id: "email-sync", label: "Connect", number: 1 },
    { id: "email-processing", label: "Sync", number: 2 },
    { id: "review", label: "Review", number: 3 },
    { id: "confirm-import", label: "Create", number: 4 },
];
