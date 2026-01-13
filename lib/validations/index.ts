import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(10).optional(),
  workspace_id: z.string().uuid('Invalid workspace ID'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(10).optional(),
});

// Service schemas
export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  service_type: z.string().min(1, 'Service type is required'),
  category: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  renewal_date: z.string().datetime().optional().nullable(),
  cost: z.number().min(0).optional(),
  billing_cycle: z.enum(['monthly', 'yearly', 'one-time', 'weekly']).optional(),
  stack_id: z.string().uuid().optional().nullable(),
});

export const updateServiceSchema = createServiceSchema.partial();

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

// Credential schemas
export const createCredentialSchema = z.object({
  credential_type: z.string().min(1, 'Credential type is required'),
  label: z.string().max(100).optional(),
  encrypted_value: z.string().min(1, 'Value is required'),
});

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
