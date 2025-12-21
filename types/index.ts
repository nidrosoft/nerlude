// Project Types
export type ProjectType = 'web' | 'mobile' | 'extension' | 'desktop' | 'api' | 'landing' | 'embedded' | 'game' | 'ai' | 'custom';
export type ProjectStatus = 'active' | 'paused' | 'archived';

export interface Project {
    id: string;
    name: string;
    description?: string;
    icon: string; // emoji or icon identifier
    type: ProjectType;
    status: ProjectStatus;
    monthlyCost: number;
    serviceCount: number;
    alertCount: number;
    nextRenewal?: string; // ISO date
    createdAt: string;
    updatedAt: string;
}

// Service Types
export type ServiceCategory = 
    | 'hosting'
    | 'database'
    | 'domain'
    | 'auth'
    | 'payments'
    | 'email'
    | 'analytics'
    | 'storage'
    | 'ai'
    | 'devtools'
    | 'marketing'
    | 'appstores'
    | 'monitoring'
    | 'communication'
    | 'security'
    | 'cms'
    | 'search'
    | 'media'
    | 'other';

export type ServiceStatus = 'active' | 'inactive' | 'paused' | 'deprecated';
export type CostFrequency = 'monthly' | 'yearly' | 'one-time';

export interface Service {
    id: string;
    projectId: string;
    registryId?: string; // reference to service registry
    categoryId: ServiceCategory;
    name: string;
    logoUrl?: string;
    plan?: string;
    costAmount: number;
    costFrequency: CostFrequency;
    currency: string;
    renewalDate?: string;
    status: ServiceStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Alert Types
export type AlertType = 'renewal' | 'cost_alert' | 'team' | 'system';
export type AlertPriority = 'high' | 'medium' | 'low';

export interface Alert {
    id: string;
    type: AlertType;
    priority: AlertPriority;
    title: string;
    message: string;
    projectId?: string;
    projectName?: string;
    serviceId?: string;
    serviceName?: string;
    dueDate?: string;
    isRead: boolean;
    isDismissed: boolean;
    snoozedUntil?: string;
    createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalProjects: number;
    monthlyBurn: number;
    totalServices: number;
    upcomingRenewals: number;
}

// User & Workspace Types
export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: string;
}

// Onboarding Data
export interface OnboardingData {
    userType: string;
    companySize: string;
    howFoundUs: string;
    useCase: string;
    productCount: string;
}
