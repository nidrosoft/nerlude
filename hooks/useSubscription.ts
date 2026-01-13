"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/db";
import { useWorkspaceStore } from "@/stores";

// Demo account email that bypasses limits
const DEMO_ACCOUNT_EMAIL = "nidrosoft@gmail.com";

export interface SubscriptionPlan {
    id: string;
    name: string;
    maxProjects: number;
    maxWorkspaces: number;
    maxTeamMembers: number;
    maxServicesPerProject: number;
    maxCredentials: number;
    maxStorageBytes: number;
    maxIntegrations: number;
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

export interface WorkspaceUsage {
    projectCount: number;
    teamMemberCount: number;
    credentialCount: number;
    integrationCount: number;
    storageUsedBytes: number;
    serviceCount: number;
}

export interface UsageCheckResult {
    allowed: boolean;
    currentUsage: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
    percentUsed: number;
}

export interface FeatureCheckResult {
    allowed: boolean;
    feature: string;
    requiredPlan: string;
}

const DEFAULT_FREE_PLAN: SubscriptionPlan = {
    id: "free",
    name: "Free",
    maxProjects: 1,
    maxWorkspaces: 1,
    maxTeamMembers: 1,
    maxServicesPerProject: 5,
    maxCredentials: 10,
    maxStorageBytes: 1073741824, // 1 GB
    maxIntegrations: 1,
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
};

export function useSubscription() {
    const { currentWorkspace } = useWorkspaceStore();
    const [plan, setPlan] = useState<SubscriptionPlan>(DEFAULT_FREE_PLAN);
    const [usage, setUsage] = useState<WorkspaceUsage>({
        projectCount: 0,
        teamMemberCount: 0,
        credentialCount: 0,
        integrationCount: 0,
        storageUsedBytes: 0,
        serviceCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isDemoAccount, setIsDemoAccount] = useState(false);
    const [planId, setPlanId] = useState<string>("free");

    const fetchSubscriptionData = useCallback(async () => {
        if (!currentWorkspace) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const supabase = getSupabaseClient();
            
            // Check if current user is demo account
            const { data: { user } } = await supabase.auth.getUser();
            const isDemo = user?.email === DEMO_ACCOUNT_EMAIL;
            setIsDemoAccount(isDemo);

            // Fetch workspace subscription
            const { data: subData } = await supabase
                .from("workspace_subscriptions" as any)
                .select("plan_id")
                .eq("workspace_id", currentWorkspace.id)
                .single();

            const currentPlanId = subData?.plan_id || "free";
            setPlanId(currentPlanId);

            // Fetch plan details
            const { data: planData } = await supabase
                .from("subscription_plans" as any)
                .select("*")
                .eq("id", currentPlanId)
                .single();

            if (planData) {
                setPlan({
                    id: planData.id,
                    name: planData.name,
                    maxProjects: planData.max_projects,
                    maxWorkspaces: planData.max_workspaces,
                    maxTeamMembers: planData.max_team_members,
                    maxServicesPerProject: planData.max_services_per_project,
                    maxCredentials: planData.max_credentials,
                    maxStorageBytes: planData.max_storage_bytes,
                    maxIntegrations: planData.max_integrations,
                    hasEnvironmentSeparation: planData.has_environment_separation,
                    hasServiceStacks: planData.has_service_stacks,
                    hasCostAnalytics: planData.has_cost_analytics,
                    hasAiDocumentImport: planData.has_ai_document_import,
                    hasAdvancedAlerts: planData.has_advanced_alerts,
                    hasRbac: planData.has_rbac,
                    hasContractorAccess: planData.has_contractor_access,
                    hasAuditLogging: planData.has_audit_logging,
                    hasApiAccess: planData.has_api_access,
                    hasExport: planData.has_export,
                });
            }

            // Fetch usage data
            const { data: usageData } = await supabase
                .from("workspace_usage" as any)
                .select("*")
                .eq("workspace_id", currentWorkspace.id)
                .single();

            if (usageData) {
                setUsage({
                    projectCount: usageData.project_count || 0,
                    teamMemberCount: usageData.team_member_count || 0,
                    credentialCount: usageData.credential_count || 0,
                    integrationCount: usageData.integration_count || 0,
                    storageUsedBytes: usageData.storage_used_bytes || 0,
                    serviceCount: usageData.service_count || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching subscription data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        fetchSubscriptionData();
    }, [fetchSubscriptionData]);

    // Check if user can create more projects
    const canCreateProject = useCallback((): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: usage.projectCount, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxProjects;
        const isUnlimited = limit === -1;
        return {
            allowed: isUnlimited || usage.projectCount < limit,
            currentUsage: usage.projectCount,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - usage.projectCount),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (usage.projectCount / limit) * 100),
        };
    }, [plan, usage, isDemoAccount]);

    // Check if user can add more team members
    const canAddTeamMember = useCallback((): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: usage.teamMemberCount, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxTeamMembers;
        const isUnlimited = limit === -1;
        return {
            allowed: isUnlimited || usage.teamMemberCount < limit,
            currentUsage: usage.teamMemberCount,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - usage.teamMemberCount),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (usage.teamMemberCount / limit) * 100),
        };
    }, [plan, usage, isDemoAccount]);

    // Check if user can add more services to a project
    const canAddService = useCallback((currentServiceCount: number): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: currentServiceCount, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxServicesPerProject;
        const isUnlimited = limit === -1;
        return {
            allowed: isUnlimited || currentServiceCount < limit,
            currentUsage: currentServiceCount,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - currentServiceCount),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (currentServiceCount / limit) * 100),
        };
    }, [plan, isDemoAccount]);

    // Check if user can add more credentials
    const canAddCredential = useCallback((): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: usage.credentialCount, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxCredentials;
        const isUnlimited = limit === -1;
        return {
            allowed: isUnlimited || usage.credentialCount < limit,
            currentUsage: usage.credentialCount,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - usage.credentialCount),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (usage.credentialCount / limit) * 100),
        };
    }, [plan, usage, isDemoAccount]);

    // Check if user can add more integrations
    const canAddIntegration = useCallback((): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: usage.integrationCount, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxIntegrations;
        const isUnlimited = limit === -1;
        return {
            allowed: isUnlimited || usage.integrationCount < limit,
            currentUsage: usage.integrationCount,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - usage.integrationCount),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (usage.integrationCount / limit) * 100),
        };
    }, [plan, usage, isDemoAccount]);

    // Check storage limit
    const canUploadFile = useCallback((fileSizeBytes: number): UsageCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, currentUsage: usage.storageUsedBytes, limit: -1, remaining: Infinity, isUnlimited: true, percentUsed: 0 };
        }
        const limit = plan.maxStorageBytes;
        const isUnlimited = limit === -1;
        const newTotal = usage.storageUsedBytes + fileSizeBytes;
        return {
            allowed: isUnlimited || newTotal <= limit,
            currentUsage: usage.storageUsedBytes,
            limit,
            remaining: isUnlimited ? Infinity : Math.max(0, limit - usage.storageUsedBytes),
            isUnlimited,
            percentUsed: isUnlimited ? 0 : Math.min(100, (usage.storageUsedBytes / limit) * 100),
        };
    }, [plan, usage, isDemoAccount]);

    // Check if a feature is available
    const hasFeature = useCallback((feature: keyof Omit<SubscriptionPlan, 'id' | 'name' | 'maxProjects' | 'maxWorkspaces' | 'maxTeamMembers' | 'maxServicesPerProject' | 'maxCredentials' | 'maxStorageBytes' | 'maxIntegrations'>): FeatureCheckResult => {
        if (isDemoAccount) {
            return { allowed: true, feature, requiredPlan: plan.name };
        }
        
        const featureMap: Record<string, { allowed: boolean; requiredPlan: string }> = {
            hasEnvironmentSeparation: { allowed: plan.hasEnvironmentSeparation, requiredPlan: "Pro" },
            hasServiceStacks: { allowed: plan.hasServiceStacks, requiredPlan: "Pro" },
            hasCostAnalytics: { allowed: plan.hasCostAnalytics, requiredPlan: "Pro" },
            hasAiDocumentImport: { allowed: plan.hasAiDocumentImport, requiredPlan: "Pro" },
            hasAdvancedAlerts: { allowed: plan.hasAdvancedAlerts, requiredPlan: "Pro" },
            hasRbac: { allowed: plan.hasRbac, requiredPlan: "Team" },
            hasContractorAccess: { allowed: plan.hasContractorAccess, requiredPlan: "Team" },
            hasAuditLogging: { allowed: plan.hasAuditLogging, requiredPlan: "Team" },
            hasApiAccess: { allowed: plan.hasApiAccess, requiredPlan: "Team" },
            hasExport: { allowed: plan.hasExport, requiredPlan: "Team" },
        };

        const featureInfo = featureMap[feature] || { allowed: false, requiredPlan: "Team" };
        return {
            allowed: featureInfo.allowed,
            feature,
            requiredPlan: featureInfo.requiredPlan,
        };
    }, [plan, isDemoAccount]);

    // Get upgrade prompt message
    const getUpgradeMessage = useCallback((limitType: 'projects' | 'team' | 'services' | 'credentials' | 'storage' | 'integrations' | 'feature', featureName?: string): { title: string; message: string; suggestedPlan: string } => {
        const suggestedPlan = planId === "free" ? "Pro" : "Team";
        
        const messages: Record<string, { title: string; message: string }> = {
            projects: {
                title: "Project Limit Reached",
                message: `You've reached your project limit. Upgrade to ${suggestedPlan} to create more projects.`,
            },
            team: {
                title: "Team Member Limit Reached",
                message: `You've reached your team member limit. Upgrade to ${suggestedPlan} to invite more members.`,
            },
            services: {
                title: "Service Limit Reached",
                message: `You've reached the service limit for this project. Upgrade to ${suggestedPlan} to add more services.`,
            },
            credentials: {
                title: "Credential Limit Reached",
                message: `You've reached your credential limit. Upgrade to ${suggestedPlan} for more credentials.`,
            },
            storage: {
                title: "Storage Limit Reached",
                message: `You've used all your storage. Upgrade to ${suggestedPlan} for more storage space.`,
            },
            integrations: {
                title: "Integration Limit Reached",
                message: `You've reached your integration limit. Upgrade to ${suggestedPlan} for more integrations.`,
            },
            feature: {
                title: "Feature Not Available",
                message: `${featureName || "This feature"} is not available on your current plan. Upgrade to unlock it.`,
            },
        };

        return {
            ...messages[limitType],
            suggestedPlan,
        };
    }, [planId]);

    return {
        plan,
        planId,
        usage,
        isLoading,
        isDemoAccount,
        refetch: fetchSubscriptionData,
        // Limit checks
        canCreateProject,
        canAddTeamMember,
        canAddService,
        canAddCredential,
        canAddIntegration,
        canUploadFile,
        // Feature checks
        hasFeature,
        // Helpers
        getUpgradeMessage,
    };
}

export default useSubscription;
