import { create } from 'zustand';

export type CredentialFieldType = 'text' | 'password' | 'url' | 'email' | 'api_key';

export interface CredentialField {
    id: string;
    label: string;
    type: CredentialFieldType;
    value: string;
    isSecret: boolean;
    lastCopied?: string;
}

export interface Credential {
    id: string;
    serviceId: string;
    projectId: string;
    environment: 'production' | 'staging' | 'development';
    fields: CredentialField[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
    lastAccessedAt?: string;
}

interface CredentialState {
    // State
    credentials: Credential[];
    isLoading: boolean;
    
    // Visibility tracking (for show/hide passwords)
    visibleFields: Set<string>;
    
    // Actions
    setCredentials: (credentials: Credential[]) => void;
    addCredential: (credential: Credential) => void;
    updateCredential: (id: string, updates: Partial<Credential>) => void;
    deleteCredential: (id: string) => void;
    
    // Get credentials by service or project
    getCredentialsByService: (serviceId: string) => Credential[];
    getCredentialsByProject: (projectId: string) => Credential[];
    
    // Field visibility
    toggleFieldVisibility: (fieldId: string) => void;
    showField: (fieldId: string) => void;
    hideField: (fieldId: string) => void;
    hideAllFields: () => void;
    
    // Copy tracking
    markFieldCopied: (credentialId: string, fieldId: string) => void;
    
    // Access logging
    logAccess: (credentialId: string) => void;
    
    // Loading
    setLoading: (loading: boolean) => void;
}

export const useCredentialStore = create<CredentialState>()((set, get) => ({
    // Initial State
    credentials: [],
    isLoading: false,
    visibleFields: new Set<string>(),

    // Credential Actions
    setCredentials: (credentials) => set({ credentials }),
    
    addCredential: (credential) => set((state) => ({
        credentials: [...state.credentials, credential]
    })),
    
    updateCredential: (id, updates) => set((state) => ({
        credentials: state.credentials.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
    })),
    
    deleteCredential: (id) => set((state) => ({
        credentials: state.credentials.filter((c) => c.id !== id)
    })),

    // Getters
    getCredentialsByService: (serviceId) => {
        return get().credentials.filter((c) => c.serviceId === serviceId);
    },
    
    getCredentialsByProject: (projectId) => {
        return get().credentials.filter((c) => c.projectId === projectId);
    },

    // Field Visibility
    toggleFieldVisibility: (fieldId) => set((state) => {
        const newVisibleFields = new Set(state.visibleFields);
        if (newVisibleFields.has(fieldId)) {
            newVisibleFields.delete(fieldId);
        } else {
            newVisibleFields.add(fieldId);
        }
        return { visibleFields: newVisibleFields };
    }),
    
    showField: (fieldId) => set((state) => {
        const newVisibleFields = new Set(state.visibleFields);
        newVisibleFields.add(fieldId);
        return { visibleFields: newVisibleFields };
    }),
    
    hideField: (fieldId) => set((state) => {
        const newVisibleFields = new Set(state.visibleFields);
        newVisibleFields.delete(fieldId);
        return { visibleFields: newVisibleFields };
    }),
    
    hideAllFields: () => set({ visibleFields: new Set<string>() }),

    // Copy Tracking
    markFieldCopied: (credentialId, fieldId) => set((state) => ({
        credentials: state.credentials.map((c) =>
            c.id === credentialId
                ? {
                    ...c,
                    fields: c.fields.map((f) =>
                        f.id === fieldId
                            ? { ...f, lastCopied: new Date().toISOString() }
                            : f
                    )
                }
                : c
        )
    })),

    // Access Logging
    logAccess: (credentialId) => set((state) => ({
        credentials: state.credentials.map((c) =>
            c.id === credentialId
                ? { ...c, lastAccessedAt: new Date().toISOString() }
                : c
        )
    })),

    // Loading
    setLoading: (isLoading) => set({ isLoading }),
}));
