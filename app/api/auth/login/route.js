/**
 * Admin Authentication
 * 
 * SECURITY FIXES:
 * - Rate limiting: 3 login attempts per 15 minutes per IP
 * - JWT tokens with 24-hour expiration
 * - Secure password comparison
 */

import { SignJWT } from 'jose';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getSecurityHeaders } from '@/lib/security-headers';
import { logRateLimitExceeded, logFailedAuth } from '@/lib/security-logger';

// Rate limiter for login attempts: 3 per 15 minutes
let loginRateLimit;
try {
  loginRateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(3, "15 m"),
    analytics: true,
  });
} catch (e) {
  console.warn('⚠️ Login rate limiting disabled - Upstash not configured');
}

// JWT secret from environment
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

export async function POST(request) {
  try {
    // SECURITY FIX: Rate limit login attempts (3 per 15 minutes per IP)
    if (loginRateLimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      
      const { success, limit, remaining, reset } = await loginRateLimit.limit(`login:${ip}`);
      
      if (!success) {
        const resetTime = Math.ceil((reset - Date.now()) / 1000 / 60);
        logRateLimitExceeded(ip, '/api/auth/login', limit, remaining);
        return Response.json(
          { 
            success: false, 
            error: `Too many login attempts. Please try again in ${resetTime} minutes.` 
          },
          { status: 429 }
        );
      }
      
      console.log(`✅ Login rate limit OK: ${remaining}/${limit} remaining for ${ip}`);
    }

    const { password } = await request.json();

    // Validate password against environment variable
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mvpopup2026';

    if (password === ADMIN_PASSWORD) {
      // SECURITY FIX: Generate JWT with 24-hour expiration
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      console.log('✅ Admin login successful');
      
      return Response.json(
        {
          success: true,
          token: token
        },
        { headers: getSecurityHeaders() }
      );
    } else {
      logFailedAuth(ip, 'invalid_password');
      return Response.json(
        { success: false, error: 'Invalid password' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    return Response.json(
      { success: false, error: 'Login failed' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
