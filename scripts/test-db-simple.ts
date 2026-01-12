/**
 * Simple database test script using anon key
 * Run with: npx tsx scripts/test-db-simple.ts
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

console.log('\n🧪 Testing Database Connection & Schema\n');
console.log('='.repeat(50));

async function runTests() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  let passed = 0;
  let failed = 0;

  // Test 1: Check workspaces table exists
  console.log('\n📋 Testing table structure...\n');
  
  try {
    const { error } = await supabase.from('workspaces').select('id').limit(0);
    if (error && !error.message.includes('permission')) throw error;
    console.log('✅ workspaces table exists');
    passed++;
  } catch (e) {
    console.log('❌ workspaces table:', e);
    failed++;
  }

  try {
    const { error } = await supabase.from('workspace_members').select('id').limit(0);
    if (error && !error.message.includes('permission')) throw error;
    console.log('✅ workspace_members table exists');
    passed++;
  } catch (e) {
    console.log('❌ workspace_members table:', e);
    failed++;
  }

  try {
    const { error } = await supabase.from('projects').select('id').limit(0);
    if (error && !error.message.includes('permission')) throw error;
    console.log('✅ projects table exists');
    passed++;
  } catch (e) {
    console.log('❌ projects table:', e);
    failed++;
  }

  try {
    const { error } = await supabase.from('project_services').select('id').limit(0);
    if (error && !error.message.includes('permission')) throw error;
    console.log('✅ project_services table exists');
    passed++;
  } catch (e) {
    console.log('❌ project_services table:', e);
    failed++;
  }

  try {
    const { error } = await supabase.from('audit_logs').select('id').limit(0);
    if (error && !error.message.includes('permission')) throw error;
    console.log('✅ audit_logs table exists');
    passed++;
  } catch (e) {
    console.log('❌ audit_logs table:', e);
    failed++;
  }

  // Test 2: Check projects has workspace_id column
  console.log('\n📋 Testing workspace_id column in projects...\n');
  
  try {
    const { error } = await supabase.from('projects').select('workspace_id').limit(0);
    if (error) throw error;
    console.log('✅ projects.workspace_id column exists');
    passed++;
  } catch (e) {
    console.log('❌ projects.workspace_id:', e);
    failed++;
  }

  // Test 3: Check workspaces has workspace_type column
  try {
    const { error } = await supabase.from('workspaces').select('workspace_type').limit(0);
    if (error) throw error;
    console.log('✅ workspaces.workspace_type column exists');
    passed++;
  } catch (e) {
    console.log('❌ workspaces.workspace_type:', e);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  return failed === 0;
}

runTests()
  .then(success => {
    if (success) {
      console.log('✅ Database schema is correctly set up for multi-workspace support!\n');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });
