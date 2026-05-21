'use client'

import { useState } from 'react'
import { templates, templateCategories, colorVariants } from './template-config'

export default function TemplateSelector({ selectedTemplate, onSelect, selectedVariant, onVariantChange }) {
  const [activeCategory, setActiveCategory] = useState('all')
  
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory)
  
  return (
    <div>
      {/* Category Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px'
      }}>
        {templateCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              background: activeCategory === cat.id ? '#007bff' : 'transparent',
              color: activeCategory === cat.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeCategory === cat.id ? 'bold' : 'normal'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* Template Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            style={{
              border: selectedTemplate?.id === template.id ? '3px solid #007bff' : '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '15px',
              cursor: 'pointer',
              background: selectedTemplate?.id === template.id ? '#f0f7ff' : 'white',
              transition: 'all 0.2s'
            }}
          >
            {/* Preview Placeholder */}
            <div style={{
              height: '120px',
              background: '#f0f0f0',
              borderRadius: '8px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666'
            }}>
              {template.name}
            </div>
            
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{template.name}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{template.description}</p>
          </div>
        ))}
      </div>
      
      {/* Color Variant Selector */}
      {selectedTemplate && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Color Theme</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(colorVariants).map(([key, variant]) => (
              <button
                key={key}
                onClick={() => onVariantChange(key)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: variant.primary,
                  border: selectedVariant === key ? '3px solid #000' : '2px solid transparent',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title={variant.name}
              >
                {selectedVariant === key && (
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
