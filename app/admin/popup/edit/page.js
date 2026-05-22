'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TemplateSelector from '../../components/templates/TemplateSelector'
import PopupPreview from '../../components/templates/PopupPreview'
import { templates, colorVariants } from '../../components/templates/template-config'

export default function PopupEditPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [popupId, setPopupId] = useState('')
  const [isNew, setIsNew] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content') // 'content', 'template', 'design'
  const [isMobilePreview, setIsMobilePreview] = useState(true)
  
  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  
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
    imageOffsetX: 0,
    imageOffsetY: 0,
    includeFirstName: true,
    includePhone: false,
    avatarUrl: '',
    avatarPosition: 'bottom-left',
    chatMessage: 'Want to have a free consultation with an expert?',
    trustText: 'We respect your email inbox and will never spam!',
    showTrustText: true,
    showOverlay: false,
    overlayColor: '#000000',
    overlayOpacity: 50,
    buttonColor: '#3b82f6',
    popupHeight: 'standard',
    useCustomTextColors: false,
    headlineColor: '#000000',
    subheadlineColor: '#666666',
    triggerType: 'button',
    triggerDelay: 180,
    buttonAlign: 'center',
    template: 'clean-gradient',
    includeFirstName: true,
    includePhone: false
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
          includePhone: false,
          triggerType: params.get('triggerType') || 'button',
          triggerDelay: parseInt(params.get('triggerDelay')) || 180,
          buttonAlign: params.get('buttonAlign') || 'center',
          template: params.get('template') || 'clean-gradient'
        })
        
        // Set template
        const templateId = params.get('template') || 'clean-gradient'
        const template = templates.find(t => t.id === templateId) || templates[0]
        setSelectedTemplate(template)
        
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
        
        const templateId = existing.template || 'clean-gradient'
        const template = templates.find(t => t.id === templateId) || templates[0]
        setSelectedTemplate(template)
        
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
          includePhone: existing.fields?.includes('phone') || false,
          triggerType: existing.triggerType || 'button',
          triggerDelay: existing.triggerDelay || 180,
          buttonAlign: existing.buttonAlign || 'center',
          template: templateId,
          // New v2.8.x fields
          buttonColor: existing.buttonColor || '#3b82f6',
          popupHeight: existing.popupHeight || 'standard',
          trustText: existing.trustText || 'We respect your email inbox and will never spam!',
          showTrustText: existing.showTrustText !== undefined ? existing.showTrustText : true,
          showOverlay: existing.showOverlay !== undefined ? existing.showOverlay : false,
          overlayColor: existing.overlayColor || '#000000',
          overlayOpacity: existing.overlayOpacity || 50,
          useCustomTextColors: existing.useCustomTextColors || false,
          headlineColor: existing.headlineColor || '#000000',
          subheadlineColor: existing.subheadlineColor || '#666666',
          // Personal Consultation fields
          avatarUrl: existing.avatarUrl || '',
          avatarPosition: existing.avatarPosition || 'bottom-left',
          chatMessage: existing.chatMessage || 'Want to have a free consultation with an expert?'
        })
        
        setLoading(false)
      } catch (err) {
        setError('Error: ' + err.message)
        setLoading(false)
      }
    }
    
    load()
  }, [mounted, popupId])

  // Update popup when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setPopup(prev => ({
        ...prev,
        template: selectedTemplate.id,
        layout: selectedTemplate.config.layout,
        variant: selectedTemplate.config.defaultVariant
      }))
    }
  }, [selectedTemplate])

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
      
      const fields = ['email']
      if (popup.includeFirstName) fields.push('firstName')
      if (popup.includePhone) fields.push('phone')
      
      const res = await fetch('/api/popups/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          popup: {
            ...popup,
            design: {
              variant: popup.variant,
              layout: popup.layout,
              headline: popup.headline,
              subheadline: popup.subheadline,
              bodyCopy: popup.bodyCopy,
              buttonText: popup.buttonText,
              image: {
                url: popup.imageUrl,
                position: popup.imagePosition,
                scale: popup.imageScale
              }
            },
            fields,
            template: selectedTemplate.id,
            // Include all new v2.8.x fields
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
            avatarUrl: popup.avatarUrl,
            avatarPosition: popup.avatarPosition,
            chatMessage: popup.chatMessage
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

  function handleTemplateSelect(template) {
    setSelectedTemplate(template)
    // Update popup fields based on template defaults
    setPopup(prev => ({
      ...prev,
      template: template.id,
      layout: template.config.layout,
      variant: template.config.defaultVariant,
      includeFirstName: template.config.fields.includes('firstName'),
      includePhone: template.config.fields.includes('phone')
    }))
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
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20 }}>
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

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '5px', 
        marginBottom: '30px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {[
          { id: 'template', label: 'Template', icon: '🎨' },
          { id: 'content', label: 'Content', icon: '📝' },
          { id: 'design', label: 'Design', icon: '🎭' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? '#007bff' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {/* Left: Form */}
        <div>
          {activeTab === 'template' && (
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateSelect}
              selectedVariant={popup.variant}
              onVariantChange={(variant) => setPopup({...popup, variant})}
            />
          )}

          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
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
            </div>
          )}

          {activeTab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Fields</h3>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <input
                    type="checkbox"
                    checked={popup.includeFirstName}
                    onChange={(e) => setPopup({...popup, includeFirstName: e.target.checked})}
                  />
                  <span>Include First Name field</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={popup.includePhone}
                    onChange={(e) => setPopup({...popup, includePhone: e.target.checked})}
                  />
                  <span>Include Phone Number field</span>
                </label>
              </div>

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
                        min="10"
                        max="400"
                        value={popup.imageScale}
                        onChange={(e) => setPopup({...popup, imageScale: parseInt(e.target.value)})}
                        style={{ width: '100%' }}
                      />
                      <small style={{ color: '#6c757d' }}>10% to 400%</small>
                    </div>
                    
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                        Horizontal Position: {popup.imageOffsetX || 0}%
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={popup.imageOffsetX || 0}
                        onChange={(e) => setPopup({...popup, imageOffsetX: parseInt(e.target.value)})}
                        style={{ width: '100%' }}
                      />
                      <small style={{ color: '#6c757d' }}>Move image left/right</small>
                    </div>
                    
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                        Vertical Position: {popup.imageOffsetY || 0}%
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={popup.imageOffsetY || 0}
                        onChange={(e) => setPopup({...popup, imageOffsetY: parseInt(e.target.value)})}
                        style={{ width: '100%' }}
                      />
                      <small style={{ color: '#6c757d' }}>Move image up/down</small>
                    </div>
                  </>
                )}
              </div>
              
              {/* Trust Text Settings */}
              <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Trust Text</h3>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                  <input
                    type="checkbox"
                    checked={popup.showTrustText}
                    onChange={(e) => setPopup({...popup, showTrustText: e.target.checked})}
                  />
                  <span>Show trust message</span>
                </label>
                
                {popup.showTrustText && (
                  <input
                    value={popup.trustText}
                    onChange={(e) => setPopup({...popup, trustText: e.target.value})}
                    placeholder="We respect your email inbox..."
                    style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                )}
              </div>
              
              {/* Button Color */}
              <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Button Color</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    { name: 'Blue', value: '#3b82f6' },
                    { name: 'Green', value: '#22c55e' },
                    { name: 'Red', value: '#ef4444' },
                    { name: 'Purple', value: '#8b5cf6' },
                    { name: 'Orange', value: '#f97316' },
                    { name: 'Pink', value: '#ec4899' },
                    { name: 'Teal', value: '#14b8a6' },
                    { name: 'Black', value: '#1f2937' }
                  ].map(color => (
                    <button
                      key={color.value}
                      onClick={() => setPopup({...popup, buttonColor: color.value})}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: color.value,
                        border: popup.buttonColor === color.value ? '3px solid #000' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              {/* Popup Height */}
              <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Popup Height</h3>
                <select
                  value={popup.popupHeight}
                  onChange={(e) => setPopup({...popup, popupHeight: e.target.value})}
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="compact">Compact (minimal)</option>
                  <option value="standard">Standard</option>
                  <option value="tall">Tall (more content space)</option>
                </select>
              </div>
              
              {/* Custom Text Colors */}
              <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Custom Text Colors</h3>
                
                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={popup.useCustomTextColors}
                      onChange={(e) => setPopup({...popup, useCustomTextColors: e.target.checked})}
                    />
                    <span>Use custom text colors</span>
                  </label>
                </div>
                
                {popup.useCustomTextColors && (
                  <>
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Headline Color</label>
                      <input
                        type="color"
                        value={popup.headlineColor || '#000000'}
                        onChange={(e) => setPopup({...popup, headlineColor: e.target.value})}
                        style={{ width: '60px', height: '40px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Subheadline Color</label>
                      <input
                        type="color"
                        value={popup.subheadlineColor || '#666666'}
                        onChange={(e) => setPopup({...popup, subheadlineColor: e.target.value})}
                        style={{ width: '60px', height: '40px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Full Background Overlay Settings */}
              {selectedTemplate.id === 'full-background' && (
                <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                  <h3 style={{ marginTop: 0 }}>Overlay Settings</h3>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                    <input
                      type="checkbox"
                      checked={popup.showOverlay}
                      onChange={(e) => setPopup({...popup, showOverlay: e.target.checked})}
                    />
                    <span>Show color overlay on image</span>
                  </label>
                  
                  {popup.showOverlay && (
                    <>
                      <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Overlay Color</label>
                        <input
                          type="color"
                          value={popup.overlayColor}
                          onChange={(e) => setPopup({...popup, overlayColor: e.target.value})}
                          style={{ width: '60px', height: '40px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                        />
                      </div>
                      
                      <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                          Overlay Opacity: {popup.overlayOpacity}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={popup.overlayOpacity}
                          onChange={(e) => setPopup({...popup, overlayOpacity: parseInt(e.target.value)})}
                          style={{ width: '100%' }}
                        />
                        <small style={{ color: '#6c757d' }}>10% = subtle tint, 90% = nearly solid</small>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Avatar Settings - Only show for Personal Consultation template */}
              {selectedTemplate.id === 'personal-consultation' && (
                <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                  <h3 style={{ marginTop: 0 }}>Avatar Settings</h3>
                  
                  <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Avatar Image</label>
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
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          })
                          const data = await res.json()
                          if (data.success) {
                            setPopup({...popup, avatarUrl: data.url})
                            alert('Avatar uploaded!')
                          }
                        } catch (err) {
                          alert('Upload error: ' + err.message)
                        }
                      }}
                      style={{ marginBottom: 10 }}
                    />
                    <input
                      placeholder="Or enter avatar image URL"
                      value={popup.avatarUrl}
                      onChange={(e) => setPopup({...popup, avatarUrl: e.target.value})}
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Avatar Position</label>
                    <select
                      value={popup.avatarPosition}
                      onChange={(e) => setPopup({...popup, avatarPosition: e.target.value})}
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    >
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Chat Message (Mobile)</label>
                    <input
                      value={popup.chatMessage}
                      onChange={(e) => setPopup({...popup, chatMessage: e.target.value})}
                      placeholder="Want to have a free consultation with an expert?"
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                    <small style={{ color: '#6c757d' }}>Appears as chat bubble before popup on mobile</small>
                  </div>
                </div>
              )}
            </div>
          )}

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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 15 
          }}>
            <h3 style={{ margin: 0 }}>Live Preview</h3>
            <div>
              <button
                onClick={() => setIsMobilePreview(false)}
                style={{
                  padding: '6px 12px',
                  background: !isMobilePreview ? '#007bff' : '#e5e7eb',
                  color: !isMobilePreview ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px 0 0 4px',
                  cursor: 'pointer'
                }}
              >
                Desktop
              </button>
              <button
                onClick={() => setIsMobilePreview(true)}
                style={{
                  padding: '6px 12px',
                  background: isMobilePreview ? '#007bff' : '#e5e7eb',
                  color: isMobilePreview ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer'
                }}
              >
                Mobile
              </button>
            </div>
          </div>
          
          <div style={{ 
            background: '#f0f0f0', 
            padding: isMobilePreview ? '20px' : '30px', 
            borderRadius: 8,
            minHeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PopupPreview 
              popup={popup} 
              template={selectedTemplate}
              isMobile={isMobilePreview}
            />
          </div>
          
          <div style={{ marginTop: 15, padding: 15, background: '#f8f9fa', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Template: {selectedTemplate.name}</h4>
            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
              {isMobilePreview 
                ? selectedTemplate.config.showImageOnMobile 
                  ? 'Mobile: Image shown (compact)'
                  : 'Mobile: Clean form, image hidden'
                : 'Desktop: Full design with image'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
