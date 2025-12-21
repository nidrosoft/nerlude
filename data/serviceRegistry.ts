import { ServiceCategory } from "@/types";

export interface ServiceRegistryItem {
    id: string;
    name: string;
    category: ServiceCategory;
    description: string;
    website: string;
    logoUrl?: string;
    defaultPlan?: string;
    plans: {
        name: string;
        price: number;
        frequency: "monthly" | "yearly" | "one-time";
    }[];
    credentialFields: {
        key: string;
        label: string;
        type: "text" | "password" | "email" | "url";
        placeholder?: string;
        required: boolean;
    }[];
}

export const serviceRegistry: ServiceRegistryItem[] = [
    // Hosting
    {
        id: "vercel",
        name: "Vercel",
        category: "hosting",
        description: "Deploy web projects with zero configuration",
        website: "https://vercel.com",
        plans: [
            { name: "Hobby", price: 0, frequency: "monthly" },
            { name: "Pro", price: 20, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true },
            { key: "team_id", label: "Team ID", type: "text", required: false },
        ],
    },
    {
        id: "railway",
        name: "Railway",
        category: "hosting",
        description: "Infrastructure platform for deploying apps",
        website: "https://railway.app",
        plans: [
            { name: "Hobby", price: 5, frequency: "monthly" },
            { name: "Pro", price: 20, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true },
        ],
    },
    {
        id: "netlify",
        name: "Netlify",
        category: "hosting",
        description: "Build and deploy modern web projects",
        website: "https://netlify.com",
        plans: [
            { name: "Starter", price: 0, frequency: "monthly" },
            { name: "Pro", price: 19, frequency: "monthly" },
            { name: "Business", price: 99, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "access_token", label: "Access Token", type: "password", required: true },
        ],
    },
    {
        id: "aws",
        name: "AWS",
        category: "hosting",
        description: "Amazon Web Services cloud platform",
        website: "https://aws.amazon.com",
        plans: [
            { name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "access_key_id", label: "Access Key ID", type: "text", required: true },
            { key: "secret_access_key", label: "Secret Access Key", type: "password", required: true },
            { key: "region", label: "Region", type: "text", placeholder: "us-east-1", required: true },
        ],
    },
    // Database
    {
        id: "supabase",
        name: "Supabase",
        category: "database",
        description: "Open source Firebase alternative with Postgres",
        website: "https://supabase.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Pro", price: 25, frequency: "monthly" },
            { name: "Team", price: 599, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "project_url", label: "Project URL", type: "url", required: true },
            { key: "anon_key", label: "Anon Key", type: "password", required: true },
            { key: "service_role_key", label: "Service Role Key", type: "password", required: false },
        ],
    },
    {
        id: "planetscale",
        name: "PlanetScale",
        category: "database",
        description: "Serverless MySQL platform",
        website: "https://planetscale.com",
        plans: [
            { name: "Hobby", price: 0, frequency: "monthly" },
            { name: "Scaler", price: 29, frequency: "monthly" },
            { name: "Scaler Pro", price: 59, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "database_url", label: "Database URL", type: "password", required: true },
        ],
    },
    {
        id: "mongodb",
        name: "MongoDB Atlas",
        category: "database",
        description: "Cloud-hosted MongoDB service",
        website: "https://mongodb.com/atlas",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Serverless", price: 0, frequency: "monthly" },
            { name: "Dedicated", price: 57, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "connection_string", label: "Connection String", type: "password", required: true },
        ],
    },
    {
        id: "redis",
        name: "Redis Cloud",
        category: "database",
        description: "Managed Redis hosting",
        website: "https://redis.com/cloud",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Essentials", price: 7, frequency: "monthly" },
            { name: "Pro", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "redis_url", label: "Redis URL", type: "password", required: true },
        ],
    },
    // Domain
    {
        id: "namecheap",
        name: "Namecheap",
        category: "domain",
        description: "Domain registration and management",
        website: "https://namecheap.com",
        plans: [
            { name: "Domain", price: 12, frequency: "yearly" },
        ],
        credentialFields: [
            { key: "api_user", label: "API User", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "password", required: true },
        ],
    },
    {
        id: "cloudflare",
        name: "Cloudflare",
        category: "domain",
        description: "DNS, CDN, and security services",
        website: "https://cloudflare.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Pro", price: 20, frequency: "monthly" },
            { name: "Business", price: 200, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_token", label: "API Token", type: "password", required: true },
            { key: "zone_id", label: "Zone ID", type: "text", required: false },
        ],
    },
    // Auth
    {
        id: "clerk",
        name: "Clerk",
        category: "auth",
        description: "Complete user management and authentication",
        website: "https://clerk.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Pro", price: 25, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "publishable_key", label: "Publishable Key", type: "text", required: true },
            { key: "secret_key", label: "Secret Key", type: "password", required: true },
        ],
    },
    {
        id: "auth0",
        name: "Auth0",
        category: "auth",
        description: "Identity platform for authentication",
        website: "https://auth0.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Essential", price: 23, frequency: "monthly" },
            { name: "Professional", price: 240, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "domain", label: "Domain", type: "text", required: true },
            { key: "client_id", label: "Client ID", type: "text", required: true },
            { key: "client_secret", label: "Client Secret", type: "password", required: true },
        ],
    },
    // Payments
    {
        id: "stripe",
        name: "Stripe",
        category: "payments",
        description: "Payment processing platform",
        website: "https://stripe.com",
        plans: [
            { name: "Standard", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "publishable_key", label: "Publishable Key", type: "text", required: true },
            { key: "secret_key", label: "Secret Key", type: "password", required: true },
            { key: "webhook_secret", label: "Webhook Secret", type: "password", required: false },
        ],
    },
    {
        id: "lemonsqueezy",
        name: "Lemon Squeezy",
        category: "payments",
        description: "Payments, tax, and subscriptions for software",
        website: "https://lemonsqueezy.com",
        plans: [
            { name: "Standard", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
            { key: "store_id", label: "Store ID", type: "text", required: true },
        ],
    },
    // Email
    {
        id: "resend",
        name: "Resend",
        category: "email",
        description: "Email API for developers",
        website: "https://resend.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Pro", price: 20, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
        ],
    },
    {
        id: "sendgrid",
        name: "SendGrid",
        category: "email",
        description: "Email delivery and marketing platform",
        website: "https://sendgrid.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Essentials", price: 20, frequency: "monthly" },
            { name: "Pro", price: 90, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
        ],
    },
    // Analytics
    {
        id: "posthog",
        name: "PostHog",
        category: "analytics",
        description: "Product analytics and feature flags",
        website: "https://posthog.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Growth", price: 0, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
            { key: "host", label: "Host URL", type: "url", placeholder: "https://app.posthog.com", required: false },
        ],
    },
    {
        id: "mixpanel",
        name: "Mixpanel",
        category: "analytics",
        description: "Product analytics for user behavior",
        website: "https://mixpanel.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Growth", price: 28, frequency: "monthly" },
            { name: "Enterprise", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "token", label: "Project Token", type: "password", required: true },
        ],
    },
    // AI
    {
        id: "openai",
        name: "OpenAI",
        category: "ai",
        description: "GPT and AI models API",
        website: "https://openai.com",
        plans: [
            { name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
            { key: "org_id", label: "Organization ID", type: "text", required: false },
        ],
    },
    {
        id: "anthropic",
        name: "Anthropic",
        category: "ai",
        description: "Claude AI models API",
        website: "https://anthropic.com",
        plans: [
            { name: "Pay as you go", price: 0, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
        ],
    },
    // Monitoring
    {
        id: "sentry",
        name: "Sentry",
        category: "monitoring",
        description: "Error tracking and performance monitoring",
        website: "https://sentry.io",
        plans: [
            { name: "Developer", price: 0, frequency: "monthly" },
            { name: "Team", price: 26, frequency: "monthly" },
            { name: "Business", price: 80, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "dsn", label: "DSN", type: "password", required: true },
            { key: "auth_token", label: "Auth Token", type: "password", required: false },
        ],
    },
    // Storage
    {
        id: "cloudinary",
        name: "Cloudinary",
        category: "storage",
        description: "Image and video management",
        website: "https://cloudinary.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Plus", price: 99, frequency: "monthly" },
            { name: "Advanced", price: 249, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "cloud_name", label: "Cloud Name", type: "text", required: true },
            { key: "api_key", label: "API Key", type: "text", required: true },
            { key: "api_secret", label: "API Secret", type: "password", required: true },
        ],
    },
    {
        id: "uploadthing",
        name: "UploadThing",
        category: "storage",
        description: "File uploads for Next.js",
        website: "https://uploadthing.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Pro", price: 10, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "secret", label: "Secret", type: "password", required: true },
            { key: "app_id", label: "App ID", type: "text", required: true },
        ],
    },
    // Dev Tools
    {
        id: "github",
        name: "GitHub",
        category: "devtools",
        description: "Code hosting and collaboration",
        website: "https://github.com",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Team", price: 4, frequency: "monthly" },
            { name: "Enterprise", price: 21, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "personal_access_token", label: "Personal Access Token", type: "password", required: true },
        ],
    },
    {
        id: "linear",
        name: "Linear",
        category: "devtools",
        description: "Issue tracking and project management",
        website: "https://linear.app",
        plans: [
            { name: "Free", price: 0, frequency: "monthly" },
            { name: "Standard", price: 8, frequency: "monthly" },
            { name: "Plus", price: 14, frequency: "monthly" },
        ],
        credentialFields: [
            { key: "api_key", label: "API Key", type: "password", required: true },
        ],
    },
];

export const getServicesByCategory = (category: ServiceCategory) => {
    return serviceRegistry.filter((s) => s.category === category);
};

export const getServiceById = (id: string) => {
    return serviceRegistry.find((s) => s.id === id);
};
