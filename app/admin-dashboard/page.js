'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [popups, setPopups] = useState([])
  const [stats, setStats] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
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
    includeFirstName: true
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

  function handleCreatePopup() {
    // TODO: Save to Control Board and redeploy
    alert('Create popup functionality - requires backend implementation')
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
              // Simple password check for now
              login(e.target.value)
            }
          }}
        />
        <button
          onClick={(e) => {
            const input = e.target.previousSibling
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
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '12px 24px',
            background: '#28a745',
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
          <h2>Create New Popup</h2>
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
                <input
                  placeholder="Image URL"
                  value={newPopup.imageUrl}
                  onChange={(e) => setNewPopup({...newPopup, imageUrl: e.target.value})}
                  style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                />
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
                cursor: 'pointer'
              }}
            >
              Create Popup
            </button>
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
                  <button style={{
                    padding: '6px 12px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}>
                    Edit
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
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
    </div>
  )
}
