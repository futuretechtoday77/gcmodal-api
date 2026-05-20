import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function GET(req) {
  // Verify JWT authentication
  try {
    await verifyAuth(req)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Static popup configurations (same as public API but WITH tagId)
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
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['firstName', 'email']
    },

    'frequency-generator-report-2': {
      name: 'Frequency Generator Report 2',
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
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['firstName', 'email']
    },

    'frequency-generator-report-copy3': {
      name: 'Frequency Generator Report 3',
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
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['firstName', 'email']
    },

    'ApricotSeed ForbiddenFood Course': {
      name: 'ForbiddenFood Course',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'purple',
        layout: 'side-by-side',
        headline: 'Could This Be The Missing Link in Human Nutrition?',
        subheadline: 'Is a hidden seed the missing vitamin secret that pharma has been hiding from you for decades?  ',
        bodyCopy: 'Learn more in my free reports & online course',
        buttonText: 'Send Report & Login To My Email',
        image: {
          url: 'https://images.convertbox.com/users/4727/1186d10060e54928f45dcf173d663b41.jpg',
          position: 'left-side',
          scale: 200
        }
      },
      fields: ['firstName', 'email']
    },

    'Nitriloside ForbiddenFood Course': {
      name: 'ForbiddenFood Course NitrilosideImage',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'Could This Be The Missing Link in Human Nutrition?',
        subheadline: 'Is a hidden seed the missing vitamin secret that pharma has been hiding from you for decades?  ',
        bodyCopy: 'Learn more in my free reports & online course',
        buttonText: 'Send Report & Login To My Email',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/Nitriloside-Research-Reports-lp-1-rGkLAOlTdGSpcOXEgdA0jf3SBD5pQZ.png',
          position: 'left-side',
          scale: 200
        }
      },
      fields: ['firstName', 'email']
    },

    'Test Apricot': {
      name: 'Test Apricot',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'Eat Apricot Seeds',
        subheadline: 'Free Report',
        bodyCopy: '',
        buttonText: 'Send it Now',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/apricot-pit-Y09baObgVQAoPdQLAeiwYpeuqWZpde.jpg',
          position: 'left-side',
          scale: 200
        }
      },
      fields: ['firstName', 'email']
    },

    // ==================== FORBIDDENFOOD CAMPAIGN ====================
    'forbiddenfood-apricots': {
      name: 'ForbiddenFood - Fresh Apricots',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Seed They Don\'t Want You To Know About',
        subheadline: 'Discover why this ancient food was quietly removed from modern nutrition advice',
        bodyCopy: 'Inside this free report: The shocking connection between apricot seeds and a vitamin that was once considered essential to human health.',
        buttonText: 'Send Me The Free Report',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-apricots.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'forbiddenfood-research-v1': {
      name: 'ForbiddenFood - Research Reports (Restricted)',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'Declassified: The Cancer Studies They Buried',
        subheadline: '1940-1962 research on nitrilosides was marked RESTRICTED and suppressed for decades',
        bodyCopy: 'Now declassified: Read the original research reports that challenged everything we were told about nutrition and health.',
        buttonText: 'Access The Declassified Reports',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-research-v1.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'forbiddenfood-research-v2': {
      name: 'ForbiddenFood - Research Reports (Declassified)',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Missing Vitamin: A 22-Year Investigation',
        subheadline: 'National Research Council documents reveal decades of suppressed biochemical research',
        bodyCopy: 'Enter your email to receive the complete nitrilosides research archive — studies that were hidden from public view for over 50 years.',
        buttonText: 'Send Me The Research Archive',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-research-v2.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'forbiddenfood-research-v3': {
      name: 'ForbiddenFood - AMRI Research Cover',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'What The American Medical Research Institute Discovered',
        subheadline: 'Professional archival documents from 1940-1962 reveal startling findings about natural compounds',
        bodyCopy: 'These institutional research reports were never meant for public eyes. Now you can read what they found.',
        buttonText: 'Get The Institute Reports',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-research-v3.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'forbiddenfood-research-v4': {
      name: 'ForbiddenFood - Simplified Research',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Declassified Cancer Studies of 1940-1962',
        subheadline: 'Tea-stained primary source documents reveal research that was classified and forgotten',
        bodyCopy: 'Microscope icons, confidential stamps, and decades of suppressed science — all in one free report.',
        buttonText: 'Send Me The Declassified File',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-research-v4.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'forbiddenfood-research-v5': {
      name: 'ForbiddenFood - Top Secret File',
      tagId: '69a02963430175cb1007f09d',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'TOP SECRET: The Nitrilosides File',
        subheadline: 'National Cancer Research Institute archive — declassified after 25 years',
        bodyCopy: 'The most dramatic of the suppressed documents. Eagle seals, top secret stamps, and the truth that was buried in 1962.',
        buttonText: 'Access The Top Secret File',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-forbiddenfood-research-v5.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
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
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-scientist-bw.jpg',
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
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-scientist-sepia.jpg',
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
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-microscope.jpg',
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
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-rifelead-waveforms.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    // ==================== REDLIGHTRESEARCH CAMPAIGN ====================
    'redlight-athlete': {
      name: 'RedLightResearch - Athletic Recovery',
      tagId: '6942461446aba476ddd3ae8c',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'The Recovery Secret Elite Athletes Use',
        subheadline: 'Red light therapy: Backed by science, used by champions, available to you',
        bodyCopy: 'Discover how specific wavelengths of light can support muscle recovery, skin health, and cellular energy production.',
        buttonText: 'Send Me The Red Light Guide',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-redlight-athlete.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    },

    'redlight-spa': {
      name: 'RedLightResearch - Spa Wellness',
      tagId: '6942461446aba476ddd3ae8c',
      design: {
        variant: 'green',
        layout: 'side-by-side',
        headline: 'Bring The Spa Experience Home',
        subheadline: 'Red light therapy for relaxation, rejuvenation, and radiant skin',
        bodyCopy: 'Learn how to create your own wellness sanctuary with the same technology used in luxury spas worldwide.',
        buttonText: 'Get The Home Spa Guide',
        image: {
          url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/popup-redlight-spa.jpg',
          position: 'left-side',
          scale: 100
        }
      },
      fields: ['email']
    }
  };

  // Try to load dynamic popups from Control Board (same as public API)
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
        
        Object.entries(settings).forEach(([key, value]) => {
          if (key.startsWith('popup_')) {
            try {
              const popupData = typeof value === 'string' ? JSON.parse(value) : value;
              if (popupData?.popupId && popupData?.config && popupData?.isActive !== false) {
                dynamicPopups[popupData.popupId] = popupData.config;
              }
            } catch (e) {
              console.warn('Could not parse popup setting:', key);
            }
          }
        });
      }
    }
  } catch (error) {
    console.warn('Could not load dynamic popups:', error.message);
  }

  // Merge dynamic popups with static (dynamic takes precedence)
  const allPopups = { ...staticPopups, ...dynamicPopups };

  // Return FULL config including tagId for admin use
  return NextResponse.json({
    success: true,
    popups: allPopups
  })
}
