/**
 * Folder Manager Component
 * Organize popups and split tests into folders
 * 
 * v2.5.3 - Folder Organization Feature
 */

'use client'

import { useState, useEffect } from 'react'

export default function FolderManager({ type, items, stats, onItemMove, onFoldersChange, onEditItem, onCloneItem, onShowCode, onDeleteItem }) {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolder, setEditingFolder] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedOverFolder, setDraggedOverFolder] = useState(null)

  // Load folders on mount
  useEffect(() => {
    loadFolders()
  }, [type])

  // Notify parent when folders change
  useEffect(() => {
    if (onFoldersChange) {
      onFoldersChange(folders)
    }
  }, [folders, onFoldersChange])

  async function loadFolders() {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/folders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        // Filter folders by type
        const typeFolders = data.folders.filter(f => f.type === type)
        setFolders(typeFolders)
        // Notify parent of initial load
        if (onFoldersChange) {
          onFoldersChange(typeFolders)
        }
      }
    } catch (error) {
      console.error('Error loading folders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createFolder() {
    if (!newFolderName.trim()) return

    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFolderName,
          type: type
        })
      })

      const data = await response.json()
      if (data.success) {
        const newFolders = [...folders, data.folder]
        setFolders(newFolders)
        setNewFolderName('')
        setShowCreateForm(false)
        // Auto-expand new folder
        setExpandedFolders(new Set([...expandedFolders, data.folder.id]))
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  async function renameFolder(folderId, newName) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/folders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId,
          action: 'rename',
          name: newName
        })
      })

      const data = await response.json()
      if (data.success) {
        const updatedFolders = folders.map(f => f.id === folderId ? data.folder : f)
        setFolders(updatedFolders)
        setEditingFolder(null)
      }
    } catch (error) {
      console.error('Error renaming folder:', error)
    }
  }

  async function deleteFolder(folderId) {
    if (!confirm('Are you sure you want to delete this folder? Items in the folder will not be deleted.')) {
      return
    }

    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch(`/api/admin/folders?id=${folderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.success) {
        const updatedFolders = folders.filter(f => f.id !== folderId)
        setFolders(updatedFolders)
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  async function addItemToFolder(folderId, itemId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/folders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId,
          action: 'addItem',
          itemId
        })
      })

      const data = await response.json()
      if (data.success) {
        const updatedFolders = folders.map(f => f.id === folderId ? data.folder : f)
        setFolders(updatedFolders)
      }
    } catch (error) {
      console.error('Error adding item to folder:', error)
    }
  }

  async function removeItemFromFolder(folderId, itemId) {
    try {
      const token = localStorage.getItem('mv_popup_token')
      const response = await fetch('/api/admin/folders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId,
          action: 'removeItem',
          itemId
        })
      })

      const data = await response.json()
      if (data.success) {
        const updatedFolders = folders.map(f => f.id === folderId ? data.folder : f)
        setFolders(updatedFolders)
      }
    } catch (error) {
      console.error('Error removing item from folder:', error)
    }
  }

  function toggleFolder(folderId) {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  // Get items not in any folder
  function getUnorganizedItems() {
    const allFolderedItemIds = folders.flatMap(f => f.items)
    return items.filter(item => !allFolderedItemIds.includes(item.id || item.testId))
  }

  // Drag and drop handlers
  function handleDragStart(e, item) {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, folderId) {
    e.preventDefault()
    setDraggedOverFolder(folderId)
  }

  function handleDragLeave(e) {
    setDraggedOverFolder(null)
  }

  async function handleDrop(e, folderId) {
    e.preventDefault()
    setDraggedOverFolder(null)
    
    if (draggedItem) {
      // Remove from any existing folders first
      for (const folder of folders) {
        if (folder.items.includes(draggedItem.id || draggedItem.testId)) {
          await removeItemFromFolder(folder.id, draggedItem.id || draggedItem.testId)
        }
      }
      // Add to new folder
      await addItemToFolder(folderId, draggedItem.id || draggedItem.testId)
      setDraggedItem(null)
    }
  }

  async function handleUnorganizedDrop(e) {
    e.preventDefault()
    setDraggedOverFolder(null)
    
    if (draggedItem) {
      // Remove from all folders
      for (const folder of folders) {
        if (folder.items.includes(draggedItem.id || draggedItem.testId)) {
          await removeItemFromFolder(folder.id, draggedItem.id || draggedItem.testId)
        }
      }
      setDraggedItem(null)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', color: '#666' }}>Loading folders...</div>
  }

  const unorganizedItems = getUnorganizedItems()

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        padding: '10px 15px',
        background: '#f8f9fa',
        borderRadius: '6px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>
          📁 Folders ({folders.length})
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '6px 12px',
            background: showCreateForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ New Folder'}
        </button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '15px',
          padding: '15px',
          background: '#e7f3ff',
          borderRadius: '6px'
        }}>
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createFolder()}
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={createFolder}
            disabled={!newFolderName.trim()}
            style={{
              padding: '8px 16px',
              background: newFolderName.trim() ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: newFolderName.trim() ? 'pointer' : 'not-allowed',
              fontSize: '13px'
            }}
          >
            Create
          </button>
        </div>
      )}

      {/* Folders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {folders.map(folder => (
          <div 
            key={folder.id}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
            style={{
              border: draggedOverFolder === folder.id 
                ? '2px dashed #007bff' 
                : '1px solid #e0e0e0',
              borderRadius: '6px',
              background: draggedOverFolder === folder.id ? '#e7f3ff' : 'white',
              overflow: 'hidden'
            }}
          >
            {/* Folder Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                background: '#f8f9fa',
                cursor: 'pointer',
                borderBottom: expandedFolders.has(folder.id) ? '1px solid #e0e0e0' : 'none'
              }}
              onClick={() => toggleFolder(folder.id)}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>
                {expandedFolders.has(folder.id) ? '📂' : '📁'}
              </span>
              
              {editingFolder === folder.id ? (
                <input
                  type="text"
                  defaultValue={folder.name}
                  onBlur={(e) => renameFolder(folder.id, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      renameFolder(folder.id, e.target.value)
                    }
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    border: '1px solid #007bff',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span style={{ flex: 1, fontWeight: 500 }}>
                  {folder.name}
                  <span style={{ 
                    marginLeft: '8px', 
                    color: '#666', 
                    fontSize: '12px',
                    fontWeight: 'normal'
                  }}>
                    ({folder.items.length} items)
                  </span>
                </span>
              )}

              {/* Folder Actions */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingFolder(folder.id)
                  }}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#007bff'
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFolder(folder.id)
                  }}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#dc3545'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Folder Items */}
            {expandedFolders.has(folder.id) && (
              <div style={{ padding: '10px' }}>
                {folder.items.length === 0 ? (
                  <p style={{ 
                    margin: 0, 
                    color: '#999', 
                    fontSize: '13px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    Drop items here
                  </p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f1f3f5', borderBottom: '1px solid #dee2e6' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Name</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>ID</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>Shown</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>Submitted</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>Conversion</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {folder.items.map(itemId => {
                        const item = items.find(i => (i.id || i.testId) === itemId)
                        if (!item) return null
                        
                        const itemStats = stats?.[item.id] || { shown: 0, submitted: 0 }
                        const conversion = itemStats.shown > 0 
                          ? ((itemStats.submitted / itemStats.shown) * 100).toFixed(1) 
                          : '0.0'
                        
                        return (
                          <tr 
                            key={itemId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            style={{ 
                              borderBottom: '1px solid #e9ecef',
                              cursor: 'grab',
                              background: 'white'
                            }}
                          >
                            <td style={{ padding: '8px', fontSize: '13px' }}>
                              📄 {item.name || item.testId}
                            </td>
                            <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                              {item.id}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px' }}>
                              {itemStats.shown.toLocaleString()}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px' }}>
                              {itemStats.submitted.toLocaleString()}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>
                              {conversion}%
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {onEditItem && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onEditItem(item)
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      background: '#6c757d',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                    title="Edit"
                                  >
                                    Edit
                                  </button>
                                )}
                                {onCloneItem && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onCloneItem(item)
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      background: '#17a2b8',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                    title="Clone"
                                  >
                                    Clone
                                  </button>
                                )}
                                {onShowCode && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onShowCode(item)
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      background: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                    title="View Code"
                                  >
                                    Code
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeItemFromFolder(folder.id, itemId)
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    background: '#ffc107',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                  title="Remove from folder (doesn't delete popup)"
                                >
                                  Remove
                                </button>
                                {onDeleteItem && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteItem(item)
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      background: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                    title="Delete popup permanently"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Unorganized Items */}
        <div 
          onDragOver={(e) => handleDragOver(e, 'unorganized')}
          onDragLeave={handleDragLeave}
          onDrop={handleUnorganizedDrop}
          style={{
            border: draggedOverFolder === 'unorganized' 
              ? '2px dashed #007bff' 
              : '1px dashed #ccc',
            borderRadius: '6px',
            background: draggedOverFolder === 'unorganized' ? '#e7f3ff' : '#fafafa',
            padding: '15px'
          }}
        >
          <h4 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '14px', 
            color: '#666',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>📋 Unorganized ({unorganizedItems.length})</span>
            <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
              Drag items to folders
            </span>
          </h4>
          
          {unorganizedItems.length === 0 ? (
            <p style={{ margin: 0, color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
              All items are organized
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {unorganizedItems.map(item => (
                <div
                  key={item.id || item.testId}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  style={{
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                    cursor: 'grab',
                    fontSize: '13px'
                  }}
                >
                  {type === 'popup' ? '📄' : '🧪'} {item.name || item.testId}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
