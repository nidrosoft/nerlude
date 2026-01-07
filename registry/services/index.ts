/**
 * Service Registry
 * 
 * Predefined catalog of services that Nerlude understands.
 * Provides service metadata, plans, and credential schemas.
 */

import { ServiceCategory } from "@/types";

export interface CredentialField {
    key: string;
    label: string;
    type: "text" | "password" | "email" | "url";
    placeholder?: string;
    required: boolean;
    sensitive?: boolean;
    helpText?: string;
}

export interface ServicePlan {
    id: string;
    name: string;
    price: number;
    frequency: "monthly" | "yearly" | "one-time";
    features?: string[];
}

export interface ServiceRegistryItem {
    id: string;
    slug: string;
    name: string;
    category: ServiceCategory;
    description: string;
    website: string;
    docsUrl?: string;
    statusPageUrl?: string;
    logoUrl?: string;
    defaultPlan?: string;
    plans: ServicePlan[];
    credentialFields: CredentialField[];
    defaultQuickLinks?: {
        label: string;
        url: string;
    }[];
}

export const serviceRegistry: ServiceRegistryItem[] = [
    // Hosting
    {
        id: "vercel",
        slug: "vercel",
        name: "Vercel",
        category: "hosting",
        description: "Deploy web projects with zero configuration",
        website: "https://vercel.com",
        docsUrl: "https://vercel.com/docs",
        statusPageUrl: "https://www.vercel-status.com",
        plans: [
            { id: "hobby", name: "Hobby", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 20, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true, sensitive: true },
            { key: "team_id", label: "Team ID", type: "text", required: false },
        ],
        defaultQuickLinks: [
            { label: "Dashboard", url: "https://vercel.com/dashboard" },
            { label: "Docs", url: "https://vercel.com/docs" },
        ],
    },
    {
        id: "railway",
        slug: "railway",
        name: "Railway",
        category: "hosting",
        description: "Infrastructure platform for deploying apps",
        website: "https://railway.app",
        docsUrl: "https://docs.railway.app",
        plans: [
            { id: "hobby", name: "Hobby", price: 5, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 20, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "netlify",
        slug: "netlify",
        name: "Netlify",
        category: "hosting",
        description: "Build and deploy modern web projects",
        website: "https://netlify.com",
        docsUrl: "https://docs.netlify.com",
        plans: [
            { id: "starter", name: "Starter", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 19, frequency: "monthly" },
            { id: "business", name: "Business", price: 99, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "access_token", label: "Access Token", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "aws",
        slug: "aws",
        name: "AWS",
        category: "hosting",
        description: "Amazon Web Services cloud platform",
        website: "https://aws.amazon.com",
        docsUrl: "https://docs.aws.amazon.com",
        statusPageUrl: "https://health.aws.amazon.com",
        plans: [
            { id: "payg", name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "access_key_id", label: "Access Key ID", type: "text", required: true },
            { key: "secret_access_key", label: "Secret Access Key", type: "password", required: true, sensitive: true },
            { key: "region", label: "Region", type: "text", placeholder: "us-east-1", required: true },
        ],
    },
    // Database
    {
        id: "supabase",
        slug: "supabase",
        name: "Supabase",
        category: "database",
        description: "Open source Firebase alternative with Postgres",
        website: "https://supabase.com",
        docsUrl: "https://supabase.com/docs",
        statusPageUrl: "https://status.supabase.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 25, frequency: "monthly" },
            { id: "team", name: "Team", price: 599, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "project_url", label: "Project URL", type: "url", required: true },
            { key: "anon_key", label: "Anon Key", type: "password", required: true },
            { key: "service_role_key", label: "Service Role Key", type: "password", required: false, sensitive: true },
        ],
    },
    {
        id: "planetscale",
        slug: "planetscale",
        name: "PlanetScale",
        category: "database",
        description: "Serverless MySQL platform",
        website: "https://planetscale.com",
        docsUrl: "https://planetscale.com/docs",
        plans: [
            { id: "hobby", name: "Hobby", price: 0, frequency: "monthly" },
            { id: "scaler", name: "Scaler", price: 29, frequency: "monthly" },
            { id: "scaler-pro", name: "Scaler Pro", price: 59, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "database_url", label: "Database URL", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "mongodb",
        slug: "mongodb",
        name: "MongoDB Atlas",
        category: "database",
        description: "Cloud-hosted MongoDB service",
        website: "https://mongodb.com/atlas",
        docsUrl: "https://www.mongodb.com/docs/atlas",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "serverless", name: "Serverless", price: 0, frequency: "monthly" },
            { id: "dedicated", name: "Dedicated", price: 57, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "connection_string", label: "Connection String", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "neon",
        slug: "neon",
        name: "Neon",
        category: "database",
        description: "Serverless Postgres with branching",
        website: "https://neon.tech",
        docsUrl: "https://neon.tech/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 19, frequency: "monthly" },
            { id: "business", name: "Business", price: 69, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "connection_string", label: "Connection String", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "upstash",
        slug: "upstash",
        name: "Upstash",
        category: "database",
        description: "Serverless Redis and Kafka",
        website: "https://upstash.com",
        docsUrl: "https://upstash.com/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "payg", name: "Pay as you go", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 280, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "redis_url", label: "Redis URL", type: "password", required: true, sensitive: true },
            { key: "redis_token", label: "Redis Token", type: "password", required: false, sensitive: true },
        ],
    },
    // Domain
    {
        id: "namecheap",
        slug: "namecheap",
        name: "Namecheap",
        category: "domain",
        description: "Domain registration and management",
        website: "https://namecheap.com",
        plans: [
            { id: "domain", name: "Domain", price: 12, frequency: "yearly" },
        ],
        credentialFields: [
            { key: "api_user", label: "API User", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "cloudflare",
        slug: "cloudflare",
        name: "Cloudflare",
        category: "domain",
        description: "DNS, CDN, and security services",
        website: "https://cloudflare.com",
        docsUrl: "https://developers.cloudflare.com",
        statusPageUrl: "https://www.cloudflarestatus.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 20, frequency: "monthly" },
            { id: "business", name: "Business", price: 200, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true, sensitive: true },
            { key: "zone_id", label: "Zone ID", type: "text", required: false },
        ],
    },
    {
        id: "porkbun",
        slug: "porkbun",
        name: "Porkbun",
        category: "domain",
        description: "Domain registration with competitive pricing",
        website: "https://porkbun.com",
        plans: [
            { id: "domain", name: "Domain", price: 10, frequency: "yearly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
            { key: "secret_key", label: "Secret Key", type: "password", required: true, sensitive: true },
        ],
    },
    // Auth
    {
        id: "clerk",
        slug: "clerk",
        name: "Clerk",
        category: "auth",
        description: "Complete user management and authentication",
        website: "https://clerk.com",
        docsUrl: "https://clerk.com/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 25, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "publishable_key", label: "Publishable Key", type: "text", required: true },
            { key: "secret_key", label: "Secret Key", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "auth0",
        slug: "auth0",
        name: "Auth0",
        category: "auth",
        description: "Identity platform for authentication",
        website: "https://auth0.com",
        docsUrl: "https://auth0.com/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "essential", name: "Essential", price: 23, frequency: "monthly" },
            { id: "professional", name: "Professional", price: 240, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "domain", label: "Domain", type: "text", required: true },
            { key: "client_id", label: "Client ID", type: "text", required: true },
            { key: "client_secret", label: "Client Secret", type: "password", required: true, sensitive: true },
        ],
    },
    // Payments
    {
        id: "stripe",
        slug: "stripe",
        name: "Stripe",
        category: "payments",
        description: "Payment processing platform",
        website: "https://stripe.com",
        docsUrl: "https://stripe.com/docs",
        statusPageUrl: "https://status.stripe.com",
        plans: [
            { id: "standard", name: "Standard", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "publishable_key", label: "Publishable Key", type: "text", required: true },
            { key: "secret_key", label: "Secret Key", type: "password", required: true, sensitive: true },
            { key: "webhook_secret", label: "Webhook Secret", type: "password", required: false, sensitive: true },
        ],
    },
    {
        id: "lemonsqueezy",
        slug: "lemonsqueezy",
        name: "Lemon Squeezy",
        category: "payments",
        description: "Payments, tax, and subscriptions for software",
        website: "https://lemonsqueezy.com",
        docsUrl: "https://docs.lemonsqueezy.com",
        plans: [
            { id: "standard", name: "Standard", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
            { key: "store_id", label: "Store ID", type: "text", required: true },
        ],
    },
    {
        id: "paddle",
        slug: "paddle",
        name: "Paddle",
        category: "payments",
        description: "Complete payments infrastructure",
        website: "https://paddle.com",
        docsUrl: "https://developer.paddle.com",
        plans: [
            { id: "standard", name: "Standard", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "vendor_id", label: "Vendor ID", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
            { key: "public_key", label: "Public Key", type: "password", required: false },
        ],
    },
    // Email
    {
        id: "resend",
        slug: "resend",
        name: "Resend",
        category: "email",
        description: "Email API for developers",
        website: "https://resend.com",
        docsUrl: "https://resend.com/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 20, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "sendgrid",
        slug: "sendgrid",
        name: "SendGrid",
        category: "email",
        description: "Email delivery and marketing platform",
        website: "https://sendgrid.com",
        docsUrl: "https://docs.sendgrid.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "essentials", name: "Essentials", price: 20, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 90, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "postmark",
        slug: "postmark",
        name: "Postmark",
        category: "email",
        description: "Transactional email service",
        website: "https://postmarkapp.com",
        docsUrl: "https://postmarkapp.com/developer",
        plans: [
            { id: "starter", name: "Starter", price: 15, frequency: "monthly" },
            { id: "basic", name: "Basic", price: 50, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "server_token", label: "Server Token", type: "password", required: true, sensitive: true },
        ],
    },
    // Analytics
    {
        id: "posthog",
        slug: "posthog",
        name: "PostHog",
        category: "analytics",
        description: "Product analytics and feature flags",
        website: "https://posthog.com",
        docsUrl: "https://posthog.com/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "growth", name: "Growth", price: 0, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
            { key: "host", label: "Host URL", type: "url", placeholder: "https://app.posthog.com", required: false },
        ],
    },
    {
        id: "plausible",
        slug: "plausible",
        name: "Plausible",
        category: "analytics",
        description: "Privacy-friendly web analytics",
        website: "https://plausible.io",
        docsUrl: "https://plausible.io/docs",
        plans: [
            { id: "growth", name: "Growth", price: 9, frequency: "monthly" },
            { id: "business", name: "Business", price: 19, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "site_id", label: "Site ID", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "password", required: false, sensitive: true },
        ],
    },
    {
        id: "mixpanel",
        slug: "mixpanel",
        name: "Mixpanel",
        category: "analytics",
        description: "Product analytics for user behavior",
        website: "https://mixpanel.com",
        docsUrl: "https://developer.mixpanel.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "growth", name: "Growth", price: 28, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "token", label: "Project Token", type: "password", required: true, sensitive: true },
        ],
    },
    // AI
    {
        id: "openai",
        slug: "openai",
        name: "OpenAI",
        category: "ai",
        description: "GPT and AI models API",
        website: "https://openai.com",
        docsUrl: "https://platform.openai.com/docs",
        statusPageUrl: "https://status.openai.com",
        plans: [
            { id: "payg", name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
            { key: "org_id", label: "Organization ID", type: "text", required: false },
        ],
    },
    {
        id: "anthropic",
        slug: "anthropic",
        name: "Anthropic",
        category: "ai",
        description: "Claude AI models API",
        website: "https://anthropic.com",
        docsUrl: "https://docs.anthropic.com",
        plans: [
            { id: "payg", name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "replicate",
        slug: "replicate",
        name: "Replicate",
        category: "ai",
        description: "Run ML models in the cloud",
        website: "https://replicate.com",
        docsUrl: "https://replicate.com/docs",
        plans: [
            { id: "payg", name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true, sensitive: true },
        ],
    },
    // Monitoring
    {
        id: "sentry",
        slug: "sentry",
        name: "Sentry",
        category: "monitoring",
        description: "Error tracking and performance monitoring",
        website: "https://sentry.io",
        docsUrl: "https://docs.sentry.io",
        statusPageUrl: "https://status.sentry.io",
        plans: [
            { id: "developer", name: "Developer", price: 0, frequency: "monthly" },
            { id: "team", name: "Team", price: 26, frequency: "monthly" },
            { id: "business", name: "Business", price: 80, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "dsn", label: "DSN", type: "password", required: true, sensitive: true },
            { key: "auth_token", label: "Auth Token", type: "password", required: false, sensitive: true },
        ],
    },
    {
        id: "logrocket",
        slug: "logrocket",
        name: "LogRocket",
        category: "monitoring",
        description: "Session replay and error tracking",
        website: "https://logrocket.com",
        docsUrl: "https://docs.logrocket.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "team", name: "Team", price: 99, frequency: "monthly" },
            { id: "professional", name: "Professional", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "app_id", label: "App ID", type: "text", required: true },
        ],
    },
    // Storage
    {
        id: "cloudinary",
        slug: "cloudinary",
        name: "Cloudinary",
        category: "storage",
        description: "Image and video management",
        website: "https://cloudinary.com",
        docsUrl: "https://cloudinary.com/documentation",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "plus", name: "Plus", price: 99, frequency: "monthly" },
            { id: "advanced", name: "Advanced", price: 249, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "cloud_name", label: "Cloud Name", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "text", required: true },
            { key: "api_secret", label: "API Secret", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "uploadthing",
        slug: "uploadthing",
        name: "UploadThing",
        category: "storage",
        description: "File uploads for Next.js",
        website: "https://uploadthing.com",
        docsUrl: "https://docs.uploadthing.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "pro", name: "Pro", price: 10, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "secret", label: "Secret", type: "password", required: true, sensitive: true },
            { key: "app_id", label: "App ID", type: "text", required: true },
        ],
    },
    // Dev Tools
    {
        id: "github",
        slug: "github",
        name: "GitHub",
        category: "devtools",
        description: "Code hosting and collaboration",
        website: "https://github.com",
        docsUrl: "https://docs.github.com",
        statusPageUrl: "https://www.githubstatus.com",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "team", name: "Team", price: 4, frequency: "monthly" },
            { id: "enterprise", name: "Enterprise", price: 21, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "personal_access_token", label: "Personal Access Token", type: "password", required: true, sensitive: true },
        ],
    },
    {
        id: "linear",
        slug: "linear",
        name: "Linear",
        category: "devtools",
        description: "Issue tracking and project management",
        website: "https://linear.app",
        docsUrl: "https://linear.app/docs",
        plans: [
            { id: "free", name: "Free", price: 0, frequency: "monthly" },
            { id: "standard", name: "Standard", price: 8, frequency: "monthly" },
            { id: "plus", name: "Plus", price: 14, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true, sensitive: true },
        ],
    },
    // App Stores
    {
        id: "apple-developer",
        slug: "apple-developer",
        name: "Apple Developer",
        category: "appstores",
        description: "iOS and macOS app distribution",
        website: "https://developer.apple.com",
        docsUrl: "https://developer.apple.com/documentation",
        plans: [
            { id: "individual", name: "Individual", price: 99, frequency: "yearly" },
            { id: "organization", name: "Organization", price: 99, frequency: "yearly" },
            { id: "enterprise", name: "Enterprise", price: 299, frequency: "yearly" },
        ],
        credentialFields: [
            { key: "team_id", label: "Team ID", type: "text", required: true },
            { key: "key_id", label: "Key ID", type: "text", required: false },
            { key: "private_key", label: "Private Key", type: "password", required: false, sensitive: true },
        ],
    },
    {
        id: "google-play",
        slug: "google-play",
        name: "Google Play Console",
        category: "appstores",
        description: "Android app distribution",
        website: "https://play.google.com/console",
        docsUrl: "https://developer.android.com/distribute",
        plans: [
            { id: "developer", name: "Developer", price: 25, frequency: "one-time" },
        ],
        credentialFields: [
            { key: "service_account_json", label: "Service Account JSON", type: "password", required: true, sensitive: true },
        ],
    },
];

// Helper functions
export const getServicesByCategory = (category: ServiceCategory): ServiceRegistryItem[] => {
    return serviceRegistry.filter((s) => s.category === category);
};

export const getServiceById = (id: string): ServiceRegistryItem | undefined => {
    return serviceRegistry.find((s) => s.id === id);
};

export const getServiceBySlug = (slug: string): ServiceRegistryItem | undefined => {
    return serviceRegistry.find((s) => s.slug === slug);
};

export const searchServices = (query: string): ServiceRegistryItem[] => {
    const lowerQuery = query.toLowerCase();
    return serviceRegistry.filter(
        (s) =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.description.toLowerCase().includes(lowerQuery) ||
            s.category.toLowerCase().includes(lowerQuery)
    );
};

export const getAllCategories = (): ServiceCategory[] => {
    return [...new Set(serviceRegistry.map((s) => s.category))];
};
