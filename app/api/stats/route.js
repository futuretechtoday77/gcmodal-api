/**
 * Fetch Stats from Control Board
 * Server-side proxy to avoid CORS issues
 */

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    // Fetch stats from Control Board
    const response = await fetch('https://control.clawlauncher.io/api/ai/clips?type=popup-event', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Workspace-Id': '674e44e4a85f45d1b44c1a40'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return Response.json({
        success: true,
        events: data.data || []
      });
    } else {
      return Response.json(
        { success: false, error: 'Failed to fetch stats' },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Stats fetch error:', error);
    return Response.json(
      { success: false, error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}
