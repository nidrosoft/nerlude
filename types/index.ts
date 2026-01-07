// Project Types
export type ProjectType = 'web' | 'mobile' | 'extension' | 'desktop' | 'api' | 'landing' | 'embedded' | 'game' | 'ai' | 'custom';
export type ProjectStatus = 'active' | 'paused' | 'archived';

// Project Environment - for environment-first credentials
export type ProjectEnvironment = 'production' | 'staging' | 'development';

export interface ProjectEnvironmentConfig {
    id: string;
    name: string;
    slug: ProjectEnvironment;
    color: string; // for visual distinction
    isDefault?: boolean;
}

export interface Project {
    id: string;
    workspaceId: string; // Added: reference to workspace
    name: string;
    description?: string;
    icon: string; // emoji or icon identifier
    type: ProjectType;
    status: ProjectStatus;
    environments?: ProjectEnvironmentConfig[]; // Project-level environments
    activeEnvironment?: ProjectEnvironment; // Currently selected environment
    settings?: Record<string, unknown>; // Added: project-specific settings
    monthlyCost: number; // Computed field
    serviceCount: number; // Computed field
    alertCount: number; // Computed field
    nextRenewal?: string; // ISO date - Computed field
    createdBy?: string; // Optional for mock data, required in DB
    createdAt: string;
    updatedAt: string;
}

// Service Types - Primary Categories (consolidated from 18 to 8)
export type ServiceCategory = 
    | 'infrastructure'  // hosting, database, storage, cdn
    | 'identity'        // auth, security
    | 'payments'        // payments, billing
    | 'communications'  // email, sms, push, chat
    | 'analytics'       // analytics, monitoring, logging
    | 'domains'         // domain, dns, ssl
    | 'distribution'    // appstores, marketing
    | 'devtools'        // devtools, ai, cms, search, media
    | 'other';

// Sub-categories for more granular organization within primary categories
export type ServiceSubCategory = 
    // Infrastructure
    | 'hosting'
    | 'database'
    | 'storage'
    | 'cdn'
    | 'serverless'
    // Identity & Access
    | 'authentication'
    | 'security'
    | 'secrets'
    // Payments
    | 'payment_processing'
    | 'subscriptions'
    | 'invoicing'
    // Communications
    | 'email'
    | 'sms'
    | 'push'
    | 'chat'
    | 'video'
    // Analytics & Monitoring
    | 'product_analytics'
    | 'error_tracking'
    | 'logging'
    | 'uptime'
    // Domains
    | 'registrar'
    | 'dns'
    | 'ssl'
    // Distribution
    | 'app_store'
    | 'marketing'
    | 'support'
    // Dev Tools
    | 'version_control'
    | 'ci_cd'
    | 'ai_ml'
    | 'cms'
    | 'search'
    | 'media'
    | 'collaboration'
    // Other
    | 'custom';

export type ServiceStatus = 'active' | 'inactive' | 'paused' | 'deprecated';
export type CostFrequency = 'monthly' | 'yearly' | 'one-time';

export interface Service {
    id: string;
    projectId: string;
    stackId?: string; // Optional: reference to a stack for grouping
    registryId?: string; // reference to service registry
    categoryId: ServiceCategory;
    subCategoryId?: ServiceSubCategory; // optional sub-category for granular organization
    name: string;
    customLogoUrl?: string; // for custom services
    plan?: string;
    costAmount: number;
    costFrequency: CostFrequency;
    currency: string;
    renewalDate?: string;
    renewalReminderDays?: number[]; // e.g., [30, 14, 7]
    status: ServiceStatus;
    notes?: string;
    quickLinks?: { label: string; url: string }[];
    settings?: Record<string, unknown>;
    createdBy?: string; // Optional for mock data, required in DB
    createdAt: string;
    updatedAt: string;
}

// Stack Types - for grouping related services
export interface ServiceStack {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    color: string; // for visual distinction
    icon?: string; // optional icon
    order: number; // for sorting
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
    emailVerifiedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    settings?: WorkspaceSettings;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceSettings {
    defaultCurrency?: string;
    timezone?: string;
    notificationPreferences?: NotificationPreferences;
}

// Team & Member Types
export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer' | 'contractor';

export interface WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    user?: User; // Populated when fetching
    role: TeamRole;
    invitedBy?: string;
    invitedAt: string;
    acceptedAt?: string;
}

export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    user?: User; // Populated when fetching
    role: TeamRole;
    accessExpiresAt?: string; // For contractors
    createdAt: string;
}

// Credential Types
export type CredentialEnvironment = 'production' | 'staging' | 'development';

export interface ServiceCredential {
    id: string;
    projectServiceId: string;
    environment: CredentialEnvironment;
    credentialsEncrypted: string; // AES-256 encrypted JSON
    lastRotatedAt?: string;
    rotationReminderDays?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CredentialField {
    key: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'textarea';
    value?: string;
    required: boolean;
    sensitive: boolean;
    placeholder?: string;
    helpText?: string;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    workspaceId: string;
    type: AlertType;
    title: string;
    message?: string;
    data?: Record<string, unknown>;
    readAt?: string;
    dismissedAt?: string;
    snoozedUntil?: string;
    createdAt: string;
}

export interface NotificationPreferences {
    email: {
        enabled: boolean;
        frequency: 'immediate' | 'daily' | 'weekly';
        quietHoursStart?: string; // HH:MM format
        quietHoursEnd?: string;
    };
    inApp: {
        enabled: boolean;
    };
    renewalAlerts: boolean;
    costAlerts: boolean;
    teamAlerts: boolean;
    systemAlerts: boolean;
}

// Audit Log Types
export type AuditAction = 
    | 'create' 
    | 'update' 
    | 'delete' 
    | 'view' 
    | 'copy_credential'
    | 'invite_member'
    | 'remove_member'
    | 'change_role'
    | 'login'
    | 'logout';

export type AuditEntityType = 
    | 'project' 
    | 'service' 
    | 'credential' 
    | 'team_member'
    | 'workspace'
    | 'user'
    | 'asset'
    | 'document';

export interface AuditLog {
    id: string;
    workspaceId: string;
    userId?: string;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId?: string;
    oldData?: Record<string, unknown>;
    newData?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

// Asset Types
export type AssetType = 'logo' | 'screenshot' | 'document' | 'brand';

export interface Asset {
    id: string;
    projectId: string;
    name: string;
    type: AssetType;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    metadata?: Record<string, unknown>;
    uploadedBy: string;
    createdAt: string;
}

// Project Document Types
export type ProjectDocType = 'architecture' | 'getting_started' | 'decisions' | 'note';

export interface ProjectDocument {
    id: string;
    projectId: string;
    title: string;
    content?: string; // Markdown content
    docType: ProjectDocType;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// Onboarding Data
export interface OnboardingData {
    userType: string;
    companySize: string;
    howFoundUs: string;
    useCase: string;
    productCount: string;
}

// Document Upload Types
export type DocumentType = 'invoice' | 'receipt' | 'contract' | 'screenshot' | 'other';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface UploadedDocument {
    id: string;
    file: File;
    name: string;
    type: DocumentType;
    size: number;
    previewUrl?: string;
    status: 'pending' | 'processing' | 'processed' | 'error';
    errorMessage?: string;
}

export interface ExtractedField<T = string> {
    value: T;
    confidence: ConfidenceLevel;
    source?: string; // which document this was extracted from
}

export interface ExtractedService {
    id: string;
    name: ExtractedField;
    category: ExtractedField<ServiceCategory>;
    plan?: ExtractedField;
    costAmount: ExtractedField<number>;
    costFrequency: ExtractedField<CostFrequency>;
    currency: ExtractedField;
    renewalDate?: ExtractedField;
    logoUrl?: string;
}

export interface ExtractedProject {
    id: string;
    name: ExtractedField;
    type: ExtractedField<ProjectType>;
    icon: string;
    services: ExtractedService[];
    documents: UploadedDocument[];
    totalMonthlyCost: number;
    isConfirmed: boolean;
}

export interface ProjectImportSession {
    id: string;
    status: 'uploading' | 'processing' | 'review' | 'confirmed' | 'error';
    documents: UploadedDocument[];
    extractedProjects: ExtractedProject[];
    createdAt: string;
    completedAt?: string;
}

// Resource Types for project file organization
export type ResourceCategory = 'invoices' | 'receipts' | 'contracts' | 'logos' | 'screenshots' | 'other';

export interface ProjectResource {
    id: string;
    projectId: string;
    category: ResourceCategory;
    name: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
}
