'use client'

import { useState, useEffect } from 'react'

// Code Implementation Modal Component
function CodeImplementationModal({ popup, onClose }) {
  const [buttonStyle, setButtonStyle] = useState({
    text: 'Get Free Access',
    bgColor: '#6B46C1',
    textColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '6px',
    padding: '12px 24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontWeight: 'bold',
    align: popup.buttonAlign || 'center'
  });

  const delaySeconds = popup.triggerDelay || 180;
  const delayMinutes = Math.floor(delaySeconds / 60);
  const delayLabel = delayMinutes >= 1 ? `${delayMinutes} minute${delayMinutes > 1 ? 's' : ''}` : `${delaySeconds} seconds`;

  // Define alignment styles first (needed for button code)
  const buttonAlign = popup.buttonAlign || 'center';
  const alignStyles = {
    left: 'text-align: left;',
    center: 'text-align: center;',
    right: 'text-align: right;'
  };

  // Universal script (one-time installation)
  const universalScriptCode = `<!-- GC Modal: Universal script (add ONCE to theme.liquid before </body>) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api.vercel.app'
  });
</script>`;

  const universalButtonCode = `<!-- Button HTML - works anywhere after universal script is installed -->
<div style="${alignStyles[buttonAlign]}">
  <button 
    data-popup-id="${popup.popupId}"
    style="
      background: ${buttonStyle.bgColor};
      color: ${buttonStyle.textColor};
      font-size: ${buttonStyle.fontSize};
      font-family: ${buttonStyle.fontFamily};
      font-weight: ${buttonStyle.fontWeight};
      padding: ${buttonStyle.padding};
      border: none;
      border-radius: ${buttonStyle.borderRadius};
      box-shadow: ${buttonStyle.boxShadow};
      cursor: pointer;
    "
  >
    ${buttonStyle.text}
  </button>
</div>`;

  const delayCode = `<!-- GC Modal: Delay on page load (add before </head>) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.init({
    popupId: '${popup.popupId}',
    apiUrl: 'https://gcmodal-api.vercel.app',
    trigger: 'delay',
    triggerDelay: ${delaySeconds * 1000}  // Show after ${delayLabel}
  });
</script>`;

  const exitCode = `<!-- GC Modal: Exit intent (add before </head>) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.init({
    popupId: '${popup.popupId}',
    apiUrl: 'https://gcmodal-api.vercel.app',
    trigger: 'exit'  // Show when user moves mouse to leave page
  });
</script>`;

  // Split button implementation into two parts
  const buttonScriptCode = `<!-- GC Modal: Page load script (add before </body>) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.init({
    popupId: '${popup.popupId}',
    apiUrl: 'https://gcmodal-api.vercel.app',
    trigger: 'button',
    buttonId: 'gc-popup-trigger'
  });
</script>`;

  const buttonHtmlCode = `<!-- Button HTML (paste in HTML block where you want button) -->
<div style="${alignStyles[buttonAlign]}">
  <button 
    id="gc-popup-trigger" 
    style="
      background: ${buttonStyle.bgColor};
      color: ${buttonStyle.textColor};
      font-size: ${buttonStyle.fontSize};
      font-family: ${buttonStyle.fontFamily};
      font-weight: ${buttonStyle.fontWeight};
      padding: ${buttonStyle.padding};
      border: none;
      border-radius: ${buttonStyle.borderRadius};
      box-shadow: ${buttonStyle.boxShadow};
      cursor: pointer;
    "
  >
    ${buttonStyle.text}
  </button>
</div>`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0'
      }}>
        {/* Left: Implementation Codes */}
        <div style={{ padding: '30px', borderRight: '1px solid #e5e7eb' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Implementation Code</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Popup: <strong>{popup.name}</strong>
          </p>

          {/* RECOMMENDED: Universal Script */}
          <div style={{ marginBottom: '25px', padding: '15px', background: '#e7f3ff', border: '2px solid #0066cc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0066cc' }}>
              <span style={{ background: '#0066cc', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>⭐ RECOMMENDED</span>
              Universal Script (One-Time Setup)
            </h3>
            <p style={{ fontSize: '13px', color: '#333', marginBottom: '10px', fontWeight: '600' }}>
              Install ONCE in theme.liquid → Use for ALL popups!
            </p>
            
            {/* Universal script */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Step 1: Add this to theme.liquid (before &lt;/body&gt;) - ONE TIME ONLY</p>
              <pre style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                border: '1px solid #0066cc',
                lineHeight: '1.4'
              }}>{universalScriptCode}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(universalScriptCode);
                  alert('Universal script copied!');
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📋 Copy Universal Script
              </button>
            </div>

            {/* Universal button HTML */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Step 2: Button HTML (paste anywhere - works for ALL popups)</p>
              <pre style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                border: '1px solid #0066cc',
                lineHeight: '1.4'
              }}>{universalButtonCode}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(universalButtonCode);
                  alert('Button HTML copied!');
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📋 Copy Button HTML
              </button>
            </div>
            
            <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
              💡 After installing the universal script once, just copy button HTML for new popups - no script changes needed!
            </p>
          </div>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', textAlign: 'center' }}>Or use popup-specific scripts:</p>
          
          {/* Option 1: Button-triggered */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#fff3cd', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Option 1</span>
              Button-triggered
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
              User clicks button to open popup (customize button on right →)
            </p>
            
            {/* Part 1: Page load script */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Step 1: Page load script (before &lt;/body&gt;)</p>
              <pre style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                border: '1px solid #ddd',
                lineHeight: '1.4'
              }}>{buttonScriptCode}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(buttonScriptCode);
                  alert('Page load script copied!');
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📋 Copy Script
              </button>
            </div>

            {/* Part 2: Button HTML */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Step 2: Button HTML (paste in HTML block)</p>
              <pre style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                border: '1px solid #ddd',
                lineHeight: '1.4'
              }}>{buttonHtmlCode}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(buttonHtmlCode);
                  alert('Button HTML copied!');
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📋 Copy Button HTML
              </button>
            </div>
          </div>

          {/* Option 2: Exit Intent */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#ffe7e7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Option 2</span>
              Exit Intent
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
              Shows when user moves mouse to leave page
            </p>
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '11px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              lineHeight: '1.4'
            }}>{exitCode}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(exitCode);
                alert('Exit intent code copied!');
              }}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              📋 Copy Exit Code
            </button>
          </div>

          {/* Option 3: Delay on Page Load */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#e7f3ff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Option 3</span>
              Delay on Page Load
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
              Shows after {delayLabel} on page
            </p>
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '11px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              lineHeight: '1.4'
            }}>{delayCode}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(delayCode);
                alert('Delay code copied!');
              }}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              📋 Copy Delay Code
            </button>
          </div>


        </div>

        {/* Right: Button Customizer */}
        <div style={{ padding: '30px', background: '#f9fafb' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Button Customizer</h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            Customize the trigger button style:
          </p>

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Button Text</label>
              <input
                type="text"
                value={buttonStyle.text}
                onChange={(e) => setButtonStyle({...buttonStyle, text: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Background</label>
                <input
                  type="color"
                  value={buttonStyle.bgColor}
                  onChange={(e) => setButtonStyle({...buttonStyle, bgColor: e.target.value})}
                  style={{ width: '100%', height: '36px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Text Color</label>
                <input
                  type="color"
                  value={buttonStyle.textColor}
                  onChange={(e) => setButtonStyle({...buttonStyle, textColor: e.target.value})}
                  style={{ width: '100%', height: '36px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Font Family</label>
              <select
                value={buttonStyle.fontFamily}
                onChange={(e) => setButtonStyle({...buttonStyle, fontFamily: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="system-ui, sans-serif">System (Default)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Font Size</label>
                <input
                  type="text"
                  value={buttonStyle.fontSize}
                  onChange={(e) => setButtonStyle({...buttonStyle, fontSize: e.target.value})}
                  placeholder="16px"
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Border Radius</label>
                <input
                  type="text"
                  value={buttonStyle.borderRadius}
                  onChange={(e) => setButtonStyle({...buttonStyle, borderRadius: e.target.value})}
                  placeholder="6px"
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Padding</label>
              <input
                type="text"
                value={buttonStyle.padding}
                onChange={(e) => setButtonStyle({...buttonStyle, padding: e.target.value})}
                placeholder="12px 24px"
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Box Shadow</label>
              <select
                value={buttonStyle.boxShadow}
                onChange={(e) => setButtonStyle({...buttonStyle, boxShadow: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="none">None</option>
                <option value="0 2px 4px rgba(0,0,0,0.1)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">X-Large</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Button Alignment</label>
              <select
                value={buttonStyle.align}
                onChange={(e) => setButtonStyle({...buttonStyle, align: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          {/* Button Preview */}
          <div style={{ marginTop: '25px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>Preview:</label>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: buttonStyle.align }}>
              <button
                style={{
                  background: buttonStyle.bgColor,
                  color: buttonStyle.textColor,
                  fontSize: buttonStyle.fontSize,
                  fontFamily: buttonStyle.fontFamily,
                  fontWeight: buttonStyle.fontWeight,
                  padding: buttonStyle.padding,
                  border: 'none',
                  borderRadius: buttonStyle.borderRadius,
                  boxShadow: buttonStyle.boxShadow,
                  cursor: 'pointer'
                }}
              >
                {buttonStyle.text}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textAlign: 'center' }}>Alignment: {buttonStyle.align}</p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  );
}

// Popup Preview Component
function PopupPreview({ config }) {
  const variantColors = {
    purple: { primary: '#6B46C1', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    blue: { primary: '#2563eb', bg: 'linear-gradient(135deg, #667eea 0%, #2563eb 100%)' },
    green: { primary: '#059669', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    red: { primary: '#dc2626', bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
  };

  const colors = variantColors[config.variant] || variantColors.purple;
  const isSideBySide = config.layout === 'side-by-side';
  const hasImage = config.imagePosition !== 'none' && config.imageUrl;
  const imageScale = (config.imageScale || 100) / 100; // Convert percentage to decimal

  return (
    <div style={{
      maxWidth: isSideBySide ? '600px' : '450px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Image rendering */}
      {hasImage && config.imagePosition === 'full-width' && (
        <div style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <img src={config.imageUrl} alt="" style={{ width: `${imageScale * 100}%`, height: 'auto', display: 'block' }} />
        </div>
      )}

      <div style={{
        display: isSideBySide ? 'flex' : 'block',
        position: 'relative'
      }}>
        {/* Left side image for side-by-side */}
        {hasImage && config.imagePosition === 'left-side' && isSideBySide && (
          <div style={{ 
            width: '200px', 
            height: imageScale > 100 ? '356px' : 'auto', // 9:16 aspect ratio when zoomed (200 * 16/9 = 356)
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: imageScale > 100 ? '#f0f0f0' : 'transparent'
          }}>
            <img src={config.imageUrl} alt="" style={{ 
              width: imageScale > 100 ? `${imageScale}%` : `${imageScale * 100}%`, 
              height: imageScale > 100 ? '100%' : 'auto',
              objectFit: imageScale > 100 ? 'cover' : 'contain'
            }} />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '30px', flex: 1, position: 'relative' }}>
          {/* Top-right corner image */}
          {hasImage && config.imagePosition === 'top-right' && !isSideBySide && (
            <img src={config.imageUrl} alt="" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: `${80 * imageScale}px`,
              height: `${80 * imageScale}px`,
              objectFit: 'cover',
              borderRadius: '8px'
            }} />
          )}

          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#1a202c'
          }}>
            {config.headline || 'Your Headline Here'}
          </h2>

          {config.subheadline && (
            <p style={{
              fontSize: '16px',
              color: '#4a5568',
              marginBottom: '15px'
            }}>
              {config.subheadline}
            </p>
          )}

          {config.bodyCopy && (
            <p style={{
              fontSize: '14px',
              color: '#718096',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {config.bodyCopy}
            </p>
          )}

          {/* Form */}
          <div style={{ marginTop: '20px' }}>
            {config.includeFirstName && (
              <input
                type="text"
                placeholder="First Name"
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              disabled
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              disabled
              style={{
                width: '100%',
                padding: '14px',
                background: colors.bg,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'not-allowed',
                opacity: 0.9
              }}
            >
              {config.buttonText || 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [popups, setPopups] = useState([])
  const [stats, setStats] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPopup, setEditingPopup] = useState(null)
  const [showCodeModal, setShowCodeModal] = useState(null)
  const [newPopup, setNewPopup] = useState({
    id: '',
    name: '',
    tagId: '',
    variant: 'purple',
    layout: 'centered',
    headline: '',
    subheadline: '',
    bodyCopy: '',
    buttonText: '',
    imageUrl: '',
    imagePosition: 'none',
    imageScale: 100,         // 1-100% (shrink only)
    includeFirstName: true,
    triggerType: 'button',  // button, delay, exit
    triggerDelay: 180,       // seconds (default 3 minutes)
    buttonAlign: 'center'    // left, center, right
  })

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('mv_popup_token')
    if (!token) {
      setLoading(false)
      return
    }

    if (token === 'authenticated') {
      setAuthenticated(true)
      loadData(token)
    } else {
      localStorage.removeItem('mv_popup_token')
      setLoading(false)
    }
  }

  async function login(password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('mv_popup_token', 'authenticated')
        setAuthenticated(true)
        loadData('authenticated')
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      alert('Login failed: ' + error.message)
    }
  }

  async function loadData(token) {
    try {
      setLoading(true)
      console.log('Loading data...')
      
      // Load popups from API
      console.log('Fetching popups...')
      const popupsRes = await fetch('/api/popups')
      const popupsData = await popupsRes.json()
      console.log('Popups loaded:', popupsData)
      
      setPopups(Object.entries(popupsData.popups || {}).map(([id, config]) => ({
        id,
        ...config
      })))

      // Load stats via server-side proxy to avoid CORS
      console.log('Fetching stats...')
      try {
        const statsRes = await fetch('/api/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })
        
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          console.log('Stats loaded:', statsData)
          calculateStats(statsData.events || [])
        } else {
          console.warn('Stats fetch failed')
        }
      } catch (error) {
        console.error('Stats load failed:', error)
      }

      setLoading(false)
    } catch (error) {
      console.error('Data load error:', error)
      setLoading(false)
      alert('Failed to load data: ' + error.message)
    }
  }

  function calculateStats(events) {
    const statsByPopup = {}
    
    events.forEach(event => {
      const { popupId, event: eventType } = event.data || {}
      if (!popupId) return

      if (!statsByPopup[popupId]) {
        statsByPopup[popupId] = { shown: 0, submitted: 0 }
      }

      if (eventType === 'popup_shown') {
        statsByPopup[popupId].shown++
      } else if (eventType === 'popup_submitted') {
        statsByPopup[popupId].submitted++
      }
    })

    setStats(statsByPopup)
  }

  async function handleCreatePopup() {
    // Validate required fields
    if (!newPopup.id || !newPopup.name || !newPopup.tagId || !newPopup.headline || !newPopup.buttonText) {
      alert('Please fill in all required fields (ID, Name, Tag ID, Headline, Button Text)');
      return;
    }

    try {
      const response = await fetch('/api/popups/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          popup: newPopup,
          isNew: !editingPopup
        })
      });

      const data = await response.json();

      if (data.success) {
        // Close form and refresh data
        handleCancelEdit();
        loadData('authenticated');
        
        // Show success + implementation code in modal
        setTimeout(() => {
          alert(data.message);
          setShowCodeModal({
            popupId: data.popupId,
            name: newPopup.name,
            code: data.implementationCode
          });
        }, 300);
      } else {
        alert('Save failed: ' + data.error);
      }
    } catch (error) {
      alert('Save failed: ' + error.message);
    }
  }

  function handleEditPopup(popup) {
    setEditingPopup(popup)
    setShowCreateForm(true)
    setNewPopup({
      id: popup.id,
      name: popup.name,
      tagId: popup.tagId,
      variant: popup.design?.variant || 'purple',
      layout: popup.design?.layout || 'centered',
      headline: popup.design?.headline || '',
      subheadline: popup.design?.subheadline || '',
      bodyCopy: popup.design?.bodyCopy || '',
      buttonText: popup.design?.buttonText || '',
      imageUrl: popup.design?.image?.url || '',
      imagePosition: popup.design?.image?.position || 'none',
      imageScale: popup.design?.image?.scale || 100,
      includeFirstName: popup.fields?.includes('firstName') || false
    })
  }

  function handleClonePopup(popup) {
    setEditingPopup(null) // Not editing, creating new
    setShowCreateForm(true)
    setNewPopup({
      id: popup.id + '-copy', // Suggest a new ID
      name: popup.name + ' (Copy)',
      tagId: popup.tagId,
      variant: popup.design?.variant || 'purple',
      layout: popup.design?.layout || 'centered',
      headline: popup.design?.headline || '',
      subheadline: popup.design?.subheadline || '',
      bodyCopy: popup.design?.bodyCopy || '',
      buttonText: popup.design?.buttonText || '',
      imageUrl: popup.design?.image?.url || '',
      imagePosition: popup.design?.image?.position || 'none',
      imageScale: popup.design?.image?.scale || 100,
      includeFirstName: popup.fields?.includes('firstName') || false
    })
  }

  function handleCancelEdit() {
    setShowCreateForm(false)
    setEditingPopup(null)
    setNewPopup({
      id: '',
      name: '',
      tagId: '',
      variant: 'purple',
      layout: 'centered',
      headline: '',
      subheadline: '',
      bodyCopy: '',
      buttonText: '',
      imageUrl: '',
      imagePosition: 'none',
      includeFirstName: true
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
        <h1>MV Popup Manager</h1>
        <p>Enter admin password:</p>
        <input
          id="admin-password-input"
          type="password"
          placeholder="Password"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              login(e.target.value)
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.getElementById('admin-password-input')
            login(input.value)
          }}
          style={{
            width: '100%',
            padding: '12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>Password: mvpopup2026</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Popup Dashboard</h1>
        <button
          onClick={() => showCreateForm ? handleCancelEdit() : setShowCreateForm(true)}
          style={{
            padding: '12px 24px',
            background: showCreateForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Popup'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2>{editingPopup ? `Edit: ${editingPopup.name}` : 'Create New Popup'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Left: Form */}
            <div style={{ display: 'grid', gap: '15px' }}>
            <input
              placeholder="Popup ID (lowercase-with-dashes)"
              value={newPopup.id}
              onChange={(e) => setNewPopup({...newPopup, id: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              placeholder="Display Name"
              value={newPopup.name}
              onChange={(e) => setNewPopup({...newPopup, name: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              placeholder="Global Control Tag ID"
              value={newPopup.tagId}
              onChange={(e) => setNewPopup({...newPopup, tagId: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <select
              value={newPopup.variant}
              onChange={(e) => setNewPopup({...newPopup, variant: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="purple">Purple (ForbiddenFood)</option>
              <option value="blue">Blue (HealthHarmonic)</option>
              <option value="green">Green (Natural)</option>
              <option value="red">Red (Urgent)</option>
            </select>
            <select
              value={newPopup.layout}
              onChange={(e) => setNewPopup({...newPopup, layout: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="centered">Centered Layout</option>
              <option value="side-by-side">Side-by-Side Layout</option>
              <option value="compact">Compact Layout (inline fields)</option>
              <option value="overlay">Overlay (form on image)</option>
            </select>
            <input
              placeholder="Headline"
              value={newPopup.headline}
              onChange={(e) => setNewPopup({...newPopup, headline: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              placeholder="Subheadline"
              value={newPopup.subheadline}
              onChange={(e) => setNewPopup({...newPopup, subheadline: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <textarea
              placeholder="Body Copy (optional)"
              value={newPopup.bodyCopy}
              onChange={(e) => setNewPopup({...newPopup, bodyCopy: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
            />
            <input
              placeholder="Button Text"
              value={newPopup.buttonText}
              onChange={(e) => setNewPopup({...newPopup, buttonText: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', background: '#f8f9fa' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Image (Optional)</label>
              <select
                value={newPopup.imagePosition}
                onChange={(e) => setNewPopup({...newPopup, imagePosition: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
              >
                <option value="none">No Image</option>
                <option value="full-width">Top, Full Width (Wide Image) - Centered Only</option>
                <option value="top-right">Top Right Corner (Square Image) - Centered Only</option>
                <option value="left-side">Left Side (Product/Book Cover) - Side-by-Side Only</option>
              </select>
              {newPopup.imagePosition !== 'none' && (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', marginBottom: '5px', display: 'block' }}>Upload Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        // Show uploading state
                        const uploadBtn = e.target.nextElementSibling;
                        if (uploadBtn) uploadBtn.textContent = '⏳ Uploading...';
                        
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const token = localStorage.getItem('mv_popup_token');
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`
                            },
                            body: formData
                          });
                          
                          const data = await response.json();
                          
                          if (data.success) {
                            setNewPopup({...newPopup, imageUrl: data.url});
                            alert('✅ Image uploaded successfully!');
                          } else {
                            alert('❌ Upload failed: ' + data.error);
                          }
                        } catch (error) {
                          alert('❌ Upload error: ' + error.message);
                        } finally {
                          if (uploadBtn) uploadBtn.textContent = '📁 Choose File';
                          e.target.value = ''; // Reset file input
                        }
                      }}
                      style={{ display: 'none' }}
                      id="image-upload-input"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload-input').click()}
                      style={{
                        padding: '8px 16px',
                        background: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      📁 Choose File
                    </button>
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Max 5MB (jpg, png, gif, webp)</p>
                  </div>
                  <div style={{ marginBottom: '10px', textAlign: 'center', color: '#999', fontSize: '12px' }}>— OR —</div>
                  <input
                    placeholder="Image URL (or upload above)"
                    value={newPopup.imageUrl}
                    onChange={(e) => setNewPopup({...newPopup, imageUrl: e.target.value})}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
                  />
                  <div>
                    <label style={{ fontSize: '13px', marginBottom: '5px', display: 'block' }}>Image Display Size: {newPopup.imageScale}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={newPopup.imageScale}
                      onChange={(e) => setNewPopup({...newPopup, imageScale: parseInt(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '2px' }}>
                      <span>0% (hidden)</span>
                      <span>100% (original)</span>
                      <span>200% (zoom 2x)</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                      {newPopup.imageScale < 100 ? '⬇️ Shrink image' : newPopup.imageScale === 100 ? '✓ Original size' : '🔍 Zoom in (crops to show detail)'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', background: '#f8f9fa' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={newPopup.includeFirstName}
                  onChange={(e) => setNewPopup({...newPopup, includeFirstName: e.target.checked})}
                />
                <span>Include First Name field</span>
              </label>
              <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
                Uncheck for email-only capture
              </small>
            </div>
            <button
              onClick={handleCreatePopup}
              style={{
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {editingPopup ? 'Save Changes' : 'Create Popup'}
            </button>
          </div>

          {/* Right: Live Preview */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Live Preview</h3>
            <div style={{
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              background: 'white',
              minHeight: '400px'
            }}>
              {/* Popup Preview */}
              <PopupPreview config={newPopup} />
            </div>
          </div>
        </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Popup Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Shown</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Submitted</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Conversion</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {popups.map(popup => {
            const popupStats = stats[popup.id] || { shown: 0, submitted: 0 }
            const conversion = popupStats.shown > 0 
              ? ((popupStats.submitted / popupStats.shown) * 100).toFixed(1) 
              : '0.0'
            
            return (
              <tr key={popup.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{popup.name}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '14px' }}>{popup.id}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{popupStats.shown.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{popupStats.submitted.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                  {conversion}%
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEditPopup(popup)}
                    style={{
                      padding: '6px 12px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      fontSize: '14px'
                    }}>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleClonePopup(popup)}
                    style={{
                      padding: '6px 12px',
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      fontSize: '14px'
                    }}>
                    Clone
                  </button>
                  <button 
                    onClick={() => setShowCodeModal({
                      popupId: popup.id,
                      name: popup.name,
                      code: `<!-- GC Modal Popup: ${popup.name} -->\n<script src="https://gcmodal.vercel.app/gc-modal.js"></script>\n<script>\n  GCModal.init({\n    popupId: '${popup.id}',\n    apiUrl: 'https://gcmodal-api.vercel.app'\n  });\n</script>`
                    })}
                    style={{
                      padding: '6px 12px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      fontSize: '14px'
                    }}>
                    View Code
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm(`Delete popup "${popup.name}"? This cannot be undone.`)) {
                        try {
                          const response = await fetch('/api/popups/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ popupId: popup.id })
                          });
                          const data = await response.json();
                          if (data.success) {
                            alert(data.message + '\n\nRefreshing page...');
                            window.location.reload();
                          } else {
                            alert('Delete failed: ' + data.error);
                          }
                        } catch (error) {
                          alert('Delete failed: ' + error.message);
                        }
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {popups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          No popups created yet. Click "Create Popup" to get started.
        </div>
      )}

      {/* Code Implementation Modal */}
      {showCodeModal && <CodeImplementationModal popup={showCodeModal} onClose={() => setShowCodeModal(null)} />}
    </div>
  )
}
