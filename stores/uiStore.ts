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

// Track toast timeouts to prevent memory leaks
const toastTimeouts = new Map<string, NodeJS.Timeout>();

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
    expandSidebar: () => void;
    collapseSidebar: () => void;
    hideSidebar: () => void;
    
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
            toggleSidebar: () => set((state) => {
                // Cycle through all states: expanded -> collapsed -> hidden -> expanded
                const stateOrder: SidebarState[] = ['expanded', 'collapsed', 'hidden'];
                const currentIndex = stateOrder.indexOf(state.sidebarState);
                const nextIndex = (currentIndex + 1) % stateOrder.length;
                return { sidebarState: stateOrder[nextIndex] };
            }),
            expandSidebar: () => set({ sidebarState: 'expanded' }),
            collapseSidebar: () => set({ sidebarState: 'collapsed' }),
            hideSidebar: () => set({ sidebarState: 'hidden' }),
            
            // Modals
            activeModal: { type: null },
            openModal: (type, data) => set({ activeModal: { type, data } }),
            closeModal: () => set({ activeModal: { type: null } }),
            
            // Toasts
            toasts: [],
            addToast: (toast) => {
                const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
                const newToast = { ...toast, id };
                set((state) => ({ toasts: [...state.toasts, newToast] }));
                
                // Auto-remove after duration (default 5 seconds)
                const duration = toast.duration ?? 5000;
                if (duration > 0) {
                    // Clear any existing timeout for this toast
                    const existingTimeout = toastTimeouts.get(id);
                    if (existingTimeout) {
                        clearTimeout(existingTimeout);
                    }
                    
                    // Set new timeout and store reference
                    const timeout = setTimeout(() => {
                        get().removeToast(id);
                    }, duration);
                    toastTimeouts.set(id, timeout);
                }
            },
            removeToast: (id) => {
                // Clear the timeout when toast is removed
                const timeout = toastTimeouts.get(id);
                if (timeout) {
                    clearTimeout(timeout);
                    toastTimeouts.delete(id);
                }
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            },
            clearToasts: () => {
                // Clear all timeouts
                toastTimeouts.forEach((timeout) => clearTimeout(timeout));
                toastTimeouts.clear();
                set({ toasts: [] });
            },
            
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
            name: 'nerlude-ui-storage',
            partialize: (state) => ({
                theme: state.theme,
                sidebarState: state.sidebarState,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
            }),
        }
    )
);
