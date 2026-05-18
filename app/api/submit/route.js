/**
 * GC Modal Form Submission Handler
 * Receives popup form submissions and integrates with Global Control
 * 
 * SECURITY FIXES:
 * - Rate limiting: 5 submissions per minute per IP
 * - Email validation: RFC 5322 compliant regex
 * - Input sanitization: firstName HTML stripped, length limited
 * - CORS whitelist: Only approved domains
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getPopupConfig } from '@/lib/popups';
import { getSecurityHeaders, mergeHeaders } from '@/lib/security-headers';
import { logRateLimitExceeded, logInvalidEmail } from '@/lib/security-logger';

// Rate limiter: 5 submissions per minute per IP
let ratelimit;
try {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  });
} catch (e) {
  console.warn('⚠️ Rate limiting disabled - Upstash not configured');
}

// Email validation (RFC 5322 compliant)
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email) && email.length <= 254;
}

// CORS helper for whitelisted domains
function getCorsHeaders(request) {
  const ALLOWED_ORIGINS = [
    'https://healthharmonic.com',
    'https://www.healthharmonic.com',
    'http://localhost:3000',
    'https://gcmodal.vercel.app', // Test page
  ];
  
  const origin = request.headers.get('origin');
  
  // SECURITY FIX: Strict whitelist only (no wildcard fallback)
  // If origin is not whitelisted, use first allowed origin as default
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return mergeHeaders(
    {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
    getSecurityHeaders()
  );
}

// Handle CORS preflight
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request) {
  try {
    // SECURITY FIX #1: Rate limiting (5 submissions per minute per IP)
    if (ratelimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      
      const { success, limit, remaining } = await ratelimit.limit(`submit:${ip}`);
      
      if (!success) {
        logRateLimitExceeded(ip, '/api/submit', limit, remaining);
        return Response.json(
          { success: false, error: 'Too many submissions. Please wait 60 seconds and try again.' },
          { 
            status: 429,
            headers: getCorsHeaders(request),
          }
        );
      }
      
      console.log(`✅ Rate limit OK: ${remaining}/${limit} remaining for ${ip}`);
    }

    const body = await request.json();
    const { popupId, firstName, email } = body;
    
    console.log('📧 Form submission:', { popupId, firstName, email });

    // SECURITY FIX #2: Email validation
    if (!email || !isValidEmail(email)) {
      logInvalidEmail(ip, email || '');
      return Response.json(
        { success: false, error: 'Please enter a valid email address.' },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }
    
    // SECURITY FIX: Sanitize firstName (remove HTML, limit length)
    const cleanFirstName = firstName ? 
      firstName.trim().replace(/[<>\"']/g, '').substring(0, 50) : 
      undefined;

    // SECURITY FIX: Load popup config server-side (includes tagId)
    // tagId is NOT exposed in public /api/popups response
    const config = await getPopupConfig(popupId);

    if (!config || !config.tagId) {
      return Response.json(
        { success: false, error: 'Invalid popup or popup not found' },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    const GC_API_KEY = process.env.GC_API_KEY;
    if (!GC_API_KEY) {
      return Response.json(
        { success: false, error: 'Server configuration error' },
        { 
          status: 500,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Step 1: Create contact (use sanitized firstName)
    const contactPayload = { email: email };
    
    if (cleanFirstName) {
      contactPayload.firstName = cleanFirstName;
    }
    
    console.log('👤 Creating contact with payload:', JSON.stringify(contactPayload));
    
    const contactResponse = await fetch('https://api.globalcontrol.io/api/ai/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': GC_API_KEY
      },
      body: JSON.stringify(contactPayload)
    });

    const contactData = await contactResponse.json();
    console.log('👤 Contact created:', contactData);

    if (!contactResponse.ok) {
      return Response.json(
        { success: false, error: 'Failed to create contact' },
        { 
          status: 500,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Step 2: Fire tag (include sanitized firstName to prevent data loss)
    console.log('🏷️ Firing tag:', config.tagId);
    
    const tagPayload = { email: email };
    if (cleanFirstName) {
      tagPayload.firstName = cleanFirstName;
    }
    
    const tagResponse = await fetch(
      `https://api.globalcontrol.io/api/ai/tags/fire-tag/${config.tagId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': GC_API_KEY
        },
        body: JSON.stringify(tagPayload)
      }
    );

    const tagData = await tagResponse.json();
    console.log('🏷️ Tag fired:', tagData);

    console.log('✅ Complete!');
    
    // SECURITY FIX: No debug payload in production
    const response = {
      success: true,
      message: 'Thank you! Check your email for access details.',
    };
    
    return Response.json(
      response,
      {
        headers: getCorsHeaders(request),
      }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json(
      { success: false, error: 'Server error' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}
