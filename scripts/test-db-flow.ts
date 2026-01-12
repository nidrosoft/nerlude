/**
 * Database test script for workspace and project flow
 * Tests directly against Supabase using service role key
 * Run with: npx tsx scripts/test-db-flow.ts
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
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.log('SUPABASE_URL:', SUPABASE_URL ? '✓ set' : '✗ missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓ set' : '✗ missing');
  process.exit(1);
}

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: unknown;
}

const results: TestResult[] = [];
let testUserId: string | null = null;
let testWorkspaceId: string | null = null;
let testProjectId: string | null = null;
let secondWorkspaceId: string | null = null;

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
  console.log('\n🧪 Testing Workspace & Project Database Flow\n');
  console.log('='.repeat(50));

  // Initialize Supabase client with service role (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  });

  // Test 1: Get an existing user from the database
  const user = await test('Find existing user in database', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(1)
      .single();
    
    if (error) throw new Error(error.message);
    testUserId = data.id;
    return { id: data.id, email: data.email, name: data.name };
  });

  if (!testUserId) {
    console.log('\n⚠️  No users found in database. Creating a test user...');
    
    // Create a test user
    const newUser = await test('Create test user', async () => {
      const testId = `test-user-${Date.now()}`;
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: testId,
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      testUserId = data.id;
      return { id: data.id, email: data.email };
    });
    
    if (!testUserId) {
      console.log('\n⚠️  Cannot continue without a user.');
      return false;
    }
  }

  // Test 2: Get user's existing workspaces
  await test('Get user existing workspaces', async () => {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        role,
        workspace:workspaces (id, name, workspace_type)
      `)
      .eq('user_id', testUserId);
    
    if (error) throw new Error(error.message);
    return { count: data?.length || 0 };
  });

  // Test 3: Create a new workspace
  await test('Create new workspace', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: `Test Workspace ${Date.now()}`,
        slug: `test-workspace-${Date.now()}`,
        owner_id: testUserId,
        workspace_type: 'startup',
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    testWorkspaceId = data.id;
    
    // Add as member
    const { error: memberError } = await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: testUserId,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    });
    
    if (memberError) throw new Error(memberError.message);
    
    return { id: data.id, name: data.name, type: data.workspace_type };
  });

  if (!testWorkspaceId) {
    console.log('\n⚠️  Cannot continue without workspace.');
    return false;
  }

  // Test 4: Create a project in the workspace
  await test('Create project in workspace', async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: `Test Project ${Date.now()}`,
        workspace_id: testWorkspaceId,
        type: 'web',
        icon: '🚀',
        status: 'active',
        created_by: testUserId,
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
      throw new Error(`Project workspace_id (${data.workspace_id}) does not match expected (${testWorkspaceId})`);
    }
    return { verified: true, workspaceId: data.workspace_id };
  });

  // Test 6: Get projects filtered by workspace
  await test('Get projects filtered by workspace', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .eq('workspace_id', testWorkspaceId);
    
    if (error) throw new Error(error.message);
    return { count: data?.length || 0, projects: data?.map(p => p.name) };
  });

  // Test 7: Create a second workspace
  await test('Create second workspace', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: `Second Workspace ${Date.now()}`,
        slug: `second-workspace-${Date.now()}`,
        owner_id: testUserId,
        workspace_type: 'personal',
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    secondWorkspaceId = data.id;
    
    await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: testUserId,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    });
    
    return { id: data.id, name: data.name };
  });

  // Test 8: Verify workspace isolation (project not in second workspace)
  await test('Verify workspace isolation', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .eq('workspace_id', secondWorkspaceId);
    
    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      throw new Error(`Second workspace should have no projects, found ${data.length}`);
    }
    return { isolated: true, projectsInSecondWorkspace: 0 };
  });

  // Test 9: Verify first workspace has the project
  await test('Verify first workspace has project', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .eq('workspace_id', testWorkspaceId);
    
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error('First workspace should have at least 1 project');
    }
    return { projectCount: data.length };
  });

  // Cleanup: Delete test data
  console.log('\n🧹 Cleaning up test data...');
  
  if (testProjectId) {
    const { error } = await supabase.from('projects').delete().eq('id', testProjectId);
    console.log(`  - Deleted test project: ${error ? '❌ ' + error.message : '✓'}`);
  }
  
  if (testWorkspaceId) {
    await supabase.from('workspace_members').delete().eq('workspace_id', testWorkspaceId);
    const { error } = await supabase.from('workspaces').delete().eq('id', testWorkspaceId);
    console.log(`  - Deleted first test workspace: ${error ? '❌ ' + error.message : '✓'}`);
  }
  
  if (secondWorkspaceId) {
    await supabase.from('workspace_members').delete().eq('workspace_id', secondWorkspaceId);
    const { error } = await supabase.from('workspaces').delete().eq('id', secondWorkspaceId);
    console.log(`  - Deleted second test workspace: ${error ? '❌ ' + error.message : '✓'}`);
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
  } else {
    console.log('\n✅ All tests passed! Workspace isolation is working correctly.');
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
