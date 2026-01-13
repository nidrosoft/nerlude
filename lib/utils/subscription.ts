import {
    PlanId,
    SubscriptionPlan,
    WorkspaceSubscription,
    WorkspaceUsage,
    UsageCheckResult,
    StorageCheckResult,
    DEFAULT_PLANS,
    STORAGE_SIZES,
} from '@/types/subscription';

// ============================================================================
// FORMAT HELPERS
// ============================================================================

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes === -1) return 'Unlimited';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format limit number (-1 = unlimited)
 */
export function formatLimit(limit: number): string {
    return limit === -1 ? 'Unlimited' : limit.toString();
}

/**
 * Check if limit is unlimited
 */
export function isUnlimited(limit: number): boolean {
    return limit === -1;
}

// ============================================================================
// PLAN HELPERS
// ============================================================================

/**
 * Get plan by ID
 */
export function getPlan(planId: PlanId): SubscriptionPlan {
    return DEFAULT_PLANS[planId] || DEFAULT_PLANS.free;
}

/**
 * Get effective limit considering overrides
 */
export function getEffectiveLimit(
    subscription: WorkspaceSubscription,
    limitKey: keyof typeof DEFAULT_PLANS.free.limits
): number {
    const plan = getPlan(subscription.planId);
    const override = subscription.overrides?.[limitKey];
    return override !== undefined ? override : plan.limits[limitKey];
}

/**
 * Check if workspace has a specific feature
 */
export function hasFeature(
    subscription: WorkspaceSubscription,
    featureKey: keyof typeof DEFAULT_PLANS.free.features
): boolean {
    const plan = getPlan(subscription.planId);
    return plan.features[featureKey];
}

// ============================================================================
// USAGE CHECK FUNCTIONS
// ============================================================================

/**
 * Check if workspace can create more of a resource type
 */
export function checkUsageLimit(
    subscription: WorkspaceSubscription,
    usage: WorkspaceUsage,
    resourceType: 'project' | 'teamMember' | 'credential' | 'integration'
): UsageCheckResult {
    const limitKeyMap = {
        project: 'maxProjects',
        teamMember: 'maxTeamMembers',
        credential: 'maxCredentials',
        integration: 'maxIntegrations',
    } as const;
    
    const usageKeyMap = {
        project: 'projectCount',
        teamMember: 'teamMemberCount',
        credential: 'credentialCount',
        integration: 'integrationCount',
    } as const;
    
    const limit = getEffectiveLimit(subscription, limitKeyMap[resourceType]);
    const currentUsage = usage[usageKeyMap[resourceType]];
    const unlimited = isUnlimited(limit);
    
    return {
        allowed: unlimited || currentUsage < limit,
        currentUsage,
        limit,
        remaining: unlimited ? Infinity : Math.max(0, limit - currentUsage),
        isUnlimited: unlimited,
        percentUsed: unlimited ? 0 : Math.min(100, (currentUsage / limit) * 100),
    };
}

/**
 * Check if workspace can upload a file of given size
 */
export function checkStorageLimit(
    subscription: WorkspaceSubscription,
    usage: WorkspaceUsage,
    additionalBytes: number = 0
): StorageCheckResult {
    const limit = getEffectiveLimit(subscription, 'maxStorageBytes');
    const currentUsage = usage.storageUsedBytes;
    const unlimited = isUnlimited(limit);
    const newTotal = currentUsage + additionalBytes;
    
    return {
        allowed: unlimited || newTotal <= limit,
        currentUsageBytes: currentUsage,
        limitBytes: limit,
        remainingBytes: unlimited ? Infinity : Math.max(0, limit - currentUsage),
        isUnlimited: unlimited,
        percentUsed: unlimited ? 0 : Math.min(100, (currentUsage / limit) * 100),
        currentUsageFormatted: formatBytes(currentUsage),
        limitFormatted: formatBytes(limit),
        remainingFormatted: unlimited ? 'Unlimited' : formatBytes(Math.max(0, limit - currentUsage)),
    };
}

/**
 * Check services per project limit
 */
export function checkServicesLimit(
    subscription: WorkspaceSubscription,
    currentServiceCount: number
): UsageCheckResult {
    const limit = getEffectiveLimit(subscription, 'maxServicesPerProject');
    const unlimited = isUnlimited(limit);
    
    return {
        allowed: unlimited || currentServiceCount < limit,
        currentUsage: currentServiceCount,
        limit,
        remaining: unlimited ? Infinity : Math.max(0, limit - currentServiceCount),
        isUnlimited: unlimited,
        percentUsed: unlimited ? 0 : Math.min(100, (currentServiceCount / limit) * 100),
    };
}

// ============================================================================
// UPGRADE PROMPTS
// ============================================================================

export interface UpgradePrompt {
    title: string;
    message: string;
    currentPlan: PlanId;
    suggestedPlan: PlanId;
    feature?: string;
}

/**
 * Get upgrade prompt for a specific limit
 */
export function getUpgradePrompt(
    currentPlanId: PlanId,
    limitType: 'projects' | 'storage' | 'team' | 'services' | 'credentials' | 'integrations' | 'feature',
    featureName?: string
): UpgradePrompt {
    const suggestedPlan: PlanId = currentPlanId === 'free' ? 'pro' : 'team';
    
    const prompts: Record<string, { title: string; message: string }> = {
        projects: {
            title: 'Project Limit Reached',
            message: `You've reached your project limit. Upgrade to ${suggestedPlan === 'pro' ? 'Pro for up to 10 projects' : 'Team for unlimited projects'}.`,
        },
        storage: {
            title: 'Storage Limit Reached',
            message: `You've used all your storage. Upgrade to ${suggestedPlan === 'pro' ? 'Pro for 10 GB' : 'Team for 100 GB'} of storage.`,
        },
        team: {
            title: 'Team Member Limit Reached',
            message: `You've reached your team member limit. Upgrade to ${suggestedPlan === 'pro' ? 'Pro for up to 5 members' : 'Team for unlimited members'}.`,
        },
        services: {
            title: 'Service Limit Reached',
            message: `You've reached the service limit for this project. Upgrade to ${suggestedPlan === 'pro' ? 'Pro for 50 services per project' : 'Team for unlimited services'}.`,
        },
        credentials: {
            title: 'Credential Limit Reached',
            message: `You've reached your credential limit. Upgrade to ${suggestedPlan === 'pro' ? 'Pro' : 'Team'} for unlimited credentials.`,
        },
        integrations: {
            title: 'Integration Limit Reached',
            message: `You've reached your integration limit. Upgrade to ${suggestedPlan === 'pro' ? 'Pro for 3 integrations' : 'Team for unlimited integrations'}.`,
        },
        feature: {
            title: 'Feature Not Available',
            message: `${featureName || 'This feature'} is not available on your current plan. Upgrade to unlock it.`,
        },
    };
    
    const prompt = prompts[limitType] || prompts.feature;
    
    return {
        ...prompt,
        currentPlan: currentPlanId,
        suggestedPlan,
        feature: featureName,
    };
}

// ============================================================================
// PLAN COMPARISON
// ============================================================================

export interface PlanComparison {
    feature: string;
    free: string | boolean;
    pro: string | boolean;
    team: string | boolean;
    category: 'limits' | 'features' | 'support';
}

/**
 * Get full plan comparison table
 */
export function getPlanComparison(): PlanComparison[] {
    return [
        // Limits
        { feature: 'Projects', free: '1', pro: '10', team: 'Unlimited', category: 'limits' },
        { feature: 'Workspaces', free: '1', pro: '3', team: 'Unlimited', category: 'limits' },
        { feature: 'Team Members', free: '1', pro: '5', team: 'Unlimited', category: 'limits' },
        { feature: 'Services per Project', free: '5', pro: '50', team: 'Unlimited', category: 'limits' },
        { feature: 'Credentials', free: '10', pro: 'Unlimited', team: 'Unlimited', category: 'limits' },
        { feature: 'Asset Storage', free: '1 GB', pro: '10 GB', team: '100 GB', category: 'limits' },
        { feature: 'Integrations', free: '1', pro: '3', team: 'Unlimited', category: 'limits' },
        
        // Features
        { feature: 'Environment Separation', free: false, pro: true, team: true, category: 'features' },
        { feature: 'Service Stacks', free: false, pro: true, team: true, category: 'features' },
        { feature: 'Cost Analytics', free: false, pro: true, team: true, category: 'features' },
        { feature: 'AI Document Import', free: false, pro: true, team: true, category: 'features' },
        { feature: 'Advanced Alerts', free: false, pro: true, team: true, category: 'features' },
        { feature: 'Role-Based Access', free: false, pro: false, team: true, category: 'features' },
        { feature: 'Contractor Access', free: false, pro: false, team: true, category: 'features' },
        { feature: 'Audit Logging', free: false, pro: false, team: true, category: 'features' },
        { feature: 'API Access', free: false, pro: false, team: true, category: 'features' },
        { feature: 'Export', free: false, pro: false, team: true, category: 'features' },
        
        // Support
        { feature: 'Support Level', free: 'Community', pro: 'Priority', team: 'Dedicated + SLA', category: 'support' },
    ];
}

// ============================================================================
// STRIPE HELPERS
// ============================================================================

/**
 * Get Stripe price ID for a plan
 */
export function getStripePriceId(
    planId: PlanId,
    billingCycle: 'monthly' | 'yearly'
): string | undefined {
    const plan = getPlan(planId);
    return billingCycle === 'monthly' 
        ? plan.stripePriceIdMonthly 
        : plan.stripePriceIdYearly;
}

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(planId: PlanId): {
    monthlyTotal: number;
    yearlyTotal: number;
    savings: number;
    savingsPercent: number;
} {
    const plan = getPlan(planId);
    const monthlyTotal = plan.priceMonthly * 12;
    const yearlyTotal = plan.priceYearly;
    const savings = monthlyTotal - yearlyTotal;
    const savingsPercent = (savings / monthlyTotal) * 100;
    
    return {
        monthlyTotal,
        yearlyTotal,
        savings,
        savingsPercent: Math.round(savingsPercent),
    };
}
