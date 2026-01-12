/**
 * Authentication Utilities
 * 
 * This module contains the auth context provider and hooks for Supabase Auth.
 */

// Re-export from AuthProvider
export { AuthProvider, useAuth } from './AuthProvider';

// Legacy type exports for compatibility
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
}

export interface AuthSession {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
