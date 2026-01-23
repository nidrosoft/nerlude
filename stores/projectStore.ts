import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Service, Alert, DashboardStats, ProjectType, ServiceStack, ProjectEnvironment } from '@/types';

// Recent service access record
interface RecentServiceAccess {
    serviceId: string;
    projectId: string;
    accessedAt: string;
}

interface ProjectState {
    // State
    projects: Project[];
    selectedProject: Project | null;
    services: Service[];
    stacks: ServiceStack[];
    alerts: Alert[];
    stats: DashboardStats;
    isLoading: boolean;
    
    // Environment State
    activeEnvironment: ProjectEnvironment;
    
    // Quick Access State
    pinnedServiceIds: string[];
    recentServiceAccesses: RecentServiceAccess[];
    
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
    
    // Actions - Stacks
    setStacks: (stacks: ServiceStack[]) => void;
    addStack: (stack: ServiceStack) => void;
    updateStack: (id: string, updates: Partial<ServiceStack>) => void;
    deleteStack: (id: string) => void;
    getStacksByProject: (projectId: string) => ServiceStack[];
    getServicesByStack: (stackId: string) => Service[];
    assignServiceToStack: (serviceId: string, stackId: string | null) => void;
    
    // Actions - Environment
    setActiveEnvironment: (env: ProjectEnvironment) => void;
    
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
    
    // Actions - Quick Access
    pinService: (serviceId: string) => void;
    unpinService: (serviceId: string) => void;
    togglePinService: (serviceId: string) => void;
    isServicePinned: (serviceId: string) => boolean;
    recordServiceAccess: (serviceId: string, projectId: string) => void;
    getPinnedServices: () => Service[];
    getRecentServices: (limit?: number) => Service[];
    
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
            stacks: [],
            alerts: [],
            stats: initialStats,
            isLoading: false,
            activeEnvironment: 'production',
            pinnedServiceIds: [],
            recentServiceAccesses: [],
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

            // Stack Actions
            setStacks: (stacks) => set({ stacks }),
            
            addStack: (stack) => set((state) => ({
                stacks: [...state.stacks, stack]
            })),
            
            updateStack: (id, updates) => set((state) => ({
                stacks: state.stacks.map((s) =>
                    s.id === id ? { ...s, ...updates } : s
                )
            })),
            
            deleteStack: (id) => set((state) => ({
                stacks: state.stacks.filter((s) => s.id !== id),
                // Remove stack assignment from services
                services: state.services.map((s) =>
                    s.stackId === id ? { ...s, stackId: undefined } : s
                )
            })),
            
            getStacksByProject: (projectId) => {
                return get().stacks.filter((s) => s.projectId === projectId);
            },
            
            getServicesByStack: (stackId) => {
                return get().services.filter((s) => s.stackId === stackId);
            },
            
            assignServiceToStack: (serviceId, stackId) => set((state) => ({
                services: state.services.map((s) =>
                    s.id === serviceId ? { ...s, stackId: stackId || undefined } : s
                )
            })),
            
            // Environment Actions
            setActiveEnvironment: (activeEnvironment) => set({ activeEnvironment }),

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

            // Quick Access Actions
            pinService: (serviceId) => set((state) => ({
                pinnedServiceIds: state.pinnedServiceIds.includes(serviceId)
                    ? state.pinnedServiceIds
                    : [...state.pinnedServiceIds, serviceId]
            })),
            
            unpinService: (serviceId) => set((state) => ({
                pinnedServiceIds: state.pinnedServiceIds.filter(id => id !== serviceId)
            })),
            
            togglePinService: (serviceId) => set((state) => ({
                pinnedServiceIds: state.pinnedServiceIds.includes(serviceId)
                    ? state.pinnedServiceIds.filter(id => id !== serviceId)
                    : [...state.pinnedServiceIds, serviceId]
            })),
            
            isServicePinned: (serviceId) => {
                return get().pinnedServiceIds.includes(serviceId);
            },
            
            recordServiceAccess: (serviceId, projectId) => set((state) => {
                const newAccess = {
                    serviceId,
                    projectId,
                    accessedAt: new Date().toISOString(),
                };
                
                // Remove existing entry for this service and add new one at the front
                const filtered = state.recentServiceAccesses.filter(
                    r => r.serviceId !== serviceId
                );
                
                // Keep only last 10 recent accesses
                const updated = [newAccess, ...filtered].slice(0, 10);
                
                return { recentServiceAccesses: updated };
            }),
            
            getPinnedServices: () => {
                const state = get();
                return state.services.filter(s => 
                    state.pinnedServiceIds.includes(s.id)
                );
            },
            
            getRecentServices: (limit = 5) => {
                const state = get();
                return state.recentServiceAccesses
                    .slice(0, limit)
                    .map(r => state.services.find(s => s.id === r.serviceId))
                    .filter((s): s is Service => s !== undefined);
            },

            // Loading
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'nerlude-project-storage',
            partialize: (state) => ({
                projects: state.projects,
                services: state.services,
                stacks: state.stacks,
                alerts: state.alerts,
                activeEnvironment: state.activeEnvironment,
                pinnedServiceIds: state.pinnedServiceIds,
                recentServiceAccesses: state.recentServiceAccesses,
            }),
        }
    )
);
