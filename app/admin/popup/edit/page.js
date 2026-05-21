'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PopupEditPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [popupId, setPopupId] = useState('')
  const [isNew, setIsNew] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
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
    includeFirstName: true
  })

  // Mount detection
  useEffect(() => {
    setMounted(true)
    
    // Parse URL
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id') || ''
    setPopupId(id)
    setIsNew(!id)
    
    if (!id) {
      // New popup - ready to go
      setLoading(false)
    }
  }, [])

  // Load existing popup
  useEffect(() => {
    if (!mounted || !popupId) return
    
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
          setError('Failed to load')
          setLoading(false)
          return
        }
        
        const existing = data.popups.find(p => p.id === popupId)
        if (!existing) {
          setError('Popup not found')
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
          includeFirstName: existing.fields?.includes('firstName') || false
        })
        
        setLoading(false)
      } catch (err) {
        setError('Error: ' + err.message)
        setLoading(false)
      }
    }
    
    load()
  }, [mounted, popupId])

  async function save() {
    const token = localStorage.getItem('mv_popup_token')
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
      alert('Saved!')
      router.push('/admin')
    } else {
      alert('Error: ' + data.error)
    }
  }

  if (!mounted) return <div style={{ padding: 40 }}>Initializing...</div>
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error} <button onClick={() => router.push('/admin')}>Back</button></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <h1>{isNew ? 'Create Popup' : 'Edit: ' + popup.name}</h1>
        <button onClick={() => router.push('/admin')}>← Back to Admin</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        <div>
          <div style={{ marginBottom: 15 }}>
            <label>ID</label>
            <input 
              value={popup.id} 
              onChange={e => setPopup({...popup, id: e.target.value})}
              disabled={!isNew}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Name</label>
            <input 
              value={popup.name} 
              onChange={e => setPopup({...popup, name: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Tag ID</label>
            <input 
              value={popup.tagId} 
              onChange={e => setPopup({...popup, tagId: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Variant</label>
            <select 
              value={popup.variant} 
              onChange={e => setPopup({...popup, variant: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            >
              <option value="purple">Purple</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Layout</label>
            <select 
              value={popup.layout} 
              onChange={e => setPopup({...popup, layout: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            >
              <option value="centered">Centered</option>
              <option value="side-by-side">Side-by-Side</option>
              <option value="compact">Compact</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Headline</label>
            <input 
              value={popup.headline} 
              onChange={e => setPopup({...popup, headline: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Subheadline</label>
            <input 
              value={popup.subheadline} 
              onChange={e => setPopup({...popup, subheadline: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label>Button Text</label>
            <input 
              value={popup.buttonText} 
              onChange={e => setPopup({...popup, buttonText: e.target.value})}
              style={{ width: '100%', padding: 10 }}
            />
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
            <input 
              type="checkbox"
              checked={popup.includeFirstName} 
              onChange={e => setPopup({...popup, includeFirstName: e.target.checked})}
            />
            Include First Name
          </label>
          
          <button onClick={save} style={{ padding: '15px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6 }}>
            {isNew ? 'Create' : 'Save'}
          </button>
        </div>
        
        <div style={{ background: '#f0f0f0', padding: 20, borderRadius: 8 }}>
          <h3>Preview</h3>
          <div style={{ 
            background: popup.variant === 'purple' ? '#faf5ff' : popup.variant === 'blue' ? '#eff6ff' : popup.variant === 'green' ? '#ecfdf5' : '#fef2f2',
            padding: 30,
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <h2>{popup.headline || 'Headline'}</h2>
            <p>{popup.subheadline || 'Subheadline'}</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              {popup.includeFirstName && <input placeholder="First Name" disabled style={{ flex: 1, padding: 10 }} />}
              <input placeholder="Email" disabled style={{ flex: 2, padding: 10 }} />
            </div>
            <button disabled style={{ padding: '15px 30px', background: '#333', color: 'white', border: 'none', borderRadius: 6 }}>
              {popup.buttonText || 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
