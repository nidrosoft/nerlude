import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/db/server';

export async function GET() {
  const startTime = Date.now();
  
  let dbStatus = 'healthy';
  let dbLatency = 0;
  
  try {
    const supabase = await createServerSupabaseClient();
    const dbStart = Date.now();
    const { error } = await supabase.from('users').select('id').limit(1);
    dbLatency = Date.now() - dbStart;
    
    if (error) {
      dbStatus = 'degraded';
    }
  } catch {
    dbStatus = 'unhealthy';
  }

  const response = {
    status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks: {
      database: {
        status: dbStatus,
        latency_ms: dbLatency,
      },
    },
  };

  const statusCode = dbStatus === 'healthy' ? 200 : 503;
  
  return NextResponse.json(response, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
