/**
 * Authenticated test script for workspace and project flow
 * Tests the full flow with a real Supabase session
 * Run with: npx tsx scripts/test-authenticated-flow.ts
 */

// Load env vars from .env.local FIRST
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  console.log('Could not load .env.local');
}

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test user credentials - use existing test account or create one
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: unknown;
}

const results: TestResult[] = [];
let testWorkspaceId: string | null = null;
let testProjectId: string | null = null;

async function test(name: string, fn: () => Promise<unknown>) {
  try {
    const data = await fn();
    results.push({ name, passed: true, data });
    console.log(`✅ ${name}`);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMsg });
    console.log(`❌ ${name}: ${errorMsg}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 Testing Authenticated Workspace & Project Flow\n');
  console.log('='.repeat(50));

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: Sign in
  const session = await test('Sign in with test user', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    if (error) throw new Error(error.message);
    return { userId: data.user?.id, email: data.user?.email };
  });

  if (!session) {
    console.log('\n⚠️  Cannot continue without authentication.');
    console.log('Please set TEST_EMAIL and TEST_PASSWORD environment variables');
    console.log('or create a test user in Supabase.\n');
    return false;
  }

  // Test 2: Get current user's workspaces
  const workspaces = await test('Fetch user workspaces', async () => {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        role,
        workspace:workspaces (*)
      `)
      .eq('user_id', (session as { userId: string }).userId);
    
    if (error) throw new Error(error.message);
    return { count: data?.length || 0, workspaces: data };
  });

  // Test 3: Create a new workspace
  const newWorkspace = await test('Create new workspace', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: `Test Workspace ${Date.now()}`,
        slug: `test-workspace-${Date.now()}`,
        owner_id: (session as { userId: string }).userId,
        workspace_type: 'startup',
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    testWorkspaceId = data.id;
    
    // Add as member
    await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: (session as { userId: string }).userId,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    });
    
    return { id: data.id, name: data.name };
  });

  if (!testWorkspaceId) {
    console.log('\n⚠️  Cannot continue without workspace.');
    return false;
  }

  // Test 4: Create a project in the workspace
  const newProject = await test('Create project in workspace', async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: `Test Project ${Date.now()}`,
        workspace_id: testWorkspaceId,
        type: 'web',
        icon: '🚀',
        status: 'active',
        created_by: (session as { userId: string }).userId,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    testProjectId = data.id;
    return { id: data.id, name: data.name, workspaceId: data.workspace_id };
  });

  // Test 5: Verify project is in correct workspace
  await test('Verify project belongs to workspace', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', testProjectId)
      .single();
    
    if (error) throw new Error(error.message);
    if (data.workspace_id !== testWorkspaceId) {
      throw new Error('Project workspace_id does not match');
    }
    return { verified: true };
  });

  // Test 6: Get projects filtered by workspace
  await test('Get projects filtered by workspace', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', testWorkspaceId);
    
    if (error) throw new Error(error.message);
    return { count: data?.length || 0 };
  });

  // Test 7: Get dashboard stats for workspace
  await test('Get stats for specific workspace', async () => {
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', testWorkspaceId);
    
    return { projectCount };
  });

  // Test 8: Create a second workspace and verify isolation
  let secondWorkspaceId: string | null = null;
  await test('Create second workspace', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: `Second Workspace ${Date.now()}`,
        slug: `second-workspace-${Date.now()}`,
        owner_id: (session as { userId: string }).userId,
        workspace_type: 'personal',
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    secondWorkspaceId = data.id;
    
    await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: (session as { userId: string }).userId,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    });
    
    return { id: data.id, name: data.name };
  });

  // Test 9: Verify workspace isolation (project not in second workspace)
  await test('Verify workspace isolation', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', secondWorkspaceId);
    
    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      throw new Error('Second workspace should have no projects');
    }
    return { isolated: true, projectsInSecondWorkspace: 0 };
  });

  // Cleanup: Delete test data
  console.log('\n🧹 Cleaning up test data...');
  
  if (testProjectId) {
    await supabase.from('projects').delete().eq('id', testProjectId);
    console.log('  - Deleted test project');
  }
  
  if (testWorkspaceId) {
    await supabase.from('workspace_members').delete().eq('workspace_id', testWorkspaceId);
    await supabase.from('workspaces').delete().eq('id', testWorkspaceId);
    console.log('  - Deleted first test workspace');
  }
  
  if (secondWorkspaceId) {
    await supabase.from('workspace_members').delete().eq('workspace_id', secondWorkspaceId);
    await supabase.from('workspaces').delete().eq('id', secondWorkspaceId);
    console.log('  - Deleted second test workspace');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n');
  
  return failed === 0;
}

runTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
