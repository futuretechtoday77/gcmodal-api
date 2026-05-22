/**
 * Save Popup Configuration
 * Stores in Control Board (persistent storage) since Vercel filesystem is read-only
 */

export async function POST(request) {
  try {
    const { popup, isNew } = await request.json();
    
    console.log('💾 Saving popup:', popup.id, 'isNew:', isNew);
    
    const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN;
    const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40';
    
    if (!CONTROLBOARD_TOKEN) {
      throw new Error('Control Board token not configured');
    }

    // Build popup config with ALL v2.8.x fields
    const popupConfig = {
      name: popup.name,
      tagId: popup.tagId,
      template: popup.template || 'clean-gradient',
      design: {
        variant: popup.variant,
        layout: popup.layout,
        headline: popup.headline,
        subheadline: popup.subheadline,
        bodyCopy: popup.bodyCopy || '',
        buttonText: popup.buttonText,
        image: {
          url: popup.imageUrl || '',
          position: popup.imagePosition,
          scale: popup.imageScale || 100
        }
      },
      fields: [
        ...(popup.includeFirstName ? ['firstName'] : []),
        'email',
        ...(popup.includePhone ? ['phone'] : [])
      ],
      // New v2.8.x fields
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
      // Personal Consultation fields
      avatarUrl: popup.avatarUrl,
      avatarPosition: popup.avatarPosition,
      chatMessage: popup.chatMessage
    };

    // Save to Control Board settings as persistent storage
    const saveResponse = await fetch('https://control.clawlauncher.io/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      },
      body: JSON.stringify({
        key: `popup_${popup.id}`,
        value: JSON.stringify({
          popupId: popup.id,
          config: popupConfig,
          isActive: true,
          updatedAt: new Date().toISOString()
        })
      })
    });

    if (!saveResponse.ok) {
      const errorData = await saveResponse.text();
      throw new Error(`Control Board save failed: ${errorData}`);
    }

    console.log('✅ Saved to Control Board');

    // Note: Auto-deployment disabled for now
    // Vercel requires git integration for deploy hooks
    // Popups are saved to Control Board and will be live on next manual deploy
    let deploymentTriggered = false;

    return Response.json({
      success: true,
      message: '✅ Popup saved to Control Board! Tell Nikola to deploy it.',
      popup: popupConfig,
      popupId: popup.id,
      deployed: false,
      implementationCode: `<!-- GC Modal Popup: ${popup.name} -->\n<script src="https://gcmodal.vercel.app/gc-modal.js"></script>\n<script>\n  GCModal.init({\n    popupId: '${popup.id}',\n    apiUrl: 'https://gcmodal-api.vercel.app'\n  });\n</script>`
    });

  } catch (error) {
    console.error('❌ Save error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
