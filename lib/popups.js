/**
 * Server-side popup configuration loader
 * Returns FULL config including sensitive fields (tagId)
 * DO NOT expose this data to public API
 */

export async function getPopupConfig(popupId) {
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
      tagId: '68cb4cbb97f1fa5d35ebf6f3',
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
      fields: ['firstName', 'email']
    },
    
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
        image: {
          url: '',
          position: 'none'
        }
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
        image: {
          url: '',
          position: 'none'
        }
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
        image: {
          url: '',
          position: 'none'
        }
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
        image: {
          url: '',
          position: 'none'
        }
      },
      fields: ['firstName', 'email']
    },

    // ==================== RIFELEAD CAMPAIGN ====================
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
  
  // Return the requested popup config (with tagId)
  return allPopups[popupId] || null;
}
