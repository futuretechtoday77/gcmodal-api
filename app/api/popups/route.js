/**
 * Get Popup Configurations
 * Loads from Control Board (for dynamic updates) + static config (fallback)
 */

import { getSecurityHeaders, mergeHeaders } from '@/lib/security-headers';

export async function GET() {
  // Static popup configurations (fallback)
  const staticPopups = {
    'nitrilosides-optin': {
      name: 'Nitrilosides Free Access',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'centered',
        headline: 'Get Instant Access',
        subheadline: 'Enter your details below',
        bodyCopy: '',
        buttonText: 'Send My Login Info Now',
        image: {
          url: '',
          position: 'none'
        }
      },
      fields: ['firstName', 'email']
    },
    
    'frequency-generator-report': {
      name: 'Frequency Generator Report',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'side-by-side',
        headline: 'Discover The Truth About "Rife Machines"',
        subheadline: 'Free Special Report Reveals Why These Devices May Do More Harm Than Good',
        bodyCopy: 'Enter your email below and I\'ll send you instant access to my investigative report exposing the frequency generator industry.',
        buttonText: 'Send Report To My Email!',
        image: {
          url: 'https://gcmodal.vercel.app/frequency-generator-book.jpg',
          position: 'left-side'
        }
      },
      fields: ['firstName', 'email'] // Changed to include firstName for testing
    }
  };

  // Try to load dynamic popups from Control Board settings
  let dynamicPopups = {};
  
  try {
    const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN;
    const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40';
    
    if (CONTROLBOARD_TOKEN) {
      const response = await fetch('https://control.clawlauncher.io/api/settings', {
        headers: {
          'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
          'X-Workspace-Id': WORKSPACE_ID
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || {};
        
        // Extract popup configs from settings (keys starting with popup_)
        Object.entries(settings).forEach(([key, value]) => {
          if (key.startsWith('popup_')) {
            try {
              const popupData = typeof value === 'string' ? JSON.parse(value) : value;
              if (popupData?.popupId && popupData?.config && popupData?.isActive !== false) {
                dynamicPopups[popupData.popupId] = popupData.config;
              }
            } catch (e) {
              console.warn('⚠️ Could not parse popup setting:', key);
            }
          }
        });
        
        console.log('✅ Loaded', Object.keys(dynamicPopups).length, 'dynamic popups from Control Board');
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not load dynamic popups:', error.message);
  }

  // Merge dynamic popups with static (dynamic takes precedence)
  const allPopups = { ...staticPopups, ...dynamicPopups };
  
  // SECURITY FIX: Filter sensitive data from public response
  // Remove tagId and other backend-only fields from public API
  const publicPopups = {};
  Object.entries(allPopups).forEach(([id, popup]) => {
    publicPopups[id] = {
      name: popup.name,
      design: popup.design,
      fields: popup.fields,
      // tagId: popup.tagId,  // ❌ DON'T EXPOSE - validated server-side only
    };
  });

  return Response.json(
    {
      success: true,
      popups: publicPopups
    },
    {
      headers: mergeHeaders(
        {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        getSecurityHeaders()
      )
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
