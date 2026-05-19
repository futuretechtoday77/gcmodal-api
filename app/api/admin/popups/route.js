import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function GET(req) {
  // Verify JWT authentication
  const authResult = await verifyAuth(req)
  if (!authResult.authenticated) {
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
