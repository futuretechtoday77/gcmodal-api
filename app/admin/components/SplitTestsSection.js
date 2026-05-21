'use client'

import { useState, useEffect } from 'react'
import FolderManager from './FolderManager'

// Code Implementation Modal Component for Split Tests
function CodeImplementationModal({ test, onClose }) {
  const [buttonStyle, setButtonStyle] = useState({
    text: 'Get Free Report',
    bgColor: '#6B46C1',
    textColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '6px',
    padding: '12px 24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontWeight: 'bold',
    align: 'center'
  });

  const alignStyles = {
    left: 'text-align: left;',
    center: 'text-align: center;',
    right: 'text-align: right;'
  };

  // Generate base code
  const baseCode = `<!-- GC Modal: Universal Script (add ONCE to theme.liquid before </body>) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>`;

  // Generate trigger code based on type
  let triggerCode = '';
  if (test.triggerType === 'button') {
    triggerCode = `
<!-- Button HTML (paste in HTML block where you want the button) -->
<div style="${alignStyles[buttonStyle.align]}">
  <button 
    id="${test.testId}"
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
  } else if (test.triggerType === 'exit') {
    triggerCode = `
<!-- Exit Intent Trigger (no button needed) -->
<!-- Popup will show automatically when user moves mouse to leave page -->`;
  } else if (test.triggerType === 'delay') {
    const delaySeconds = test.triggerDelay || 180;
    const delayMinutes = Math.floor(delaySeconds / 60);
    triggerCode = `
<!-- Delay Trigger (${delaySeconds}s = ${delayMinutes}m ${delaySeconds % 60}s) -->
<!-- Popup will show automatically after ${delaySeconds} seconds on page -->`;
  }

  const fullCode = `${baseCode}\n${triggerCode}`;

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
        gridTemplateColumns: test.triggerType === 'button' ? '1fr 1fr' : '1fr',
        gap: '0'
      }}>
        {/* Left: Implementation Code */}
        <div style={{ padding: '30px', borderRight: test.triggerType === 'button' ? '1px solid #e5e7eb' : 'none' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Implementation Code</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Test: <strong>{test.name}</strong>
            <br />
            <small style={{ fontFamily: 'monospace' }}>{test.testId}</small>
          </p>

          {/* Universal script */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Step 1: Universal Script (add ONCE before &lt;/body&gt;)</p>
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '11px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              lineHeight: '1.4'
            }}>{baseCode}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(baseCode);
                alert('Universal script copied!');
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

          {/* Trigger code */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>
              Step 2: {test.triggerType === 'button' ? 'Button HTML' : 'Trigger Code'}
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
            }}>{triggerCode}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(triggerCode);
                alert('Code copied!');
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
              📋 Copy {test.triggerType === 'button' ? 'Button HTML' : 'Code'}
            </button>
          </div>

          {/* Copy all */}
          <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(fullCode);
                alert('Full implementation code copied!');
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              📋 Copy All Code
            </button>
          </div>
        </div>

        {/* Right: Button Customizer (only for button triggers) */}
        {test.triggerType === 'button' && (
          <div style={{ padding: '30px', background: '#f9fafb' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Button Customizer</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Customize the trigger button for this placement:
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Corner Radius</label>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Alignment</label>
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

            <p style={{ fontSize: '11px', color: '#999', marginTop: '15px', fontStyle: 'italic' }}>
              💡 Customize the button style for each placement on your site. The test tracks popup conversions, not button clicks.
            </p>
          </div>
        )}
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

export default function SplitTestsSection({ popups }) {
  const [splitTests, setSplitTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(null)
  const [showCodeModal, setShowCodeModal] = useState(null)
  const [showChallengerModal, setShowChallengerModal] = useState(null)
  const [newTest, setNewTest] = useState({
    name: '',
    variantA: '',
    variantB: '',
    triggerType: 'delay',
    triggerDelay: 180,
    buttonId: ''
  })



  useEffect(() => {
    loadSplitTests()
  }, [])

  async function loadSplitTests() {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/split-tests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSplitTests(Object.values(data.tests || {}))
      }
    } catch (error) {
      console.error('Error loading split tests:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTest() {
    if (!newTest.name || !newTest.variantA || !newTest.variantB) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('mv_popup_token')
      
      const response = await fetch('/api/admin/split-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTest)
      })

      const data = await response.json()
      if (data.success) {
        setShowCreateForm(false)
        setNewTest({
          name: '',
          variantA: '',
          variantB: '',
          triggerType: 'delay',
          triggerDelay: 180,
          buttonId: ''
        })
        loadSplitTests()
        setShowCodeModal({
          test: data.test,
          code: data.implementationCode
        })
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Failed to create test: ' + error.message)
    }
  }

  async function handleCompleteTest(testId, winnerPopupId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch(`/api/admin/split-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'complete', winnerPopupId })
      })

      const data = await response.json()
      if (data.success) {
        setShowCompleteModal(null)
        loadSplitTests()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Failed to complete test: ' + error.message)
    }
  }

  async function handleReopenTest(testId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch(`/api/admin/split-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'reopen' })
      })

      if (response.ok) {
        loadSplitTests()
      }
    } catch (error) {
      alert('Failed to reopen test: ' + error.message)
    }
  }

  async function handleArchiveTest(testId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch(`/api/admin/split-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'archive' })
      })

      if (response.ok) {
        loadSplitTests()
      }
    } catch (error) {
      alert('Failed to archive test: ' + error.message)
    }
  }

  async function handleUnarchiveTest(testId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch(`/api/admin/split-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'unarchive' })
      })

      if (response.ok) {
        loadSplitTests()
      }
    } catch (error) {
      alert('Failed to unarchive test: ' + error.message)
    }
  }

  async function handleCreateChallengerTest(parentTest, challengerPopupId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/split-tests/from-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          parentTestId: parentTest.testId,
          challengerPopupId,
          name: `Champion vs ${challengerPopupId}`
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowChallengerModal(null)
        loadSplitTests()
        setShowCodeModal({
          test: data.test,
          code: data.implementationCode
        })
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Failed to create challenger test: ' + error.message)
    }
  }

  function getStatusBadge(status) {
    const styles = {
      running: { background: '#28a745', color: 'white' },
      completed: { background: '#007bff', color: 'white' },
      archived: { background: '#6c757d', color: 'white' }
    }
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        ...styles[status]
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Split Tests (A/B Testing)</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            background: showCreateForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Split Test'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Create New Split Test</h3>
          <div style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
            <input
              placeholder="Test Name *"
              value={newTest.name}
              onChange={(e) => setNewTest({...newTest, name: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            <select
              value={newTest.variantA}
              onChange={(e) => setNewTest({...newTest, variantA: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select Variant A *</option>
              {popups.map(popup => (
                <option key={popup.id} value={popup.id}>{popup.name}</option>
              ))}
            </select>

            <select
              value={newTest.variantB}
              onChange={(e) => setNewTest({...newTest, variantB: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select Variant B *</option>
              {popups.map(popup => (
                <option key={popup.id} value={popup.id}>{popup.name}</option>
              ))}
            </select>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Trigger Type *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="triggerType"
                    value="button"
                    checked={newTest.triggerType === 'button'}
                    onChange={(e) => setNewTest({...newTest, triggerType: e.target.value})}
                  />
                  Button Click
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="triggerType"
                    value="exit"
                    checked={newTest.triggerType === 'exit'}
                    onChange={(e) => setNewTest({...newTest, triggerType: e.target.value})}
                  />
                  Exit Intent
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="triggerType"
                    value="delay"
                    checked={newTest.triggerType === 'delay'}
                    onChange={(e) => setNewTest({...newTest, triggerType: e.target.value})}
                  />
                  Time Delay
                </label>
              </div>
            </div>

            {newTest.triggerType === 'delay' && (
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Delay: {newTest.triggerDelay} seconds ({Math.floor(newTest.triggerDelay / 60)}m {newTest.triggerDelay % 60}s)
                </label>
                <input
                  type="range"
                  min="5"
                  max="600"
                  step="5"
                  value={newTest.triggerDelay}
                  onChange={(e) => setNewTest({...newTest, triggerDelay: parseInt(e.target.value)})}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <button
              onClick={handleCreateTest}
              style={{
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Create Split Test
            </button>
          </div>
        </div>
      )}

      {/* Split Test Folders */}
      <FolderManager 
        type="splittest" 
        items={splitTests}
      />

      <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>All Split Tests</h3>

      {loading ? (
        <p>Loading split tests...</p>
      ) : splitTests.length === 0 ? (
        <p style={{ color: '#6c757d' }}>No split tests created yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Test Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Variants</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Variant A</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Variant B</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {splitTests.map(test => (
              <tr key={test.testId} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{test.name}</strong>
                  <br />
                  <small style={{ color: '#6c757d', fontFamily: 'monospace' }}>
                    {test.testId}
                  </small>
                </td>
                <td style={{ padding: '12px' }}>
                  <small>A: {test.variantA.popupId}</small>
                  <br />
                  <small>B: {test.variantB.popupId}</small>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {getStatusBadge(test.status)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {test.status === 'completed' && test.winnerPopupId === test.variantA.popupId && '🏆 '}
                  {test.variantA.conversions}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {test.status === 'completed' && test.winnerPopupId === test.variantB.popupId && '🏆 '}
                  {test.variantB.conversions}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => setShowCodeModal({ test })}
                    style={{
                      padding: '6px 12px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      fontSize: '14px'
                    }}
                  >
                    Code
                  </button>
                  
                  {test.status === 'running' && (
                    <button
                      onClick={() => setShowCompleteModal(test)}
                      style={{
                        padding: '6px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px',
                        fontSize: '14px'
                      }}
                    >
                      Complete
                    </button>
                  )}
                  
                  {test.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleReopenTest(test.testId)}
                        style={{
                          padding: '6px 12px',
                          background: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '14px'
                        }}
                      >
                        Reopen
                      </button>
                      <button
                        onClick={() => setShowChallengerModal(test)}
                        style={{
                          padding: '6px 12px',
                          background: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '14px'
                        }}
                      >
                        New Variant
                      </button>
                    </>
                  )}
                  
                  {test.status !== 'archived' ? (
                    <button
                      onClick={() => handleArchiveTest(test.testId)}
                      style={{
                        padding: '6px 12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnarchiveTest(test.testId)}
                      style={{
                        padding: '6px 12px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Unarchive
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Complete Test Modal */}
      {showCompleteModal && (
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
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3>Complete Test: {showCompleteModal.name}</h3>
            
            <div style={{ margin: '20px 0' }}>
              <p><strong>Current Results:</strong></p>
              <p>Variant A: {showCompleteModal.variantA.conversions} conversions</p>
              <p>Variant B: {showCompleteModal.variantB.conversions} conversions</p>
            </div>

            <div style={{ margin: '20px 0' }}>
              <p><strong>Select Winner:</strong></p>
              <button
                onClick={() => handleCompleteTest(showCompleteModal.testId, showCompleteModal.variantA.popupId)}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Variant A Wins
              </button>
              <button
                onClick={() => handleCompleteTest(showCompleteModal.testId, showCompleteModal.variantB.popupId)}
                style={{
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Variant B Wins
              </button>
            </div>

            <button
              onClick={() => setShowCompleteModal(null)}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <CodeImplementationModal 
          test={showCodeModal.test} 
          onClose={() => setShowCodeModal(null)} 
        />
      )}

      {/* Challenger Modal */}
      {showChallengerModal && (
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
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3>Test New Variant Against Champion</h3>
            
            <div style={{ margin: '15px 0', padding: '15px', background: '#e7f3ff', borderRadius: '4px' }}>
              <strong>🏆 Champion (locked):</strong>
              <br />
              {showChallengerModal.winnerPopupId === showChallengerModal.variantA.popupId 
                ? showChallengerModal.variantA.popupId 
                : showChallengerModal.variantB.popupId}
              <br />
              <small>Winner of previous test with {Math.max(showChallengerModal.variantA.conversions, showChallengerModal.variantB.conversions)} conversions</small>
            </div>

            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Select Challenger:</strong>
              </label>
              <select
                id="challenger-select"
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="">Select popup to test...</option>
                {popups
                  .filter(p => p.id !== showChallengerModal.variantA.popupId && p.id !== showChallengerModal.variantB.popupId)
                  .map(popup => (
                    <option key={popup.id} value={popup.id}>{popup.name}</option>
                  ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const select = document.getElementById('challenger-select')
                  if (select.value) {
                    handleCreateChallengerTest(showChallengerModal, select.value)
                  } else {
                    alert('Please select a challenger popup')
                  }
                }}
                style={{
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Champion Test
              </button>
              <button
                onClick={() => setShowChallengerModal(null)}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
