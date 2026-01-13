import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Create rate limiter only if Redis is configured
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Different rate limiters for different use cases
export const rateLimiters = {
  // Auth endpoints: 5 requests per minute
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // API endpoints: 100 requests per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // Upload endpoints: 10 requests per minute
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        analytics: true,
        prefix: 'ratelimit:upload',
      })
    : null,
};

export type RateLimitType = keyof typeof rateLimiters;

export async function rateLimit(
  identifier: string,
  type: RateLimitType = 'api'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
  const limiter = rateLimiters[type];
  
  if (!limiter) {
    // Rate limiting not configured, allow request
    return null;
  }

  const result = await limiter.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export function rateLimitResponse(reset: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        'X-RateLimit-Reset': String(reset),
      },
    }
  );
}
