/**
 * API Client
 * 
 * Centralized API client for making requests to our API routes.
 */

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(error.error || 'Request failed', response.status);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    request<{ user: { id: string; email: string; name: string }; message: string }>('/api/auth/register', { method: 'POST', body: data }),
  
  login: (data: { email: string; password: string }) =>
    request<{ user: { id: string; email: string; name: string; avatarUrl?: string }; session: unknown }>('/api/auth/login', { method: 'POST', body: data }),
  
  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
  
  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: { email } }),
  
  resetPassword: (password: string) =>
    request<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: { password } }),
};

// Users API
export const usersApi = {
  getMe: () =>
    request<any>('/api/users/me'),
  
  updateMe: (data: { name?: string; avatar_url?: string }) =>
    request<any>('/api/users/me', { method: 'PATCH', body: data }),
  
  deleteMe: () =>
    request<{ message: string }>('/api/users/me', { method: 'DELETE' }),
  
  getPreferences: () =>
    request<any>('/api/users/me/preferences'),
  
  updatePreferences: (data: any) =>
    request<any>('/api/users/me/preferences', { method: 'PATCH', body: data }),
  
  getOnboarding: () =>
    request<any>('/api/users/me/onboarding'),
  
  saveOnboarding: (data: any) =>
    request<any>('/api/users/me/onboarding', { method: 'POST', body: data }),
};

// Workspaces API
export const workspacesApi = {
  list: () =>
    request<any[]>('/api/workspaces'),
  
  get: (id: string) =>
    request<any>(`/api/workspaces/${id}`),
  
  create: (data: { name: string; workspace_type?: string }) =>
    request<any>('/api/workspaces', { method: 'POST', body: data }),
  
  update: (id: string, data: { name?: string; settings?: any }) =>
    request<any>(`/api/workspaces/${id}`, { method: 'PATCH', body: data }),
  
  delete: (id: string) =>
    request<{ message: string }>(`/api/workspaces/${id}`, { method: 'DELETE' }),
  
  // Members
  listMembers: (workspaceId: string) =>
    request<any[]>(`/api/workspaces/${workspaceId}/members`),
  
  inviteMember: (workspaceId: string, data: { email: string; role?: string }) =>
    request<any>(`/api/workspaces/${workspaceId}/members`, { method: 'POST', body: data }),
  
  updateMember: (workspaceId: string, userId: string, data: { role: string }) =>
    request<any>(`/api/workspaces/${workspaceId}/members/${userId}`, { method: 'PATCH', body: data }),
  
  removeMember: (workspaceId: string, userId: string) =>
    request<{ message: string }>(`/api/workspaces/${workspaceId}/members/${userId}`, { method: 'DELETE' }),
};

// Projects API
export const projectsApi = {
  list: (workspaceId?: string) =>
    request<any[]>(`/api/projects${workspaceId ? `?workspace_id=${workspaceId}` : ''}`),
  
  get: (id: string) =>
    request<any>(`/api/projects/${id}`),
  
  create: (data: { workspace_id: string; name: string; description?: string; icon?: string; type: string }) =>
    request<any>('/api/projects', { method: 'POST', body: data }),
  
  update: (id: string, data: any) =>
    request<any>(`/api/projects/${id}`, { method: 'PATCH', body: data }),
  
  delete: (id: string) =>
    request<{ message: string }>(`/api/projects/${id}`, { method: 'DELETE' }),
  
  // Services
  listServices: (projectId: string) =>
    request<any[]>(`/api/projects/${projectId}/services`),
  
  getService: (projectId: string, serviceId: string) =>
    request<any>(`/api/projects/${projectId}/services/${serviceId}`),
  
  addService: (projectId: string, data: any) =>
    request<any>(`/api/projects/${projectId}/services`, { method: 'POST', body: data }),
  
  updateService: (projectId: string, serviceId: string, data: any) =>
    request<any>(`/api/projects/${projectId}/services/${serviceId}`, { method: 'PATCH', body: data }),
  
  deleteService: (projectId: string, serviceId: string) =>
    request<{ message: string }>(`/api/projects/${projectId}/services/${serviceId}`, { method: 'DELETE' }),
  
  // Credentials
  getCredentials: (projectId: string, serviceId: string, environment?: string) =>
    request<any[]>(`/api/projects/${projectId}/services/${serviceId}/credentials${environment ? `?environment=${environment}` : ''}`),
  
  saveCredentials: (projectId: string, serviceId: string, data: { environment: string; credentials_encrypted: string }) =>
    request<any>(`/api/projects/${projectId}/services/${serviceId}/credentials`, { method: 'POST', body: data }),
  
  // Documents
  listDocuments: (projectId: string) =>
    request<any[]>(`/api/projects/${projectId}/documents`),
  
  getDocument: (projectId: string, docId: string) =>
    request<any>(`/api/projects/${projectId}/documents/${docId}`),
  
  createDocument: (projectId: string, data: { title: string; content?: string; doc_type: string; icon?: string; emoji?: string }) =>
    request<any>(`/api/projects/${projectId}/documents`, { method: 'POST', body: data }),
  
  updateDocument: (projectId: string, docId: string, data: any) =>
    request<any>(`/api/projects/${projectId}/documents/${docId}`, { method: 'PATCH', body: data }),
  
  deleteDocument: (projectId: string, docId: string) =>
    request<{ message: string }>(`/api/projects/${projectId}/documents/${docId}`, { method: 'DELETE' }),
  
  // Assets
  listAssets: (projectId: string) =>
    request<any[]>(`/api/projects/${projectId}/assets`),
  
  uploadAsset: (projectId: string, data: any) =>
    request<any>(`/api/projects/${projectId}/assets`, { method: 'POST', body: data }),
  
  deleteAsset: (projectId: string, assetId: string) =>
    request<{ message: string }>(`/api/projects/${projectId}/assets/${assetId}`, { method: 'DELETE' }),
  
  // Stacks
  listStacks: (projectId: string) =>
    request<any[]>(`/api/projects/${projectId}/stacks`),
  
  createStack: (projectId: string, data: { name: string; description?: string; color?: string; icon?: string }) =>
    request<any>(`/api/projects/${projectId}/stacks`, { method: 'POST', body: data }),
  
  updateStack: (projectId: string, stackId: string, data: any) =>
    request<any>(`/api/projects/${projectId}/stacks/${stackId}`, { method: 'PATCH', body: data }),
  
  deleteStack: (projectId: string, stackId: string) =>
    request<{ message: string }>(`/api/projects/${projectId}/stacks/${stackId}`, { method: 'DELETE' }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    request<{ totalProjects: number; totalServices: number; totalMonthlyCost: number; upcomingRenewals: number; activeAlerts: number }>('/api/dashboard/stats'),
  
  getAlerts: () =>
    request<any[]>('/api/dashboard/alerts'),
};

// Notifications API
export const notificationsApi = {
  list: (unreadOnly = false, limit = 50) =>
    request<any[]>(`/api/notifications?unread=${unreadOnly}&limit=${limit}`),
  
  markRead: (id: string) =>
    request<any>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  
  dismiss: (id: string) =>
    request<any>(`/api/notifications/${id}/dismiss`, { method: 'PATCH' }),
};

// Registry API
export const registryApi = {
  getCategories: () =>
    request<string[]>('/api/registry/categories'),
  
  getServices: (category?: string) =>
    request<any[]>(`/api/registry/services${category ? `?category=${category}` : ''}`),
};

export { ApiError };
