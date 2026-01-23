import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email('Invalid email address');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ================================
// Authentication Schemas
// ================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long'),
});

// ================================
// Project Schemas
// ================================

// Valid project types from database check constraint
const projectTypes = ['web', 'mobile', 'extension', 'desktop', 'api', 'landing', 'embedded', 'game', 'ai', 'custom'] as const;
const projectStatuses = ['active', 'paused', 'archived'] as const;

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(10).optional(),
  workspace_id: z.string().uuid('Invalid workspace ID'),
  type: z.enum(projectTypes, { errorMap: () => ({ message: 'Invalid project type' }) }),
  services: z.array(z.string()).optional(),
  template_id: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(10).optional(),
  type: z.enum(projectTypes).optional(),
  status: z.enum(projectStatuses).optional(),
  settings: z.record(z.unknown()).optional(),
});

// ================================
// Service Schemas
// ================================

// Valid categories from database check constraint
const serviceCategories = ['infrastructure', 'identity', 'payments', 'communications', 'analytics', 'domains', 'distribution', 'devtools', 'marketing', 'other'] as const;
const costFrequencies = ['monthly', 'yearly', 'one-time'] as const;
const serviceStatuses = ['active', 'inactive', 'paused', 'deprecated'] as const;

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  category_id: z.enum(serviceCategories, { errorMap: () => ({ message: 'Invalid category' }) }),
  sub_category_id: z.string().optional(),
  registry_id: z.string().optional(),
  custom_logo_url: z.string().url().optional().or(z.literal('')),
  plan: z.string().max(100).optional(),
  cost_amount: z.number().min(0).optional().default(0),
  cost_frequency: z.enum(costFrequencies).optional().default('monthly'),
  currency: z.string().length(3).optional().default('USD'),
  renewal_date: z.string().optional().nullable(),
  notes: z.string().max(2000).optional(),
  stack_id: z.string().uuid().optional().nullable(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category_id: z.enum(serviceCategories).optional(),
  sub_category_id: z.string().optional(),
  plan: z.string().max(100).optional(),
  cost_amount: z.number().min(0).optional(),
  cost_frequency: z.enum(costFrequencies).optional(),
  currency: z.string().length(3).optional(),
  renewal_date: z.string().optional().nullable(),
  notes: z.string().max(2000).optional(),
  stack_id: z.string().uuid().optional().nullable(),
  status: z.enum(serviceStatuses).optional(),
});

// Workspace schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

// Member schemas
export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

// ================================
// Credential Schemas
// ================================

const credentialTypes = ['api_key', 'database', 'login', 'env_vars', 'ssh_key', 'webhook', 'oauth', 'custom'] as const;
const environments = ['production', 'staging', 'development'] as const;

export const createCredentialSchema = z.object({
  environment: z.enum(environments, { errorMap: () => ({ message: 'Invalid environment' }) }),
  type: z.enum(credentialTypes).optional(),
  fields: z.record(z.string()).optional(),
  credentials: z.record(z.unknown()).optional(),
  description: z.string().max(500).optional(),
}).refine(
  (data) => data.fields || data.credentials,
  { message: 'Either fields or credentials is required' }
);

// Document schemas
export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  file_type: z.string().min(1),
  file_size: z.number().int().positive(),
  file_path: z.string().min(1),
});

// Stack schemas
export const createStackSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
});

export const updateStackSchema = createStackSchema.partial();

// Helper function to validate request body
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { data: null, error: message };
    }
    return { data: null, error: 'Invalid request body' };
  }
}

// Helper function to validate query params
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { data: T; error: null } | { data: null; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const data = schema.parse(params);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { data: null, error: message };
    }
    return { data: null, error: 'Invalid query parameters' };
  }
}
