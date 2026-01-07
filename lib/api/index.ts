/**
 * API Utilities
 * 
 * Helper functions for making API requests and handling responses.
 */

// API error class for consistent error handling
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Standard API response format
export interface ApiResponse<T> {
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>[];
    };
}

// Pagination format
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Fetches data from an API endpoint with error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Parsed response data
 */
export const apiFetch = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.error?.message || 'An error occurred',
            response.status,
            data.error?.code,
            data.error?.details
        );
    }

    return data;
};

/**
 * Creates query string from params object
 * @param params - Object with query parameters
 * @returns Query string (without leading ?)
 */
export const createQueryString = (
    params: Record<string, string | number | boolean | undefined>
): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.append(key, String(value));
        }
    });
    
    return searchParams.toString();
};

/**
 * API endpoints configuration
 * Centralized location for all API routes
 */
export const API_ROUTES = {
    // Auth
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password',
    },
    
    // Users
    users: {
        me: '/api/users/me',
    },
    
    // Workspaces
    workspaces: {
        list: '/api/workspaces',
        get: (id: string) => `/api/workspaces/${id}`,
        members: (id: string) => `/api/workspaces/${id}/members`,
    },
    
    // Projects
    projects: {
        list: '/api/projects',
        get: (id: string) => `/api/projects/${id}`,
        stats: (id: string) => `/api/projects/${id}/stats`,
        services: (id: string) => `/api/projects/${id}/services`,
        service: (projectId: string, serviceId: string) => 
            `/api/projects/${projectId}/services/${serviceId}`,
        credentials: (projectId: string, serviceId: string) =>
            `/api/projects/${projectId}/services/${serviceId}/credentials`,
        assets: (id: string) => `/api/projects/${id}/assets`,
        docs: (id: string) => `/api/projects/${id}/docs`,
        team: (id: string) => `/api/projects/${id}/members`,
    },
    
    // Registry
    registry: {
        categories: '/api/registry/categories',
        services: '/api/registry/services',
        service: (slug: string) => `/api/registry/services/${slug}`,
    },
    
    // Dashboard
    dashboard: {
        stats: '/api/dashboard/stats',
        alerts: '/api/dashboard/alerts',
        activity: '/api/dashboard/activity',
    },
    
    // Notifications
    notifications: {
        list: '/api/notifications',
        read: (id: string) => `/api/notifications/${id}/read`,
        dismiss: (id: string) => `/api/notifications/${id}/dismiss`,
        snooze: (id: string) => `/api/notifications/${id}/snooze`,
    },
} as const;
