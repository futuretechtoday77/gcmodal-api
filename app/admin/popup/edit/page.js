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

export default function PopupEditPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [popupId, setPopupId] = useState('')
  const [isNew, setIsNew] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  
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

  // Mount detection and URL parsing
  useEffect(() => {
    try {
      setMounted(true)
      
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id') || ''
      setPopupId(id)
      setIsNew(!id)
      
      // Check for clone data in URL
      if (params.get('clone') === 'true') {
        setPopup({
          id: params.get('id') || '',
          name: params.get('name') || '',
          tagId: params.get('tagId') || '',
          variant: params.get('variant') || 'purple',
          layout: params.get('layout') || 'centered',
          headline: params.get('headline') || '',
          subheadline: params.get('subheadline') || '',
          bodyCopy: params.get('bodyCopy') || '',
          buttonText: params.get('buttonText') || '',
          imageUrl: params.get('imageUrl') || '',
          imagePosition: params.get('imagePosition') || 'none',
          imageScale: parseInt(params.get('imageScale')) || 100,
          includeFirstName: params.get('includeFirstName') === 'true',
          triggerType: params.get('triggerType') || 'button',
          triggerDelay: parseInt(params.get('triggerDelay')) || 180,
          buttonAlign: params.get('buttonAlign') || 'center'
        })
        setLoading(false)
      } else if (!id) {
        setLoading(false)
      }
    } catch (err) {
      setError('Init error: ' + err.message)
      setLoading(false)
    }
  }, [])

  // Load existing popup
  useEffect(() => {
    if (!mounted || !popupId || popupId === 'true') return
    
    async function load() {
      try {
        const token = localStorage.getItem('mv_popup_token')
        if (!token) {
          setError('Not logged in')
          setLoading(false)
          return
        }
        
        const res = await fetch('/api/admin/popups', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        
        if (!data.success) {
          setError('Failed to load: ' + (data.error || 'Unknown'))
          setLoading(false)
          return
        }
        
        // Convert object to array with IDs
        let popupsArray
        if (Array.isArray(data.popups)) {
          popupsArray = data.popups
        } else if (typeof data.popups === 'object' && data.popups !== null) {
          popupsArray = Object.entries(data.popups).map(([id, popup]) => ({
            ...popup,
            id
          }))
        } else {
          setError('Invalid data format')
          setLoading(false)
          return
        }
        
        const existing = popupsArray.find(p => p.id === popupId)
        if (!existing) {
          setError(`Popup '${popupId}' not found`)
          setLoading(false)
          return
        }
        
        setPopup({
          id: existing.id,
          name: existing.name,
          tagId: existing.tagId,
          variant: existing.design?.variant || 'purple',
          layout: existing.design?.layout || 'centered',
          headline: existing.design?.headline || '',
          subheadline: existing.design?.subheadline || '',
          bodyCopy: existing.design?.bodyCopy || '',
          buttonText: existing.design?.buttonText || '',
          imageUrl: existing.design?.image?.url || '',
          imagePosition: existing.design?.image?.position || 'none',
          imageScale: existing.design?.image?.scale || 100,
          includeFirstName: existing.fields?.includes('firstName') || false,
          triggerType: existing.triggerType || 'button',
          triggerDelay: existing.triggerDelay || 180,
          buttonAlign: existing.buttonAlign || 'center'
        })
        
        setLoading(false)
      } catch (err) {
        setError('Error: ' + err.message)
        setLoading(false)
      }
    }
    
    load()
  }, [mounted, popupId])

  async function handleSave() {
    if (!popup.id || !popup.name || !popup.tagId || !popup.headline || !popup.buttonText) {
      alert('Please fill in all required fields: ID, Name, Tag ID, Headline, Button Text')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('mv_popup_token')
      if (!token) {
        alert('Not authenticated')
        return
      }
      
      const res = await fetch('/api/popups/save', {
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
      
      const data = await res.json()
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

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = localStorage.getItem('mv_popup_token')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      const data = await res.json()
      if (data.success) {
        setPopup({...popup, imageUrl: data.url})
        alert('Image uploaded!')
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (err) {
      alert('Upload error: ' + err.message)
    }
  }

  if (!mounted) return <div style={{ padding: 40 }}>Initializing...</div>
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ background: '#fee', color: '#c00', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <strong>Error:</strong> {error}
        </div>
        <button onClick={() => router.push('/admin')}>Back to Admin</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h1>{isNew ? 'Create New Popup' : `Edit: ${popup.name}`}</h1>
        <button onClick={handleCancel} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: 6 }}>
          ← Back to Admin
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          
          {/* Basic Info */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Basic Info</h3>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Popup ID {isNew && <span style={{ color: '#dc3545' }}>*</span>}
              </label>
              <input
                value={popup.id}
                onChange={(e) => setPopup({...popup, id: e.target.value})}
                disabled={!isNew}
                placeholder="lowercase-with-dashes"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', background: isNew ? 'white' : '#e9ecef' }}
              />
              <small style={{ color: '#6c757d' }}>Cannot be changed after creation</small>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Display Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                value={popup.name}
                onChange={(e) => setPopup({...popup, name: e.target.value})}
                placeholder="User-friendly name"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Global Control Tag ID <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                value={popup.tagId}
                onChange={(e) => setPopup({...popup, tagId: e.target.value})}
                placeholder="Tag ID from Global Control"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* Design */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Design</h3>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Color Variant</label>
              <select
                value={popup.variant}
                onChange={(e) => setPopup({...popup, variant: e.target.value})}
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="purple">Purple (ForbiddenFood)</option>
                <option value="blue">Blue (HealthHarmonic)</option>
                <option value="green">Green (Natural)</option>
                <option value="red">Red (Urgent)</option>
                <option value="orange">Orange (Energy)</option>
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Layout</label>
              <select
                value={popup.layout}
                onChange={(e) => setPopup({...popup, layout: e.target.value})}
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="centered">Centered Layout</option>
                <option value="side-by-side">Side-by-Side Layout</option>
                <option value="compact">Compact Layout</option>
                <option value="overlay">Overlay Layout</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Content</h3>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Headline <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                value={popup.headline}
                onChange={(e) => setPopup({...popup, headline: e.target.value})}
                placeholder="Main headline"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Subheadline</label>
              <input
                value={popup.subheadline}
                onChange={(e) => setPopup({...popup, subheadline: e.target.value})}
                placeholder="Supporting text"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Body Copy</label>
              <textarea
                value={popup.bodyCopy}
                onChange={(e) => setPopup({...popup, bodyCopy: e.target.value})}
                placeholder="Additional details (optional)"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', minHeight: 80 }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Button Text <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                value={popup.buttonText}
                onChange={(e) => setPopup({...popup, buttonText: e.target.value})}
                placeholder="Call to action"
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* Image */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Image (Optional)</h3>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Image Position</label>
              <select
                value={popup.imagePosition}
                onChange={(e) => setPopup({...popup, imagePosition: e.target.value})}
                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="none">No Image</option>
                <option value="full-width">Top, Full Width</option>
                <option value="top-right">Top Right Corner</option>
                <option value="left-side">Left Side</option>
              </select>
            </div>

            {popup.imagePosition !== 'none' && (
              <>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginBottom: 10 }}
                  />
                  <input
                    placeholder="Or enter image URL"
                    value={popup.imageUrl}
                    onChange={(e) => setPopup({...popup, imageUrl: e.target.value})}
                    style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
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

          {/* Fields */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Fields</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={popup.includeFirstName}
                onChange={(e) => setPopup({...popup, includeFirstName: e.target.checked})}
              />
              <span>Include First Name field</span>
            </label>
          </div>

          {/* Save/Cancel */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                padding: 15,
                background: saving ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: 16,
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
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          <h3 style={{ marginBottom: 15 }}>Live Preview</h3>
          <div style={{ 
            background: '#f0f0f0', 
            padding: 30, 
            borderRadius: 8,
            minHeight: 500
          }}>
            <PopupPreview config={popup} />
          </div>
        </div>
      </div>
    </div>
  )
}
