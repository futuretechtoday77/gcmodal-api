/**
 * Popup Event Tracking
 * Records impressions and conversions for analytics
 */

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const { event, popupId, timestamp, url, referrer } = await request.json();
    
    console.log('📊 Tracking event:', { event, popupId, timestamp });

    // Store in Control Board (using clips endpoint for now)
    const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN;
    const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40';

    if (!CONTROLBOARD_TOKEN) {
      console.warn('⚠️ No Control Board token - tracking not saved');
      return Response.json({ success: true }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Store event in Control Board
    await fetch('https://control.clawlauncher.io/api/ai/clips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      },
      body: JSON.stringify({
        type: 'popup-event',
        name: `${event}:${popupId}:${timestamp}`,
        data: {
          event,
          popupId,
          timestamp,
          url,
          referrer,
          date: new Date(timestamp).toISOString().split('T')[0]
        }
      })
    });

    return Response.json(
      { success: true },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('❌ Tracking error:', error);
    return Response.json(
      { success: false },
      { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}
