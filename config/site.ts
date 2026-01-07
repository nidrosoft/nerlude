/**
 * Site Configuration
 * 
 * Centralized configuration for site metadata, SEO, and branding.
 */

export const siteConfig = {
    name: "Nerlude",
    description: "Track every service, credential, and cost across all your projects in one place.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://nerlude.com",
    
    // SEO
    seo: {
        title: "Nerlude - Project Infrastructure Management",
        titleTemplate: "%s | Nerlude",
        description: "Stop juggling logins. Track every service, credential, and cost across all your projects in one place.",
        keywords: [
            "project management",
            "infrastructure tracking",
            "credential management",
            "SaaS management",
            "developer tools",
            "cost tracking",
        ],
    },
    
    // Open Graph
    og: {
        type: "website",
        locale: "en_US",
        siteName: "Nerlude",
        image: "/images/og-image.png",
    },
    
    // Twitter
    twitter: {
        card: "summary_large_image",
        site: "@nerlude",
        creator: "@nerlude",
    },
    
    // Branding
    branding: {
        logo: "/images/Logo-dark.svg",
        logoDark: "/images/Logo-light.svg",
        favicon: "/favicon.ico",
        primaryColor: "#000000",
        accentColor: "#3B82F6",
    },
    
    // Links
    links: {
        github: "https://github.com/nidrosoft/nerlude",
        twitter: "https://twitter.com/nerlude",
        docs: "/docs",
        support: "/support",
        privacy: "/privacy",
        terms: "/terms",
    },
    
    // Features
    features: {
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
        enableNotifications: true,
        enableTeamFeatures: true,
        maxProjectsPerWorkspace: 50,
        maxServicesPerProject: 100,
        maxTeamMembers: 25,
    },
};

export type SiteConfig = typeof siteConfig;
