/**
 * Get Popup Configurations
 * Loads from Control Board (for dynamic updates) + static config (fallback)
 * v2.8.8 - Cleaned up to 10 working popups
 */

import { getSecurityHeaders, mergeHeaders } from '@/lib/security-headers';

export async function GET(req) {
  // Check for single popup request via query param
  const { searchParams } = new URL(req.url);
  const popupId = searchParams.get('id');
  
  // Static popup configurations - 10 CONFIRMED WORKING POPUPS
  const staticPopups = {
    // ==================== NITRILOSIDE/FORBIDDENFOOD (tag: 69a02963430175cb1007f09d) ====================
    'forbiddenfood-nitriloside': {
      name: 'ForbiddenFood Course Nitriloside',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'centered',
        headline: 'Get Instant Access',
        subheadline: 'Enter your details below',
        bodyCopy: '',
        buttonText: 'Send My Login Info Now',
        image: { url: '', position: 'none' }
      },
      fields: ['firstName', 'email']
    },
    
    'nitriloside-course': {
      name: 'Nitriloside Course',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'centered',
        headline: 'Get Instant Access',
        subheadline: 'Enter your details below',
        bodyCopy: '',
        buttonText: 'Send My Login Info Now',
        image: { url: '', position: 'none' }
      },
      fields: ['firstName', 'email']
    },
    
    'Nitriloside ForbiddenFood Course': {
      name: 'ForbiddenFood Course NitrilosideImage',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'centered',
        headline: 'Get Instant Access',
        subheadline: 'Enter your details below',
        bodyCopy: '',
        buttonText: 'Send My Login Info Now',
        image: { url: '', position: 'none' }
      },
      fields: ['firstName', 'email']
    },
    
    'ApricotSeed ForbiddenFood Course': {
      name: 'ApricotSeed ForbiddenFood Course',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'centered',
        headline: 'Get Instant Access',
        subheadline: 'Enter your details below',
        bodyCopy: '',
        buttonText: 'Send My Login Info Now',
        image: { url: '', position: 'none' }
      },
      fields: ['firstName', 'email']
    },

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
        image: { url: '', position: 'none' }
      },
      fields: ['firstName', 'email']
    },

    // ==================== RIFELEAD/FREQUENCY (tag: 68cb4cbb97f1fa5d35ebf6f3) ====================
    'frequency-generator-report': {
      name: 'Frequency Generator Report',
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
      design: {
        variant: 'blue',
        layout: 'side-by-side',
        headline: 'Cuts Thru The BS And Show & Get The Truth About So Called "Rife Machines"',
        subheadline: 'Where should I send your free Rife Reports?',
        bodyCopy: 'Enter your email below and I\'ll send you this and my most popular Rife Reports published over the last 20 years..',
        buttonText: 'Send Reports To My Email!',
        image: { 
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/CAFG-book-cover-Lh2xaPIH7sJdphdusZIbLNi3lGBiEM.png', 
          position: 'left-side', 
          scale: 145 
        }
      },
      fields: ['email']
    },

    'rifelead-scientist-bw': {
      name: 'RifeLead - Vintage Scientist Lab',
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Forgotten Frequency Discoveries of the 1930s',
        subheadline: 'Before modern medicine, pioneering researchers were exploring something remarkable',
        bodyCopy: 'Historical photographs from the original frequency research laboratories. Discover what they knew that we forgot.',
        buttonText: 'Send Me The Historical Report',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-scientist-bw-NyRzMRFVkQCIXmC4fQHvRLo5jvgfCk.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'rifelead-scientist-sepia': {
      name: 'RifeLead - Sepia Scientist Portrait',
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'Meet The Man Who Saw What Others Couldn\'t',
        subheadline: 'A lifetime of dedication to understanding the frequency spectrum of life',
        bodyCopy: 'His workshop, his instruments, his discoveries — all revealed in this exclusive historical documentation.',
        buttonText: 'Get The Complete Story',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-scientist-sepia-xp2jRuxSBxMfExXAlnjUXFhOZngjYK.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'rifelead-microscope': {
      name: 'RifeLead - Glowing Microscope',
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Microscope That Changed Everything',
        subheadline: 'A breakthrough device that revealed secrets invisible to conventional science',
        bodyCopy: 'Discover the story of the universal microscope and why its technology was never replicated.',
        buttonText: 'Send Me The Microscope Report',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-microscope-8VLoNzr2SKTfDf1yxSvgHS77dxAPzX.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'rifelead-waveforms': {
      name: 'RifeLead - Frequency Waveforms',
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Mathematics of Cellular Resonance',
        subheadline: 'Specific frequencies, precise calculations, and the science that was never taught',
        bodyCopy: 'Original equations, waveform diagrams, and the frequency protocols that emerged from decades of research.',
        buttonText: 'Access The Frequency Data',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-waveforms-zERaEow0nQ39298PxHPY8RoeDrKh1X.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
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
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not load dynamic popups:', error.message);
  }

  // Merge dynamic popups with static (dynamic takes precedence)
  const allPopups = { ...staticPopups, ...dynamicPopups };
  
  // Handle split test lookup
  if (popupId && popupId.startsWith('split-')) {
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
          const key = `split_test_${popupId}`;
          
          if (settings[key]) {
            const test = typeof settings[key] === 'string' ? JSON.parse(settings[key]) : settings[key];
            
            if (test.status === 'completed' && test.winnerPopupId) {
              const popupConfig = allPopups[test.winnerPopupId];
              if (popupConfig) {
                const { tagId, ...publicPopup } = popupConfig;
                return Response.json({
                  success: true,
                  popup: publicPopup,
                  _splitTest: { testId: test.testId, variant: 'winner', isCompleted: true }
                }, { headers: mergeHeaders({
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type'
                  }, getSecurityHeaders()) });
              }
            }
            
            // Random assignment for running tests
            const variant = Math.random() < 0.5 ? 'A' : 'B';
            const variantData = variant === 'A' ? test.variantA : test.variantB;
            const popupConfig = allPopups[variantData.popupId];
            
            if (popupConfig) {
              const { tagId, ...publicPopup } = popupConfig;
              return Response.json({
                success: true,
                popup: publicPopup,
                _splitTest: { testId: test.testId, variant, isCompleted: false }
              }, { headers: mergeHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
                }, getSecurityHeaders()) });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching split test:', error);
      return Response.json(
        { success: false, error: 'Error fetching split test: ' + error.message },
        { status: 500, headers: mergeHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }, getSecurityHeaders()) }
      );
    }
    
    return Response.json(
      { success: false, error: 'Split test not found' },
      { status: 404, headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) }
    );
  }
  
  // Regular popup lookup
  const popup = allPopups[popupId];
  if (popup) {
    // Include tagId for form submission (it's needed by the submit API)
    return Response.json(
      { success: true, popup: popup },
      { headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) }
    );
  }

  return Response.json(
    { success: false, error: 'Popup not found' },
    { status: 404, headers: mergeHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }, getSecurityHeaders()) }
  );
  
  // SECURITY FIX: Filter sensitive data from public response
  // Remove tagId and other backend-only fields from public API
  const publicPopups = {};
  Object.entries(allPopups).forEach(([id, popup]) => {
    publicPopups[id] = {
      name: popup.name,
      template: popup.template,
      design: popup.design,
      fields: popup.fields,
      buttonColor: popup.buttonColor,
      popupHeight: popup.popupHeight,
      trustText: popup.trustText,
      showTrustText: popup.showTrustText,
      showOverlay: popup.showOverlay,
      overlayColor: popup.overlayColor,
      overlayOpacity: popup.overlayOpacity,
      useCustomTextColors: popup.useCustomTextColors,
      headlineColor: popup.headlineColor,
      subheadlineColor: popup.subheadlineColor,
      avatarUrl: popup.avatarUrl,
      avatarPosition: popup.avatarPosition,
      chatMessage: popup.chatMessage
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
