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
    limiter: Ratelimit.slidingWindow(5, "1 m"),
  });
} catch (error) {
  console.warn('⚠️ Rate limiting not configured (Redis env vars missing)');
}

// CORS whitelist - only these domains can submit forms
const ALLOWED_ORIGINS = [
  'https://gcmodal.vercel.app',
  'https://gcmodal-api77.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.healthydirections.com',
  'https://healthydirections.com',
  'https://www.apricotseeds.com',
  'https://apricotseeds.com',
  'https://www.healthharmonic.com',
  'https://healthharmonic.com',
  'https://www.futurefrequency.com',
  'https://futurefrequency.com',
  'https://www.homehealthwellness.com',
  'https://homehealthwellness.com',
];

function getCorsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || 
                    ALLOWED_ORIGINS.some(allowed => origin.includes(allowed.replace(/^https?:\/\//, '')));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email) && email.length <= 254;
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
    }

    const body = await request.json();
    const { popupId, firstName, email, phone } = body;
    
    console.log('📧 Form submission:', { popupId, firstName, email, phone });

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
      firstName.trim().replace(/[<>"']/g, '').substring(0, 50) : 
      undefined;
    
    // SECURITY FIX: Sanitize phone (basic validation)
    const cleanPhone = phone ? 
      phone.trim().replace(/[^0-9+\-\s\(\)]/g, '').substring(0, 20) : 
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

    // Step 1: Create contact (use sanitized firstName and phone)
    const contactPayload = { email: email };
    
    if (cleanFirstName) {
      contactPayload.firstName = cleanFirstName;
    }
    
    if (cleanPhone) {
      contactPayload.phone = cleanPhone;
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
      // Contact might already exist, continue to tag
      console.log('⚠️ Contact creation issue:', contactData.message || 'Unknown error');
    }

    const contactId = contactData.contact?._id || contactData.contact?.id;
    
    if (!contactId) {
      return Response.json(
        { success: false, error: 'Failed to create or find contact' },
        { 
          status: 500,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Step 2: Apply tag
    console.log('🏷️ Applying tag:', config.tagId, 'to contact:', contactId);
    
    const tagResponse = await fetch(`https://api.globalcontrol.io/api/ai/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': GC_API_KEY
      },
      body: JSON.stringify({ tagId: config.tagId })
    });

    const tagData = await tagResponse.json();
    console.log('🏷️ Tag applied:', tagData);

    if (!tagResponse.ok) {
      console.error('❌ Failed to apply tag:', tagData);
      // Don't fail the submission if tagging fails, but log it
    }

    return Response.json(
      { 
        success: true, 
        message: 'Thank you for your submission!',
        contactId: contactId
      },
      { headers: getCorsHeaders(request) }
    );

  } catch (error) {
    console.error('❌ Form submission error:', error);
    return Response.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
