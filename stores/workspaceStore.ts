import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace } from '@/types';

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface TeamMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: TeamRole;
    joinedAt: string;
    expiresAt?: string; // For temporary access
}

export interface WorkspaceSettings {
    defaultCurrency: string;
    timezone: string;
}

interface WorkspaceState {
    // State
    currentWorkspace: Workspace | null;
    workspaces: Workspace[];
    teamMembers: TeamMember[];
    settings: WorkspaceSettings;
    isLoading: boolean;

    // Actions
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    setWorkspaces: (workspaces: Workspace[]) => void;
    addWorkspace: (workspace: Workspace) => void;
    updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
    deleteWorkspace: (id: string) => void;
    
    // Team Actions
    setTeamMembers: (members: TeamMember[]) => void;
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
    removeTeamMember: (id: string) => void;
    
    // Settings Actions
    updateSettings: (updates: Partial<WorkspaceSettings>) => void;
    setLoading: (loading: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set) => ({
            // Initial State
            currentWorkspace: null,
            workspaces: [],
            teamMembers: [],
            settings: {
                defaultCurrency: 'USD',
                timezone: 'America/New_York',
            },
            isLoading: false,

            // Workspace Actions
            setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),
            
            setWorkspaces: (workspaces) => set({ workspaces }),
            
            addWorkspace: (workspace) => set((state) => ({
                workspaces: [...state.workspaces, workspace]
            })),
            
            updateWorkspace: (id, updates) => set((state) => ({
                workspaces: state.workspaces.map((w) =>
                    w.id === id ? { ...w, ...updates } : w
                ),
                currentWorkspace: state.currentWorkspace?.id === id
                    ? { ...state.currentWorkspace, ...updates }
                    : state.currentWorkspace
            })),
            
            deleteWorkspace: (id) => set((state) => ({
                workspaces: state.workspaces.filter((w) => w.id !== id),
                currentWorkspace: state.currentWorkspace?.id === id 
                    ? null 
                    : state.currentWorkspace
            })),

            // Team Actions
            setTeamMembers: (teamMembers) => set({ teamMembers }),
            
            addTeamMember: (member) => set((state) => ({
                teamMembers: [...state.teamMembers, member]
            })),
            
            updateTeamMember: (id, updates) => set((state) => ({
                teamMembers: state.teamMembers.map((m) =>
                    m.id === id ? { ...m, ...updates } : m
                )
            })),
            
            removeTeamMember: (id) => set((state) => ({
                teamMembers: state.teamMembers.filter((m) => m.id !== id)
            })),

            // Settings Actions
            updateSettings: (updates) => set((state) => ({
                settings: { ...state.settings, ...updates }
            })),
            
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'nelrude-workspace-storage',
            partialize: (state) => ({
                currentWorkspace: state.currentWorkspace,
                settings: state.settings,
            }),
        }
    )
);
