import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Service, Alert, DashboardStats, ProjectType } from '@/types';

interface ProjectState {
    // State
    projects: Project[];
    selectedProject: Project | null;
    services: Service[];
    alerts: Alert[];
    stats: DashboardStats;
    isLoading: boolean;
    
    // Filter State
    projectFilter: {
        status: string;
        type: string;
        search: string;
    };

    // Actions - Projects
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    setSelectedProject: (project: Project | null) => void;
    
    // Actions - Services
    setServices: (services: Service[]) => void;
    addService: (service: Service) => void;
    updateService: (id: string, updates: Partial<Service>) => void;
    deleteService: (id: string) => void;
    getServicesByProject: (projectId: string) => Service[];
    
    // Actions - Alerts
    setAlerts: (alerts: Alert[]) => void;
    addAlert: (alert: Alert) => void;
    dismissAlert: (id: string) => void;
    snoozeAlert: (id: string, until: string) => void;
    markAlertRead: (id: string) => void;
    
    // Actions - Stats
    setStats: (stats: DashboardStats) => void;
    recalculateStats: () => void;
    
    // Actions - Filters
    setProjectFilter: (filter: Partial<ProjectState['projectFilter']>) => void;
    resetFilters: () => void;
    
    // Loading
    setLoading: (loading: boolean) => void;
}

const initialStats: DashboardStats = {
    totalProjects: 0,
    monthlyBurn: 0,
    totalServices: 0,
    upcomingRenewals: 0,
};

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            // Initial State
            projects: [],
            selectedProject: null,
            services: [],
            alerts: [],
            stats: initialStats,
            isLoading: false,
            projectFilter: {
                status: 'all',
                type: 'all',
                search: '',
            },

            // Project Actions
            setProjects: (projects) => set({ projects }),
            
            addProject: (project) => set((state) => ({
                projects: [...state.projects, project]
            })),
            
            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? { ...p, ...updates } : p
                ),
                selectedProject: state.selectedProject?.id === id
                    ? { ...state.selectedProject, ...updates }
                    : state.selectedProject
            })),
            
            deleteProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
                selectedProject: state.selectedProject?.id === id 
                    ? null 
                    : state.selectedProject,
                services: state.services.filter((s) => s.projectId !== id),
                alerts: state.alerts.filter((a) => a.projectId !== id)
            })),
            
            setSelectedProject: (selectedProject) => set({ selectedProject }),

            // Service Actions
            setServices: (services) => set({ services }),
            
            addService: (service) => set((state) => ({
                services: [...state.services, service]
            })),
            
            updateService: (id, updates) => set((state) => ({
                services: state.services.map((s) =>
                    s.id === id ? { ...s, ...updates } : s
                )
            })),
            
            deleteService: (id) => set((state) => ({
                services: state.services.filter((s) => s.id !== id)
            })),
            
            getServicesByProject: (projectId) => {
                return get().services.filter((s) => s.projectId === projectId);
            },

            // Alert Actions
            setAlerts: (alerts) => set({ alerts }),
            
            addAlert: (alert) => set((state) => ({
                alerts: [...state.alerts, alert]
            })),
            
            dismissAlert: (id) => set((state) => ({
                alerts: state.alerts.map((a) =>
                    a.id === id ? { ...a, isDismissed: true } : a
                )
            })),
            
            snoozeAlert: (id, until) => set((state) => ({
                alerts: state.alerts.map((a) =>
                    a.id === id ? { ...a, snoozedUntil: until } : a
                )
            })),
            
            markAlertRead: (id) => set((state) => ({
                alerts: state.alerts.map((a) =>
                    a.id === id ? { ...a, isRead: true } : a
                )
            })),

            // Stats Actions
            setStats: (stats) => set({ stats }),
            
            recalculateStats: () => {
                const state = get();
                const now = new Date();
                const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                
                const monthlyBurn = state.services.reduce((total, service) => {
                    if (service.status !== 'active') return total;
                    if (service.costFrequency === 'monthly') {
                        return total + service.costAmount;
                    } else if (service.costFrequency === 'yearly') {
                        return total + (service.costAmount / 12);
                    }
                    return total;
                }, 0);
                
                const upcomingRenewals = state.services.filter((service) => {
                    if (!service.renewalDate) return false;
                    const renewalDate = new Date(service.renewalDate);
                    return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
                }).length;
                
                set({
                    stats: {
                        totalProjects: state.projects.length,
                        monthlyBurn: Math.round(monthlyBurn * 100) / 100,
                        totalServices: state.services.length,
                        upcomingRenewals,
                    }
                });
            },

            // Filter Actions
            setProjectFilter: (filter) => set((state) => ({
                projectFilter: { ...state.projectFilter, ...filter }
            })),
            
            resetFilters: () => set({
                projectFilter: {
                    status: 'all',
                    type: 'all',
                    search: '',
                }
            }),

            // Loading
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'nelrude-project-storage',
            partialize: (state) => ({
                projects: state.projects,
                services: state.services,
                alerts: state.alerts,
            }),
        }
    )
);
