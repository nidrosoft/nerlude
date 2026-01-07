/**
 * Service Categories
 * 
 * Consolidated from 18 categories to 8 primary categories with sub-categories.
 * This reduces cognitive load while maintaining granular organization.
 */

import { ServiceCategory, ServiceSubCategory } from "@/types";

export interface SubCategoryInfo {
    slug: ServiceSubCategory;
    name: string;
    description: string;
}

export interface CategoryInfo {
    slug: ServiceCategory;
    name: string;
    description: string;
    icon: string;
    color: string; // Tailwind color class for visual distinction
    subCategories: SubCategoryInfo[];
}

export const serviceCategories: CategoryInfo[] = [
    {
        slug: "infrastructure",
        name: "Infrastructure",
        description: "Hosting, databases, storage, and cloud services",
        icon: "cube",
        color: "blue",
        subCategories: [
            { slug: "hosting", name: "Hosting", description: "Web hosting and deployment platforms" },
            { slug: "database", name: "Database", description: "SQL, NoSQL, and serverless databases" },
            { slug: "storage", name: "Storage", description: "File storage and object storage" },
            { slug: "cdn", name: "CDN", description: "Content delivery networks" },
            { slug: "serverless", name: "Serverless", description: "Serverless functions and edge computing" },
        ],
    },
    {
        slug: "identity",
        name: "Identity & Access",
        description: "Authentication, authorization, and security",
        icon: "lock",
        color: "purple",
        subCategories: [
            { slug: "authentication", name: "Authentication", description: "User login and identity management" },
            { slug: "security", name: "Security", description: "Security tools and compliance" },
            { slug: "secrets", name: "Secrets", description: "Secret and credential management" },
        ],
    },
    {
        slug: "payments",
        name: "Payments",
        description: "Payment processing, subscriptions, and billing",
        icon: "wallet",
        color: "green",
        subCategories: [
            { slug: "payment_processing", name: "Payment Processing", description: "Accept payments and process transactions" },
            { slug: "subscriptions", name: "Subscriptions", description: "Recurring billing and subscription management" },
            { slug: "invoicing", name: "Invoicing", description: "Invoice generation and management" },
        ],
    },
    {
        slug: "communications",
        name: "Communications",
        description: "Email, SMS, push notifications, and messaging",
        icon: "envelope",
        color: "orange",
        subCategories: [
            { slug: "email", name: "Email", description: "Transactional and marketing email" },
            { slug: "sms", name: "SMS", description: "Text messaging services" },
            { slug: "push", name: "Push Notifications", description: "Mobile and web push notifications" },
            { slug: "chat", name: "Chat", description: "Real-time chat and messaging" },
            { slug: "video", name: "Video", description: "Video calling and conferencing" },
        ],
    },
    {
        slug: "analytics",
        name: "Analytics & Monitoring",
        description: "Product analytics, error tracking, and observability",
        icon: "post",
        color: "cyan",
        subCategories: [
            { slug: "product_analytics", name: "Product Analytics", description: "User behavior and product metrics" },
            { slug: "error_tracking", name: "Error Tracking", description: "Error monitoring and crash reporting" },
            { slug: "logging", name: "Logging", description: "Log management and analysis" },
            { slug: "uptime", name: "Uptime Monitoring", description: "Uptime and performance monitoring" },
        ],
    },
    {
        slug: "domains",
        name: "Domains & DNS",
        description: "Domain registration, DNS, and SSL certificates",
        icon: "globe",
        color: "teal",
        subCategories: [
            { slug: "registrar", name: "Domain Registrar", description: "Domain name registration" },
            { slug: "dns", name: "DNS", description: "DNS management and routing" },
            { slug: "ssl", name: "SSL/TLS", description: "SSL certificates and HTTPS" },
        ],
    },
    {
        slug: "distribution",
        name: "Distribution",
        description: "App stores, marketing, and customer support",
        icon: "share",
        color: "pink",
        subCategories: [
            { slug: "app_store", name: "App Stores", description: "Mobile and desktop app distribution" },
            { slug: "marketing", name: "Marketing", description: "Marketing automation and campaigns" },
            { slug: "support", name: "Support", description: "Customer support and help desk" },
        ],
    },
    {
        slug: "devtools",
        name: "Developer Tools",
        description: "Development, AI, collaboration, and productivity tools",
        icon: "edit",
        color: "gray",
        subCategories: [
            { slug: "version_control", name: "Version Control", description: "Code hosting and version control" },
            { slug: "ci_cd", name: "CI/CD", description: "Continuous integration and deployment" },
            { slug: "ai_ml", name: "AI & ML", description: "AI models and machine learning APIs" },
            { slug: "cms", name: "CMS", description: "Content management systems" },
            { slug: "search", name: "Search", description: "Search engines and indexing" },
            { slug: "media", name: "Media", description: "Image, video, and audio processing" },
            { slug: "collaboration", name: "Collaboration", description: "Team collaboration and project management" },
        ],
    },
    {
        slug: "other",
        name: "Other",
        description: "Custom or uncategorized services",
        icon: "plus",
        color: "slate",
        subCategories: [
            { slug: "custom", name: "Custom", description: "Custom services not in other categories" },
        ],
    },
];

// Legacy category mapping for backward compatibility
export const legacyCategoryMapping: Record<string, { category: ServiceCategory; subCategory: ServiceSubCategory }> = {
    hosting: { category: "infrastructure", subCategory: "hosting" },
    database: { category: "infrastructure", subCategory: "database" },
    storage: { category: "infrastructure", subCategory: "storage" },
    domain: { category: "domains", subCategory: "registrar" },
    auth: { category: "identity", subCategory: "authentication" },
    security: { category: "identity", subCategory: "security" },
    payments: { category: "payments", subCategory: "payment_processing" },
    email: { category: "communications", subCategory: "email" },
    communication: { category: "communications", subCategory: "chat" },
    analytics: { category: "analytics", subCategory: "product_analytics" },
    monitoring: { category: "analytics", subCategory: "error_tracking" },
    ai: { category: "devtools", subCategory: "ai_ml" },
    devtools: { category: "devtools", subCategory: "version_control" },
    cms: { category: "devtools", subCategory: "cms" },
    search: { category: "devtools", subCategory: "search" },
    media: { category: "devtools", subCategory: "media" },
    marketing: { category: "distribution", subCategory: "marketing" },
    appstores: { category: "distribution", subCategory: "app_store" },
    other: { category: "other", subCategory: "custom" },
};

export const getCategoryBySlug = (slug: ServiceCategory): CategoryInfo | undefined => {
    return serviceCategories.find((c) => c.slug === slug);
};

export const getCategoryName = (slug: ServiceCategory): string => {
    return getCategoryBySlug(slug)?.name || slug;
};

export const getSubCategoryBySlug = (
    categorySlug: ServiceCategory, 
    subCategorySlug: ServiceSubCategory
): SubCategoryInfo | undefined => {
    const category = getCategoryBySlug(categorySlug);
    return category?.subCategories.find((sc) => sc.slug === subCategorySlug);
};

export const getSubCategoryName = (
    categorySlug: ServiceCategory, 
    subCategorySlug: ServiceSubCategory
): string => {
    return getSubCategoryBySlug(categorySlug, subCategorySlug)?.name || subCategorySlug;
};

export const getAllSubCategories = (): SubCategoryInfo[] => {
    return serviceCategories.flatMap((c) => c.subCategories);
};

export const getCategoryColor = (slug: ServiceCategory): string => {
    return getCategoryBySlug(slug)?.color || "gray";
};
