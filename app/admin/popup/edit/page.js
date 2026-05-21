'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Popup Preview Component
function PopupPreview({ config }) {
  const variantColors = {
    purple: { primary: '#7c3aed', secondary: '#a78bfa', bg: '#faf5ff' },
    blue: { primary: '#2563eb', secondary: '#60a5fa', bg: '#eff6ff' },
    green: { primary: '#059669', secondary: '#34d399', bg: '#ecfdf5' },
    red: { primary: '#dc2626', secondary: '#f87171', bg: '#fef2f2' },
    orange: { primary: '#ea580c', secondary: '#fb923c', bg: '#fff7ed' }
  }

  const colors = variantColors[config.variant] || variantColors.purple

  const layoutStyles = {
    centered: {
      container: { maxWidth: '500px', textAlign: 'center' },
      image: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' },
      content: {}
    },
    'side-by-side': {
      container: { maxWidth: '700px', display: 'flex', gap: '30px', alignItems: 'center' },
      image: { width: '280px', height: 'auto', objectFit: 'cover', borderRadius: '8px' },
      content: { flex: 1 }
    },
    compact: {
      container: { maxWidth: '550px' },
      image: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', float: 'left', marginRight: '20px', marginBottom: '10px' },
      content: {}
    },
    overlay: {
      container: { maxWidth: '500px', position: 'relative' },
      image: { width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' },
      content: { position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '8px' }
    }
  }

  const layout = layoutStyles[config.layout] || layoutStyles.centered

  const renderImage = () => {
    if (!config.imageUrl || config.imagePosition === 'none') return null
    return <img src={config.imageUrl} alt="" style={layout.image} />
  }

  const renderForm = () => (
    <div style={layout.content}>
      <h2 style={{ color: colors.primary, marginBottom: '10px', fontSize: '24px' }}>{config.headline || 'Headline'}</h2>
      <p style={{ color: '#4b5563', marginBottom: '15px', fontSize: '16px' }}>{config.subheadline || 'Subheadline'}</p>
      {config.bodyCopy && (
        <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>{config.bodyCopy}</p>
      )}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {config.includeFirstName && (
          <input
            type="text"
            placeholder="First Name"
            style={{ flex: 1, minWidth: '120px', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          style={{ flex: 2, minWidth: '150px', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
        />
      </div>
      <button style={{
        width: '100%',
        padding: '14px',
        background: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        {config.buttonText || 'Get Access'}
      </button>
    </div>
  )

  return (
    <div style={{
      background: colors.bg,
      padding: '30px',
      borderRadius: '12px',
      border: `2px solid ${colors.secondary}`,
      ...layout.container
    }}>
      {config.layout === 'side-by-side' ? (
        <>
          {renderImage()}
          {renderForm()}
        </>
      ) : config.layout === 'overlay' ? (
        <>
          {renderImage()}
          {renderForm()}
        </>
      ) : config.layout === 'compact' ? (
        <>
          {renderImage()}
          {renderForm()}
        </>
      ) : (
        <>
          {renderImage()}
          {renderForm()}
        </>
      )}
    </div>
  )
}

function PopupEditForm() {
  const router = useRouter()
  const [popupId, setPopupId] = useState(null)
  const [isNew, setIsNew] = useState(true)
  
  // Get URL params on client side only
  useEffect(() => {
    console.log('Edit page mounted, checking window...')
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')
      console.log('URL params parsed, id:', id)
      setPopupId(id)
      setIsNew(!id)
    } else {
      console.log('Window is undefined')
      // Fallback for SSR - assume new popup
      setPopupId('')
      setIsNew(true)
    }
    
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [popup, setPopup] = useState({
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
    imageScale: 100,
    includeFirstName: true,
    triggerType: 'button',
    triggerDelay: 180,
    buttonAlign: 'center'
  })

  // Load existing popup data if editing
  useEffect(() => {
    console.log('Load popup effect running, popupId:', popupId, 'isNew:', isNew)
    
    // Wait until we have determined if this is new or edit
    if (popupId === null) {
      console.log('popupId is null, waiting...')
      return
    }
    
    if (isNew) {
      console.log('New popup mode, setting loading false')
      setLoading(false)
      return
    }

    async function loadPopup() {
      try {
        console.log('Loading popup data for id:', popupId)
        
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          console.log('Window undefined, cannot load')
          setLoading(false)
          return
        }
        
        const token = localStorage.getItem('mv_popup_token')
        console.log('Token retrieved:', token ? 'yes' : 'no')
        
        if (!token) {
          setError('Not authenticated. Please login again.')
          setLoading(false)
          return
        }
        
        const response = await fetch('/api/admin/popups', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        console.log('API response:', data.success ? 'success' : 'failed')
        
        if (data.success) {
          const existingPopup = data.popups.find(p => p.id === popupId)
          console.log('Found popup:', existingPopup ? 'yes' : 'no')
          if (existingPopup) {
            setPopup({
              id: existingPopup.id || '',
              name: existingPopup.name || '',
              tagId: existingPopup.tagId || '',
              variant: existingPopup.design?.variant || 'purple',
              layout: existingPopup.design?.layout || 'centered',
              headline: existingPopup.design?.headline || '',
              subheadline: existingPopup.design?.subheadline || '',
              bodyCopy: existingPopup.design?.bodyCopy || '',
              buttonText: existingPopup.design?.buttonText || '',
              imageUrl: existingPopup.design?.image?.url || '',
              imagePosition: existingPopup.design?.image?.position || 'none',
              imageScale: existingPopup.design?.image?.scale || 100,
              includeFirstName: existingPopup.fields?.includes('firstName') || false,
              triggerType: existingPopup.triggerType || 'button',
              triggerDelay: existingPopup.triggerDelay || 180,
              buttonAlign: existingPopup.buttonAlign || 'center'
            })
          } else {
            setError('Popup not found')
          }
        } else {
          setError('Failed to load popup: ' + (data.error || 'Unknown error'))
        }
      } catch (err) {
        setError('Error loading popup: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPopup()
  }, [popupId, isNew])

  async function handleSave() {
    if (!popup.id || !popup.name || !popup.tagId || !popup.headline || !popup.buttonText) {
      alert('Please fill in all required fields: ID, Name, Tag ID, Headline, Button Text')
      return
    }

    setSaving(true)

    try {
      if (typeof window === 'undefined') {
        alert('Cannot save: not in browser environment')
        return
      }
      
      const token = localStorage.getItem('mv_popup_token')
      if (!token) {
        alert('Not authenticated. Please login again.')
        router.push('/admin')
        return
      }
      
      const response = await fetch('/api/popups/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          popup: {
            ...popup,
            image: {
              url: popup.imageUrl,
              position: popup.imagePosition,
              scale: popup.imageScale
            }
          },
          isNew
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message + '\n\nRedirecting to admin...')
        router.push('/admin')
      } else {
        alert('Save failed: ' + data.error)
      }
    } catch (err) {
      alert('Save error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (confirm('Discard changes and return to admin?')) {
      router.push('/admin')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => router.push('/admin')} style={{ marginTop: '20px' }}>
          Back to Admin
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h1>{isNew ? 'Create New Popup' : `Edit: ${popup.name}`}</h1>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Back to Admin
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Basic Info</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Popup ID {isNew && <span style={{ color: '#dc3545' }}>*</span>}
              </label>
              <input
                placeholder="lowercase-with-dashes"
                value={popup.id}
                onChange={(e) => setPopup({...popup, id: e.target.value})}
                disabled={!isNew}
                style={{ 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  width: '100%',
                  background: isNew ? 'white' : '#e9ecef'
                }}
              />
              <small style={{ color: '#6c757d' }}>Cannot be changed after creation</small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Display Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="User-friendly name"
                value={popup.name}
                onChange={(e) => setPopup({...popup, name: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Global Control Tag ID <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="Tag ID from Global Control"
                value={popup.tagId}
                onChange={(e) => setPopup({...popup, tagId: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Design</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Color Variant</label>
              <select
                value={popup.variant}
                onChange={(e) => setPopup({...popup, variant: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="purple">Purple (ForbiddenFood)</option>
                <option value="blue">Blue (HealthHarmonic)</option>
                <option value="green">Green (Natural)</option>
                <option value="red">Red (Urgent)</option>
                <option value="orange">Orange (Energy)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Layout</label>
              <select
                value={popup.layout}
                onChange={(e) => setPopup({...popup, layout: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="centered">Centered Layout</option>
                <option value="side-by-side">Side-by-Side Layout</option>
                <option value="compact">Compact Layout</option>
                <option value="overlay">Overlay Layout</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Content</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Headline <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="Main headline"
                value={popup.headline}
                onChange={(e) => setPopup({...popup, headline: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subheadline</label>
              <input
                placeholder="Supporting text"
                value={popup.subheadline}
                onChange={(e) => setPopup({...popup, subheadline: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Body Copy</label>
              <textarea
                placeholder="Additional details (optional)"
                value={popup.bodyCopy}
                onChange={(e) => setPopup({...popup, bodyCopy: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Button Text <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="Call to action"
                value={popup.buttonText}
                onChange={(e) => setPopup({...popup, buttonText: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Image (Optional)</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image Position</label>
              <select
                value={popup.imagePosition}
                onChange={(e) => setPopup({...popup, imagePosition: e.target.value})}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="none">No Image</option>
                <option value="full-width">Top, Full Width</option>
                <option value="top-right">Top Right Corner</option>
                <option value="left-side">Left Side</option>
              </select>
            </div>

            {popup.imagePosition !== 'none' && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      
                      const formData = new FormData()
                      formData.append('file', file)
                      
                      try {
                        const token = localStorage.getItem('mv_popup_token')
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                          body: formData
                        })
                        const data = await response.json()
                        if (data.success) {
                          setPopup({...popup, imageUrl: data.url})
                          alert('Image uploaded!')
                        }
                      } catch (err) {
                        alert('Upload failed: ' + err.message)
                      }
                    }}
                    style={{ marginBottom: '10px' }}
                  />
                  <input
                    placeholder="Or enter image URL"
                    value={popup.imageUrl}
                    onChange={(e) => setPopup({...popup, imageUrl: e.target.value})}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Scale: {popup.imageScale}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={popup.imageScale}
                    onChange={(e) => setPopup({...popup, imageScale: parseInt(e.target.value)})}
                    style={{ width: '100%' }}
                  />
                </div>
              </>
            )}
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Fields</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={popup.includeFirstName}
                onChange={(e) => setPopup({...popup, includeFirstName: e.target.checked})}
              />
              <span>Include First Name field</span>
            </label>
          </div>

          {/* Save/Cancel Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                padding: '15px',
                background: saving ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Saving...' : (isNew ? 'Create Popup' : 'Save Changes')}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              style={{
                padding: '15px 30px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          <h3 style={{ marginBottom: '15px' }}>Live Preview</h3>
          <div style={{ 
            background: '#f0f0f0', 
            padding: '30px', 
            borderRadius: '8px',
            minHeight: '500px'
          }}>
            <PopupPreview config={popup} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PopupEditPage() {
  return <PopupEditForm />
}
