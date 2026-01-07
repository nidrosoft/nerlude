import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModalType = 
    | 'newProject'
    | 'addService'
    | 'editProject'
    | 'editService'
    | 'deleteConfirm'
    | 'inviteTeamMember'
    | 'upgradeplan'
    | 'credentialView'
    | null;

export type ThemeMode = 'light' | 'dark' | 'system';

export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

interface ModalData {
    type: ModalType;
    data?: Record<string, unknown>;
}

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface UIState {
    // Theme
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    
    // Premium Plan (migrated from useEventsStore)
    isPremiumPlan: boolean;
    setIsPremiumPlan: (isPremium: boolean) => void;
    
    // Sidebar
    sidebarState: SidebarState;
    setSidebarState: (state: SidebarState) => void;
    toggleSidebar: () => void;
    
    // Modals
    activeModal: ModalData;
    openModal: (type: ModalType, data?: Record<string, unknown>) => void;
    closeModal: () => void;
    
    // Toasts
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
    
    // Loading States
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
    
    // Onboarding
    hasCompletedOnboarding: boolean;
    setOnboardingComplete: (complete: boolean) => void;
    
    // Search
    globalSearch: string;
    setGlobalSearch: (search: string) => void;
    
    // Command Palette
    isCommandPaletteOpen: boolean;
    setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            // Theme
            theme: 'system',
            setTheme: (theme) => set({ theme }),
            
            // Premium Plan (migrated from useEventsStore)
            isPremiumPlan: false,
            setIsPremiumPlan: (isPremiumPlan) => set({ isPremiumPlan }),
            
            // Sidebar
            sidebarState: 'expanded',
            setSidebarState: (sidebarState) => set({ sidebarState }),
            toggleSidebar: () => set((state) => ({
                sidebarState: state.sidebarState === 'expanded' ? 'collapsed' : 'expanded'
            })),
            
            // Modals
            activeModal: { type: null },
            openModal: (type, data) => set({ activeModal: { type, data } }),
            closeModal: () => set({ activeModal: { type: null } }),
            
            // Toasts
            toasts: [],
            addToast: (toast) => {
                const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const newToast = { ...toast, id };
                set((state) => ({ toasts: [...state.toasts, newToast] }));
                
                // Auto-remove after duration (default 5 seconds)
                const duration = toast.duration ?? 5000;
                if (duration > 0) {
                    setTimeout(() => {
                        get().removeToast(id);
                    }, duration);
                }
            },
            removeToast: (id) => set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id)
            })),
            clearToasts: () => set({ toasts: [] }),
            
            // Loading
            globalLoading: false,
            setGlobalLoading: (globalLoading) => set({ globalLoading }),
            
            // Onboarding
            hasCompletedOnboarding: false,
            setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
            
            // Search
            globalSearch: '',
            setGlobalSearch: (globalSearch) => set({ globalSearch }),
            
            // Command Palette
            isCommandPaletteOpen: false,
            setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
        }),
        {
            name: 'nelrude-ui-storage',
            partialize: (state) => ({
                theme: state.theme,
                sidebarState: state.sidebarState,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
            }),
        }
    )
);
