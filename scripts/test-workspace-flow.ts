/**
 * Test script for workspace and project flow
 * Run with: npx tsx scripts/test-workspace-flow.ts
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: unknown;
}

const results: TestResult[] = [];

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
  console.log('\n🧪 Testing Workspace & Project Flow\n');
  console.log('=' .repeat(50));

  // Test 1: Check if server is running
  await test('Server is running', async () => {
    const res = await fetch(`${BASE_URL}/api/health`).catch(() => null);
    if (!res) {
      // Try the homepage instead
      const homeRes = await fetch(BASE_URL);
      if (!homeRes.ok) throw new Error('Server not responding');
      return { status: 'ok' };
    }
    return { status: 'ok' };
  });

  // Test 2: List workspaces API (will fail without auth, but tests endpoint exists)
  await test('GET /api/workspaces endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/workspaces`);
    // 401 is expected without auth, but means endpoint exists
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 3: Dashboard stats API
  await test('GET /api/dashboard/stats endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 4: Dashboard stats with workspace filter
  await test('GET /api/dashboard/stats?workspace_id=test accepts filter', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats?workspace_id=test-id`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 5: Projects API
  await test('GET /api/projects endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 6: Projects with workspace filter
  await test('GET /api/projects?workspace_id=test accepts filter', async () => {
    const res = await fetch(`${BASE_URL}/api/projects?workspace_id=test-id`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 7: Dashboard alerts API
  await test('GET /api/dashboard/alerts endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/alerts`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 8: Activity API
  await test('GET /api/activity endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/activity`);
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 9: Create workspace endpoint (POST)
  await test('POST /api/workspaces endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Workspace', workspace_type: 'personal' }),
    });
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (res.status === 400) return { status: 'endpoint exists (validation error expected)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

  // Test 10: Create project endpoint (POST)
  await test('POST /api/projects endpoint exists', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test Project', 
        type: 'web',
        workspace_id: 'test-workspace-id' 
      }),
    });
    if (res.status === 401) return { status: 'endpoint exists (auth required)' };
    if (res.status === 400) return { status: 'endpoint exists (validation error expected)' };
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  });

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
