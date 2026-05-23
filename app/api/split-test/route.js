/**
 * Split Test API
 * Handles A/B testing for popups
 * v2.8.8 - Rebuilt from ground up
 */

import { getSecurityHeaders, mergeHeaders } from '@/lib/security-headers';

// Static popup configurations (copied from /api/popups for direct access)
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
      image: { url: '', position: 'none' }
    },
    fields: ['firstName', 'email']
  },
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
      image: { url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/CAFG-book-cover-Lh2xaPIH7sJdphdusZIbLNi3lGBiEM.png', position: 'left-side', scale: 145 }
    },
    fields: ['email']
  }
  // Add more popups as needed
};

// In-memory store for split test assignments (session-based)
const splitTestAssignments = new Map();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const testId = searchParams.get('id');
  const email = searchParams.get('email'); // For deduplication
  
  if (!testId) {
    return Response.json(
      { success: false, error: 'Test ID required' },
      { status: 400, headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) }
    );
  }
  
  // Check if it's a valid split test ID
  if (!testId.startsWith('split-')) {
    return Response.json(
      { success: false, error: 'Invalid test ID format' },
      { status: 400, headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) }
    );
  }
  
  try {
    // Fetch split test from Control Board
    const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN;
    const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40';
    
    if (!CONTROLBOARD_TOKEN) {
      return Response.json(
        { success: false, error: 'Split testing not configured' },
        { status: 500, headers: mergeHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }, getSecurityHeaders()) }
      );
    }
    
    const response = await fetch('https://control.clawlauncher.io/api/settings', {
      headers: {
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Control Board');
    }
    
    const data = await response.json();
    const settings = data.settings || {};
    const key = `split_test_${testId}`;
    
    if (!settings[key]) {
      return Response.json(
        { success: false, error: 'Split test not found' },
        { status: 404, headers: mergeHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }, getSecurityHeaders()) }
      );
    }
    
    const test = typeof settings[key] === 'string' ? JSON.parse(settings[key]) : settings[key];
    
    // If test is completed, return winner
    if (test.status === 'completed' && test.winnerPopupId) {
      return Response.json({
        success: true,
        variant: 'winner',
        popupId: test.winnerPopupId,
        isCompleted: true,
        testId: test.testId
      }, { headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) });
    }
    
    // Random 50/50 assignment on EVERY request
    // This allows visitors to see different variants on subsequent visits
    // Winner is determined by conversion tracking, not by assignment persistence
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    const variantData = variant === 'A' ? test.variantA : test.variantB;
    
    // Get the full popup configuration (including tagId) from static data
    const popupConfig = staticPopups[variantData.popupId];
    
    if (!popupConfig) {
      return Response.json(
        { success: false, error: 'Popup configuration not found for: ' + variantData.popupId },
        { status: 500, headers: mergeHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }, getSecurityHeaders()) }
      );
    }
    
    return Response.json({
      success: true,
      variant,
      popupId: variantData.popupId,
      popup: popupConfig,
      isCompleted: false,
      testId: test.testId
    }, { headers: mergeHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }, getSecurityHeaders()) });
    
  } catch (error) {
    console.error('Split test error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500, headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) }
    );
  }
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
