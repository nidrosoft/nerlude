import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    
    // Actions
    setUser: (user: User | null) => void;
    login: (user: User) => void;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            
            login: (user) => set({ 
                user, 
                isAuthenticated: true,
                isLoading: false 
            }),
            
            logout: () => set({ 
                user: null, 
                isAuthenticated: false 
            }),
            
            updateProfile: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),
            
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'nerlude-user-storage',
            partialize: (state) => ({ 
                user: state.user,
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);
