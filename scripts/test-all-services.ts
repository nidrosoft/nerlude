/**
 * Test Script: Batch Insert All Services
 * 
 * This script tests inserting one service from each category into the database
 * to verify all categories and service types work correctly.
 * 
 * Run with: npx ts-node --skip-project scripts/test-all-services.ts
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aypljmeoqchkrmabjevz.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('Set it with: export SUPABASE_SERVICE_ROLE_KEY="your-key"');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// All services from the registry with their categories
const testServices = [
    // Infrastructure
    { id: 'vercel', name: 'Vercel', category: 'infrastructure', plan: 'Pro', cost: 20, frequency: 'monthly' },
    { id: 'railway', name: 'Railway', category: 'infrastructure', plan: 'Pro', cost: 20, frequency: 'monthly' },
    { id: 'netlify', name: 'Netlify', category: 'infrastructure', plan: 'Pro', cost: 19, frequency: 'monthly' },
    { id: 'aws', name: 'AWS', category: 'infrastructure', plan: 'Pay as you go', cost: 50, frequency: 'monthly' },
    { id: 'supabase', name: 'Supabase', category: 'infrastructure', plan: 'Pro', cost: 25, frequency: 'monthly' },
    { id: 'planetscale', name: 'PlanetScale', category: 'infrastructure', plan: 'Scaler', cost: 29, frequency: 'monthly' },
    { id: 'mongodb', name: 'MongoDB Atlas', category: 'infrastructure', plan: 'Dedicated', cost: 57, frequency: 'monthly' },
    { id: 'neon', name: 'Neon', category: 'infrastructure', plan: 'Pro', cost: 19, frequency: 'monthly' },
    { id: 'upstash', name: 'Upstash', category: 'infrastructure', plan: 'Pro', cost: 280, frequency: 'monthly' },
    { id: 'cloudinary', name: 'Cloudinary', category: 'infrastructure', plan: 'Plus', cost: 99, frequency: 'monthly' },
    { id: 'uploadthing', name: 'UploadThing', category: 'infrastructure', plan: 'Pro', cost: 10, frequency: 'monthly' },
    
    // Domains
    { id: 'namecheap', name: 'Namecheap', category: 'domains', plan: 'Domain', cost: 12, frequency: 'yearly' },
    { id: 'cloudflare', name: 'Cloudflare', category: 'domains', plan: 'Pro', cost: 20, frequency: 'monthly' },
    { id: 'porkbun', name: 'Porkbun', category: 'domains', plan: 'Domain', cost: 10, frequency: 'yearly' },
    
    // Identity
    { id: 'clerk', name: 'Clerk', category: 'identity', plan: 'Pro', cost: 25, frequency: 'monthly' },
    { id: 'auth0', name: 'Auth0', category: 'identity', plan: 'Essential', cost: 23, frequency: 'monthly' },
    
    // Payments
    { id: 'stripe', name: 'Stripe', category: 'payments', plan: 'Standard', cost: 0, frequency: 'monthly' },
    { id: 'lemonsqueezy', name: 'Lemon Squeezy', category: 'payments', plan: 'Standard', cost: 0, frequency: 'monthly' },
    { id: 'paddle', name: 'Paddle', category: 'payments', plan: 'Standard', cost: 0, frequency: 'monthly' },
    
    // Communications
    { id: 'resend', name: 'Resend', category: 'communications', plan: 'Pro', cost: 20, frequency: 'monthly' },
    { id: 'sendgrid', name: 'SendGrid', category: 'communications', plan: 'Pro', cost: 90, frequency: 'monthly' },
    { id: 'postmark', name: 'Postmark', category: 'communications', plan: 'Basic', cost: 50, frequency: 'monthly' },
    
    // Analytics
    { id: 'posthog', name: 'PostHog', category: 'analytics', plan: 'Growth', cost: 0, frequency: 'monthly' },
    { id: 'plausible', name: 'Plausible', category: 'analytics', plan: 'Growth', cost: 9, frequency: 'monthly' },
    { id: 'mixpanel', name: 'Mixpanel', category: 'analytics', plan: 'Growth', cost: 28, frequency: 'monthly' },
    { id: 'sentry', name: 'Sentry', category: 'analytics', plan: 'Team', cost: 26, frequency: 'monthly' },
    { id: 'logrocket', name: 'LogRocket', category: 'analytics', plan: 'Team', cost: 99, frequency: 'monthly' },
    
    // DevTools
    { id: 'openai', name: 'OpenAI', category: 'devtools', plan: 'Pay as you go', cost: 100, frequency: 'monthly' },
    { id: 'anthropic', name: 'Anthropic', category: 'devtools', plan: 'Pay as you go', cost: 50, frequency: 'monthly' },
    { id: 'replicate', name: 'Replicate', category: 'devtools', plan: 'Pay as you go', cost: 30, frequency: 'monthly' },
    { id: 'github', name: 'GitHub', category: 'devtools', plan: 'Team', cost: 4, frequency: 'monthly' },
    { id: 'linear', name: 'Linear', category: 'devtools', plan: 'Standard', cost: 8, frequency: 'monthly' },
    
    // Distribution
    { id: 'apple-developer', name: 'Apple Developer', category: 'distribution', plan: 'Individual', cost: 99, frequency: 'yearly' },
    { id: 'google-play', name: 'Google Play Console', category: 'distribution', plan: 'Developer', cost: 25, frequency: 'one-time' },
    
    // Marketing
    { id: 'google-ads', name: 'Google Ads', category: 'marketing', plan: 'Pay as you go', cost: 500, frequency: 'monthly' },
    { id: 'meta-business', name: 'Meta Business Suite', category: 'marketing', plan: 'Pay as you go', cost: 300, frequency: 'monthly' },
    { id: 'tiktok-ads', name: 'TikTok Ads', category: 'marketing', plan: 'Pay as you go', cost: 200, frequency: 'monthly' },
    { id: 'linkedin-ads', name: 'LinkedIn Ads', category: 'marketing', plan: 'Pay as you go', cost: 400, frequency: 'monthly' },
    { id: 'canva', name: 'Canva', category: 'marketing', plan: 'Pro', cost: 13, frequency: 'monthly' },
    { id: 'figma', name: 'Figma', category: 'marketing', plan: 'Professional', cost: 15, frequency: 'monthly' },
    { id: 'buffer', name: 'Buffer', category: 'marketing', plan: 'Essentials', cost: 6, frequency: 'monthly' },
    { id: 'hootsuite', name: 'Hootsuite', category: 'marketing', plan: 'Professional', cost: 99, frequency: 'monthly' },
    { id: 'ahrefs', name: 'Ahrefs', category: 'marketing', plan: 'Standard', cost: 199, frequency: 'monthly' },
    { id: 'semrush', name: 'SEMrush', category: 'marketing', plan: 'Pro', cost: 130, frequency: 'monthly' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'marketing', plan: 'Standard', cost: 20, frequency: 'monthly' },
    { id: 'hubspot', name: 'HubSpot', category: 'marketing', plan: 'Starter', cost: 20, frequency: 'monthly' },
    { id: 'zapier', name: 'Zapier', category: 'marketing', plan: 'Professional', cost: 49, frequency: 'monthly' },
];

async function getTestProject(): Promise<string | null> {
    // Get the first available project to add services to
    const { data: projects, error } = await supabase
        .from('projects')
        .select('id, name')
        .limit(1);
    
    if (error || !projects || projects.length === 0) {
        console.error('❌ No projects found. Please create a project first.');
        return null;
    }
    
    console.log(`📁 Using project: ${projects[0].name} (${projects[0].id})`);
    return projects[0].id;
}

async function clearTestServices(projectId: string): Promise<void> {
    console.log('\n🧹 Clearing existing test services...');
    
    const { error } = await supabase
        .from('project_services')
        .delete()
        .eq('project_id', projectId);
    
    if (error) {
        console.error('⚠️ Warning: Could not clear services:', error.message);
    } else {
        console.log('✅ Cleared existing services');
    }
}

async function insertService(projectId: string, service: typeof testServices[0]): Promise<{ success: boolean; error?: string }> {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    
    const { error } = await supabase
        .from('project_services')
        .insert({
            project_id: projectId,
            registry_id: service.id,
            category_id: service.category,
            name: service.name,
            plan: service.plan,
            cost_amount: service.cost,
            cost_frequency: service.frequency,
            renewal_date: renewalDate.toISOString(),
            status: 'active',
            notes: `Test service - ${service.category}`,
        });
    
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

async function runTests(): Promise<void> {
    console.log('🚀 Starting Service Batch Insert Test\n');
    console.log('=' .repeat(60));
    
    // Get a project to test with
    const projectId = await getTestProject();
    if (!projectId) {
        process.exit(1);
    }
    
    // Clear existing services
    await clearTestServices(projectId);
    
    console.log(`\n📝 Testing ${testServices.length} services across all categories...\n`);
    
    const results: { category: string; service: string; success: boolean; error?: string }[] = [];
    const categoryStats: Record<string, { total: number; success: number; failed: number }> = {};
    
    for (const service of testServices) {
        // Initialize category stats
        if (!categoryStats[service.category]) {
            categoryStats[service.category] = { total: 0, success: 0, failed: 0 };
        }
        categoryStats[service.category].total++;
        
        const result = await insertService(projectId, service);
        results.push({
            category: service.category,
            service: service.name,
            success: result.success,
            error: result.error,
        });
        
        if (result.success) {
            categoryStats[service.category].success++;
            console.log(`  ✅ ${service.category.padEnd(15)} | ${service.name}`);
        } else {
            categoryStats[service.category].failed++;
            console.log(`  ❌ ${service.category.padEnd(15)} | ${service.name} - ${result.error}`);
        }
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESULTS SUMMARY\n');
    
    const totalSuccess = results.filter(r => r.success).length;
    const totalFailed = results.filter(r => !r.success).length;
    
    console.log('By Category:');
    for (const [category, stats] of Object.entries(categoryStats)) {
        const status = stats.failed === 0 ? '✅' : '⚠️';
        console.log(`  ${status} ${category.padEnd(15)} | ${stats.success}/${stats.total} passed`);
    }
    
    console.log('\n' + '-'.repeat(60));
    console.log(`\n📈 Total: ${totalSuccess}/${testServices.length} services inserted successfully`);
    
    if (totalFailed > 0) {
        console.log(`\n❌ Failed services (${totalFailed}):`);
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.service} (${r.category}): ${r.error}`);
        });
    } else {
        console.log('\n🎉 All services inserted successfully!');
    }
    
    console.log('\n' + '=' .repeat(60));
}

// Run the tests
runTests().catch(console.error);
