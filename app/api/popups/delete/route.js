/**
 * Delete Popup Configuration
 * Deletes from Control Board settings (dynamic storage)
 */

export async function POST(request) {
  try {
    const { popupId } = await request.json();
    
    console.log('🗑️ Deleting popup:', popupId);

    const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN;
    const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40';
    
    if (!CONTROLBOARD_TOKEN) {
      throw new Error('Control Board token not configured');
    }

    // Delete from Control Board settings (set to null to remove)
    const deleteResponse = await fetch('https://control.clawlauncher.io/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      },
      body: JSON.stringify({
        key: `popup_${popupId}`,
        value: null  // Setting to null removes the setting
      })
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.text();
      throw new Error(`Control Board delete failed: ${errorData}`);
    }

    console.log('✅ Popup deleted from Control Board');

    return Response.json({
      success: true,
      message: `Popup "${popupId}" deleted successfully! Changes are live immediately.`
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
