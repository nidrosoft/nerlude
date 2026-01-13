// ============================================================================
// SUBSCRIPTION & BILLING TYPES
// ============================================================================

export type PlanId = 'free' | 'pro' | 'team';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
export type SupportLevel = 'community' | 'priority' | 'dedicated';

// ============================================================================
// SUBSCRIPTION PLAN
// ============================================================================
export interface SubscriptionPlan {
    id: PlanId;
    name: string;
    description: string;
    
    // Pricing
    priceMonthly: number;
    priceYearly: number;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
    stripeProductId?: string;
    
    // Core Limits (-1 = unlimited)
    limits: PlanLimits;
    
    // Feature Flags
    features: PlanFeatures;
    
    // Integration Limits
    maxIntegrations: number;
    
    // Support
    supportLevel: SupportLevel;
    
    // Display
    isPopular: boolean;
    displayOrder: number;
    isActive: boolean;
}

export interface PlanLimits {
    maxProjects: number;
    maxWorkspaces: number;
    maxTeamMembers: number;
    maxServicesPerProject: number;
    maxCredentials: number;
    maxStorageBytes: number;
    maxIntegrations: number;
}

export interface PlanFeatures {
    hasEnvironmentSeparation: boolean;
    hasServiceStacks: boolean;
    hasCostAnalytics: boolean;
    hasAiDocumentImport: boolean;
    hasAdvancedAlerts: boolean;
    hasRbac: boolean;
    hasContractorAccess: boolean;
    hasAuditLogging: boolean;
    hasApiAccess: boolean;
    hasExport: boolean;
}

// ============================================================================
// WORKSPACE SUBSCRIPTION
// ============================================================================
export interface WorkspaceSubscription {
    id: string;
    workspaceId: string;
    planId: PlanId;
    
    // Stripe Integration
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripeSubscriptionStatus?: SubscriptionStatus;
    
    // Billing Cycle
    billingCycle: BillingCycle;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
    canceledAt?: string;
    
    // Trial
    trialStart?: string;
    trialEnd?: string;
    
    // Override Limits (for custom deals)
    overrides?: Partial<PlanLimits>;
    
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// WORKSPACE USAGE
// ============================================================================
export interface WorkspaceUsage {
    id: string;
    workspaceId: string;
    
    // Current Usage Counts
    projectCount: number;
    teamMemberCount: number;
    credentialCount: number;
    integrationCount: number;
    
    // Storage Usage (in bytes)
    storageUsedBytes: number;
    
    lastCalculatedAt: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// STORAGE QUOTA
// ============================================================================
export interface StorageQuota {
    id: string;
    workspaceId: string;
    projectId?: string;
    
    // Storage Breakdown (in bytes)
    assetsBytes: number;
    documentsBytes: number;
    attachmentsBytes: number;
    totalBytes: number;
    
    // File Counts
    assetCount: number;
    documentCount: number;
    
    lastCalculatedAt: string;
}

// ============================================================================
// BILLING HISTORY
// ============================================================================
export type BillingEventType = 
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_canceled'
    | 'payment_succeeded'
    | 'payment_failed'
    | 'refund'
    | 'trial_started'
    | 'trial_ended';

export interface BillingHistoryItem {
    id: string;
    workspaceId: string;
    eventType: BillingEventType;
    description?: string;
    
    // Stripe References
    stripeInvoiceId?: string;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    
    // Amount
    amountCents?: number;
    currency: string;
    
    // Plan Change
    previousPlanId?: PlanId;
    newPlanId?: PlanId;
    
    metadata?: Record<string, unknown>;
    createdAt: string;
}

// ============================================================================
// USAGE CHECK RESULTS
// ============================================================================
export interface UsageCheckResult {
    allowed: boolean;
    currentUsage: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
    percentUsed: number;
}

export interface StorageCheckResult {
    allowed: boolean;
    currentUsageBytes: number;
    limitBytes: number;
    remainingBytes: number;
    isUnlimited: boolean;
    percentUsed: number;
    currentUsageFormatted: string;
    limitFormatted: string;
    remainingFormatted: string;
}

// ============================================================================
// DEFAULT PLAN CONFIGURATIONS
// ============================================================================
export const DEFAULT_PLANS: Record<PlanId, SubscriptionPlan> = {
    free: {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started with your first project.',
        priceMonthly: 0,
        priceYearly: 0,
        limits: {
            maxProjects: 1,
            maxWorkspaces: 1,
            maxTeamMembers: 1,
            maxServicesPerProject: 5,
            maxCredentials: 10,
            maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
            maxIntegrations: 1,
        },
        features: {
            hasEnvironmentSeparation: false,
            hasServiceStacks: false,
            hasCostAnalytics: false,
            hasAiDocumentImport: false,
            hasAdvancedAlerts: false,
            hasRbac: false,
            hasContractorAccess: false,
            hasAuditLogging: false,
            hasApiAccess: false,
            hasExport: false,
        },
        maxIntegrations: 1,
        supportLevel: 'community',
        isPopular: false,
        displayOrder: 1,
        isActive: true,
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        description: 'For founders managing multiple products.',
        priceMonthly: 19.99,
        priceYearly: 215.89,
        limits: {
            maxProjects: 10,
            maxWorkspaces: 3,
            maxTeamMembers: 5,
            maxServicesPerProject: 50,
            maxCredentials: -1, // unlimited
            maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
            maxIntegrations: 3,
        },
        features: {
            hasEnvironmentSeparation: true,
            hasServiceStacks: true,
            hasCostAnalytics: true,
            hasAiDocumentImport: true,
            hasAdvancedAlerts: true,
            hasRbac: false,
            hasContractorAccess: false,
            hasAuditLogging: false,
            hasApiAccess: false,
            hasExport: false,
        },
        maxIntegrations: 3,
        supportLevel: 'priority',
        isPopular: true,
        displayOrder: 2,
        isActive: true,
    },
    team: {
        id: 'team',
        name: 'Team',
        description: 'For agencies and growing teams.',
        priceMonthly: 39.99,
        priceYearly: 431.89,
        limits: {
            maxProjects: -1, // unlimited
            maxWorkspaces: -1,
            maxTeamMembers: -1,
            maxServicesPerProject: -1,
            maxCredentials: -1,
            maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
            maxIntegrations: -1,
        },
        features: {
            hasEnvironmentSeparation: true,
            hasServiceStacks: true,
            hasCostAnalytics: true,
            hasAiDocumentImport: true,
            hasAdvancedAlerts: true,
            hasRbac: true,
            hasContractorAccess: true,
            hasAuditLogging: true,
            hasApiAccess: true,
            hasExport: true,
        },
        maxIntegrations: -1,
        supportLevel: 'dedicated',
        isPopular: false,
        displayOrder: 3,
        isActive: true,
    },
};

// ============================================================================
// STORAGE SIZE CONSTANTS
// ============================================================================
export const STORAGE_SIZES = {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
} as const;

export const PLAN_STORAGE_LIMITS = {
    free: 1 * STORAGE_SIZES.GB,   // 1 GB
    pro: 10 * STORAGE_SIZES.GB,   // 10 GB
    team: 100 * STORAGE_SIZES.GB, // 100 GB
} as const;
