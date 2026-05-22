/**
 * Split Test API
 * Handles A/B testing for popups
 * v2.8.8 - Rebuilt from ground up
 */

import { getSecurityHeaders, mergeHeaders } from '@/lib/security-headers';

// In-memory store for split test assignments (session-based)
// In production, this should use Redis or similar
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
    
    // Check if user already has an assignment (by email or session)
    const assignmentKey = email ? `${testId}:${email}` : `${testId}:${req.headers.get('x-forwarded-for') || 'unknown'}`;
    
    if (splitTestAssignments.has(assignmentKey)) {
      const assignedVariant = splitTestAssignments.get(assignmentKey);
      const variantData = assignedVariant === 'A' ? test.variantA : test.variantB;
      
      return Response.json({
        success: true,
        variant: assignedVariant,
        popupId: variantData.popupId,
        isCompleted: false,
        testId: test.testId
      }, { headers: mergeHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, getSecurityHeaders()) });
    }
    
    // Random 50/50 assignment
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    const variantData = variant === 'A' ? test.variantA : test.variantB;
    
    // Store assignment
    splitTestAssignments.set(assignmentKey, variant);
    
    return Response.json({
      success: true,
      variant,
      popupId: variantData.popupId,
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
