/**
 * Verify Control Board Token
 * Server-side authentication to avoid CORS issues
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

    // Verify token with Control Board
    const response = await fetch('https://control.clawlauncher.io/api/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return Response.json({
        success: true,
        user: userData
      });
    } else {
      return Response.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth verify error:', error);
    return Response.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
