'use client'

import { colorVariants } from './template-config'

export default function PopupPreview({ popup, template, isMobile = false }) {
  const variant = colorVariants[popup.variant] || colorVariants.purple
  const templateConfig = template?.config || {}
  
  // Determine if we should show image
  const showImage = !isMobile || templateConfig.showImageOnMobile
  const hasImage = popup.imageUrl && popup.imagePosition !== 'none' && showImage
  
  // Button color - use custom or fall back to variant
  const buttonColor = popup.buttonColor || variant.primary
  
  // Text colors from theme or custom
  const textColor = popup.useCustomTextColors ? popup.headlineColor : (variant.text || '#1f2937')
  const textLightColor = popup.useCustomTextColors ? popup.subheadlineColor : (variant.textLight || '#6b7280')
  
  // Base container styles
  const containerStyles = {
    background: variant.bg,
    borderRadius: templateConfig.styling?.borderRadius || '12px',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: isMobile ? '320px' : (templateConfig.styling?.maxWidth || '500px'),
    width: isMobile ? '320px' : 'auto',
    margin: '0 auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  }
  
  // Render different layouts based on template type
  switch (template?.id) {
    case 'split-screen':
      return renderSplitScreen()
    case 'ultra-minimal':
      return renderUltraMinimal()
    case 'lead-magnet':
      return renderLeadMagnet()
    case 'split-lead-magnet':
      return renderSplitLeadMagnet()
    case 'personal-consultation':
      return renderPersonalConsultation()
    case 'full-background':
    case 'full-background-tall':
    case 'full-background-wide':
    case 'full-background-compact':
      return renderFullBackground()
    case 'clean-gradient':
    default:
      return renderCleanGradient()
  }
  
  function renderCleanGradient() {
    return (
      <div style={{
        ...containerStyles,
        padding: isMobile ? '20px 15px' : '40px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280'
        }}>×</button>
        
        {/* Image (if any) */}
        {hasImage && (
          <div style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: '20px', maxHeight: '180px' }}>
            <img 
              src={popup.imageUrl} 
              alt="" 
              style={{
                width: '100%',
                height: 'auto',
                transform: `scale(${popup.imageScale / 100}) translate(${(popup.imageOffsetX || 0)}%, ${(popup.imageOffsetY || 0)}%)`,
                transformOrigin: 'center center'
              }}
            />
          </div>
        )}
        
        {/* Content */}
        <h2 style={{ 
          color: variant.primary, 
          margin: '0 0 10px 0', 
          fontSize: isMobile ? '22px' : '26px',
          fontWeight: 'bold'
        }}>
          {popup.headline || 'Your Headline'}
        </h2>
        
        {popup.subheadline && (
          <p style={{ 
            color: '#4b5563', 
            margin: '0 0 15px 0', 
            fontSize: isMobile ? '14px' : '16px'
          }}>
            {popup.subheadline}
          </p>
        )}
        
        {popup.bodyCopy && (
          <p style={{ 
            color: '#6b7280', 
            margin: '0 0 20px 0', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {popup.bodyCopy}
          </p>
        )}
        
        {/* Form */}
        <div style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
          {popup.includeFirstName && (
            <input 
              type="text" 
              placeholder="Name" 
              disabled
              style={{
                width: '100%',
                padding: isMobile ? '10px' : '12px',
                marginBottom: isMobile ? '8px' : '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              marginBottom: isMobile ? '8px' : '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          
          {popup.includePhone && (
            <input 
              type="tel" 
              placeholder="Phone Number" 
              disabled
              style={{
                width: '100%',
                padding: isMobile ? '10px' : '12px',
                marginBottom: isMobile ? '8px' : '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          )}
          
          <button 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '12px' : '14px',
              background: buttonColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            {popup.buttonText || 'Submit'}
          </button>
          
          {/* Trust Text */}
          {popup.showTrustText && (
            <p style={{ 
              marginTop: '15px', 
              fontSize: isMobile ? '11px' : '12px', 
              color: '#9ca3af',
              fontStyle: 'italic'
            }}>
              {popup.trustText || 'We respect your email inbox and will never spam!'}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  function renderSplitScreen() {
    if (isMobile) {
      // Mobile: No image, clean form
      return renderCleanGradient()
    }
    
    // Desktop: Side by side
    return (
      <div style={{
        ...containerStyles,
        display: 'flex',
        maxWidth: '700px',
        position: 'relative'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          zIndex: 10
        }}>×</button>
        
        {/* Left: Image */}
        <div style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: popup.imageUrl ? 'transparent' : variant.secondary,
          minHeight: '400px',
          overflow: 'hidden'
        }}>
          {popup.imageUrl ? (
            <img 
              src={popup.imageUrl} 
              alt="" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                objectPosition: 'center'
              }} 
            />
          ) : (
            <span style={{ color: 'white', fontSize: '14px' }}>Image Placeholder</span>
          )}
        </div>
        
        {/* Right: Form */}
        <div style={{
          flex: 1,
          padding: '40px',
          background: variant.bg
        }}>
          <h2 style={{ 
            color: variant.primary, 
            margin: '0 0 10px 0', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {popup.headline || 'Your Headline'}
          </h2>
          
          {popup.subheadline && (
            <p style={{ color: '#4b5563', margin: '0 0 15px 0', fontSize: '15px' }}>
              {popup.subheadline}
            </p>
          )}
          
          {/* Form fields */}
          <div style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
            {popup.includeFirstName && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="First Name" disabled style={{ flex: 1, padding: '12px', border: '2px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
                <input type="text" placeholder="Last Name" disabled style={{ flex: 1, padding: '12px', border: '2px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            )}
            <input type="email" placeholder="Email" disabled style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
            {popup.includePhone && (
              <input type="tel" placeholder="Phone" disabled style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
            )}
            <button disabled style={{ width: '100%', padding: '14px', background: buttonColor, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', boxSizing: 'border-box' }}>
              {popup.buttonText || 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  function renderUltraMinimal() {
    return (
      <div style={{
        ...containerStyles,
        background: 'white',
        padding: isMobile ? '20px 15px' : '30px',
        textAlign: 'center',
        maxWidth: isMobile ? '320px' : '400px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.05)',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#9ca3af'
        }}>×</button>
        
        <h2 style={{ 
          color: '#1f2937', 
          margin: '0 0 8px 0', 
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 'bold',
          lineHeight: '1.3'
        }}>
          {popup.headline || 'Your Headline'}
        </h2>
        
        {popup.subheadline && (
          <p style={{ color: '#6b7280', margin: '0 0 15px 0', fontSize: '13px' }}>
            {popup.subheadline}
          </p>
        )}
        
        <input 
          type="email" 
          placeholder="your@email.com" 
          disabled
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            marginBottom: isMobile ? '10px' : '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        
        {popup.includeFirstName && (
          <input 
            type="text" 
            placeholder="Name" 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              marginBottom: isMobile ? '10px' : '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        )}
        
        <input 
          type="email" 
          placeholder="your@email.com" 
          disabled
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            marginBottom: isMobile ? '10px' : '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        
        {popup.includePhone && (
          <input 
            type="tel" 
            placeholder="Phone Number" 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              marginBottom: isMobile ? '10px' : '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        )}
        
        <button 
          disabled
          style={{
            width: '100%',
            padding: isMobile ? '12px' : '14px',
            background: buttonColor,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 'bold',
            boxSizing: 'border-box'
          }}
        >
          {popup.buttonText || 'Download'}
        </button>
        
        {popup.showTrustText && (
          <p style={{ marginTop: '15px', fontSize: isMobile ? '11px' : '12px', color: '#9ca3af' }}>
            {popup.trustText || 'We respect your email inbox and will never spam!'}
          </p>
        )}
      </div>
    )
  }
  
  function renderLeadMagnet() {
    return (
      <div style={{
        ...containerStyles,
        padding: isMobile ? '15px' : '20px',
        textAlign: 'center',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.05)',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#9ca3af',
          zIndex: 10
        }}>×</button>
        
        {/* Product Image */}
        {showImage && (
          <div style={{
            maxWidth: isMobile ? '150px' : '200px',
            maxHeight: isMobile ? '200px' : '280px',
            margin: '0 auto 10px',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {hasImage ? (
              <img 
                src={popup.imageUrl} 
                alt="" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: isMobile ? '200px' : '280px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }} 
              />
            ) : (
              <div style={{
                width: isMobile ? '100px' : '150px',
                height: isMobile ? '130px' : '200px',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#666',
                borderRadius: '8px'
              }}>Book/Mockup</div>
            )}
          </div>
        )}
        
        <h2 style={{ 
          color: textColor, 
          margin: '0 0 8px 0', 
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 'bold'
        }}>
          {popup.headline || 'Free Guide'}
        </h2>
        
        {popup.includeFirstName && (
          <input 
            type="text" 
            placeholder="Name" 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              marginBottom: isMobile ? '10px' : '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        )}
        
        <input 
          type="email" 
          placeholder="your@email.com" 
          disabled
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            marginBottom: isMobile ? '10px' : '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        
        {popup.includePhone && (
          <input 
            type="tel" 
            placeholder="Phone Number" 
            disabled
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              marginBottom: isMobile ? '10px' : '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        )}
        
        <button 
          disabled
          style={{
            width: '100%',
            padding: isMobile ? '12px' : '14px',
            background: buttonColor,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 'bold',
            boxSizing: 'border-box'
          }}
        >
          {popup.buttonText || 'Download Now'}
        </button>
        
        {popup.showTrustText && (
          <p style={{ marginTop: '15px', fontSize: isMobile ? '11px' : '12px', color: '#9ca3af' }}>
            {popup.trustText || 'We respect your email inbox and will never spam!'}
          </p>
        )}
      </div>
    )
  }
  
  function renderSplitLeadMagnet() {
    // Mobile: Stack layout with image on top
    if (isMobile) {
      return (
        <div style={{
          ...containerStyles,
          maxWidth: '320px',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          background: '#e8f4fc'
        }}>
          {/* Close button */}
          <button style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
            zIndex: 10
          }}>×</button>
          
          {/* Image Section */}
          <div style={{
            padding: '20px',
            background: '#e8f4fc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '180px'
          }}>
            {popup.imageUrl ? (
              <img 
                src={popup.imageUrl} 
                alt="" 
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
                }} 
              />
            ) : (
              <div style={{
                width: '120px',
                height: '160px',
                background: '#cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#64748b'
              }}>Book/Mockup</div>
            )}
          </div>
          
          {/* Curved divider */}
          <div style={{
            height: '30px',
            background: '#ffffff',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            marginTop: '-15px',
            position: 'relative',
            zIndex: 1
          }} />
          
          {/* Form Section */}
          <div style={{
            padding: '20px',
            background: '#ffffff',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              color: textColor, 
              margin: '0 0 10px 0', 
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '1.3'
            }}>
              {popup.headline || 'Discover How It Works'}
            </h2>
            
            {popup.subheadline && (
              <p style={{ color: textLightColor, margin: '0 0 15px 0', fontSize: '14px' }}>
                {popup.subheadline}
              </p>
            )}
            
            {popup.includeFirstName && (
              <input 
                type="text" 
                placeholder="Name" 
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            
            <input 
              type="email" 
              placeholder="your@email.com" 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            
            {popup.includePhone && (
              <input 
                type="tel" 
                placeholder="Phone Number" 
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            
            <button 
              disabled
              style={{
                width: '100%',
                padding: '14px',
                background: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            >
              {popup.buttonText || 'Send Report To My Email!'}
            </button>
            
            {popup.showTrustText && (
              <p style={{ marginTop: '15px', fontSize: '11px', color: '#9ca3af' }}>
                {popup.trustText || 'We respect your email inbox and will never spam!'}
              </p>
            )}
          </div>
        </div>
      )
    }
    
    // Desktop: Side by side with curved divider
    return (
      <div style={{
        ...containerStyles,
        maxWidth: '700px',
        display: 'flex',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '400px',
        position: 'relative'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          zIndex: 10
        }}>×</button>
        
        {/* Left: Image with light blue background */}
        <div style={{
          width: '40%',
          background: '#e8f4fc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          position: 'relative'
        }}>
          {popup.imageUrl ? (
            <img 
              src={popup.imageUrl} 
              alt="" 
              style={{ 
                maxWidth: '100%',
                maxHeight: '350px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))'
              }} 
            />
          ) : (
            <div style={{
              width: '150px',
              height: '200px',
              background: '#cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#64748b'
            }}>Book/Mockup</div>
          )}
          
          {/* Two ( curves like } extending full height */}
          <svg
            style={{
              position: 'absolute',
              right: '0',
              top: '0',
              width: '40px',
              height: '100%'
            }}
            viewBox="0 0 40 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,0 Q 30,25 0,50 Q 30,75 0,100 L 40,100 L 40,0 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        
        {/* Right: Form with white background */}
        <div style={{
          width: '60%',
          background: '#ffffff',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ 
            color: textColor, 
            margin: '0 0 12px 0', 
            fontSize: '26px',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            {popup.headline || 'Discover How It Works In Simple Terms'}
          </h2>
          
          {popup.subheadline && (
            <p style={{ color: textLightColor, margin: '0 0 20px 0', fontSize: '15px' }}>
              {popup.subheadline}
            </p>
          )}
          
          {popup.includeFirstName && (
            <input 
              type="text" 
              placeholder="Name" 
              disabled
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          )}
          
          <input 
            type="email" 
            placeholder="your@email.com" 
            disabled
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '15px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
          
          {popup.includePhone && (
            <input 
              type="tel" 
              placeholder="Phone Number" 
              disabled
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          )}
          
          <button 
            disabled
            style={{
              width: '100%',
              padding: '16px',
              background: buttonColor,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {popup.buttonText || 'Send Report To My Email!'}
          </button>
          
          {popup.showTrustText && (
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
              {popup.trustText || 'We respect your email inbox and will never spam!'}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  function renderPersonalConsultation() {
    // Avatar positioning
    const avatarPosition = popup.avatarPosition || 'bottom-left'
    const isAvatarLeft = avatarPosition.includes('left')
    const isAvatarBottom = avatarPosition.includes('bottom')
    
    // Chat-style preview for consultation
    if (isMobile) {
      return (
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Close button */}
          <button style={{
            position: 'absolute',
            top: '-10px',
            right: '0',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
            zIndex: 10
          }}>×</button>
          
          {/* Chat bubble from avatar */}
          <div style={{
            marginBottom: '10px',
            marginLeft: isAvatarLeft ? '60px' : '0',
            marginRight: isAvatarLeft ? '0' : '60px',
            padding: '12px 16px',
            background: '#f0f0f0',
            borderRadius: '18px',
            borderBottomLeftRadius: isAvatarLeft ? '4px' : '18px',
            borderBottomRightRadius: isAvatarLeft ? '18px' : '4px',
            fontSize: '14px',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {popup.chatMessage || 'Want to have a free consultation with an expert?'}
          </div>
          
          {/* Avatar */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: isAvatarLeft ? '0' : 'auto',
            right: isAvatarLeft ? 'auto' : '0',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: popup.avatarUrl ? `url(${popup.avatarUrl}) center center / cover no-repeat` : '#e5e7eb',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {!popup.avatarUrl && '👤'}
          </div>
          
          {/* Popup */}
          <div style={{
            ...containerStyles,
            marginTop: '20px',
            padding: '15px',
            width: '100%',
            maxWidth: '290px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{ 
              color: variant.primary, 
              margin: '0 0 10px 0', 
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {popup.headline || 'Book a Consultation'}
            </h2>
            
            <input 
              type="email" 
              placeholder="your@email.com" 
              disabled
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
            
            {popup.includePhone && (
              <input 
                type="tel" 
                placeholder="Phone Number" 
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            
            <button 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                background: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            >
              {popup.buttonText || 'Schedule Now'}
            </button>
          </div>
        </div>
      )
    }
    
    // Desktop version
    return (
      <div style={{ position: 'relative' }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          zIndex: 10
        }}>×</button>
        
        <div style={{
          ...containerStyles,
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Header Image */}
          {showImage && (
            <div style={{
              height: '200px',
              background: hasImage ? `url(${popup.imageUrl}) center center / cover no-repeat` : variant.secondary,
              position: 'relative'
            }}>
              {!hasImage && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  Professional Photo
                </div>
              )}
            </div>
          )}
          
          {/* Form Section */}
          <div style={{ padding: '30px' }}>
            <h2 style={{ 
              color: variant.primary, 
              margin: '0 0 10px 0', 
              fontSize: '22px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {popup.headline || 'Book a Consultation'}
            </h2>
            
            {popup.subheadline && (
              <p style={{ color: '#4b5563', margin: '0 0 20px 0', fontSize: '14px', textAlign: 'center' }}>
                {popup.subheadline}
              </p>
            )}
            
            <input 
              type="email" 
              placeholder="your@email.com" 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            
            {popup.includePhone && (
              <input 
                type="tel" 
                placeholder="Phone Number" 
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            )}
            
            <button 
              disabled
              style={{
                width: '100%',
                padding: '14px',
                background: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            >
              {popup.buttonText || 'Schedule Now'}
            </button>
            
            {popup.showTrustText && (
              <p style={{ marginTop: '15px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                {popup.trustText || 'We respect your email inbox and will never spam!'}
              </p>
            )}
          </div>
        </div>
        
        {/* Floating Avatar */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: isAvatarLeft ? '20px' : 'auto',
          right: isAvatarLeft ? 'auto' : '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: popup.avatarUrl ? `url(${popup.avatarUrl}) center center / cover no-repeat` : '#e5e7eb',
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {!popup.avatarUrl && '👤'}
        </div>
      </div>
    )
  }
  
  function renderFullBackground() {
    // Get height based on template or popup setting
    const getMinHeight = () => {
      if (template?.id === 'full-background-compact') return isMobile ? '220px' : '250px'
      if (template?.id === 'full-background-tall') return isMobile ? '400px' : '500px'
      if (template?.id === 'full-background-wide') return isMobile ? '300px' : 'auto'
      // Default based on popupHeight setting
      if (popup.popupHeight === 'compact') return isMobile ? '220px' : '250px'
      if (popup.popupHeight === 'tall') return isMobile ? '400px' : '450px'
      return isMobile ? '300px' : '350px'
    }
    
    // Get maxWidth based on template
    const getMaxWidth = () => {
      if (template?.id === 'full-background-wide') return isMobile ? '320px' : '650px'
      if (template?.id === 'full-background-compact') return isMobile ? '320px' : '450px'
      return isMobile ? '320px' : '500px'
    }
    
    // Get padding based on template
    const getPadding = () => {
      if (template?.id === 'full-background-tall') return isMobile ? '30px 15px' : '60px 40px'
      if (template?.id === 'full-background-wide') return isMobile ? '25px 15px' : '40px 60px'
      if (template?.id === 'full-background-compact') return isMobile ? '20px 15px' : '30px'
      return isMobile ? '25px 15px' : '40px'
    }
    
    if (isMobile) {
      // Mobile: Show image with overlay option
      const showOverlayMobile = popup.showOverlay !== undefined ? popup.showOverlay : false
      const overlayOpacityMobile = popup.overlayOpacity !== undefined ? popup.overlayOpacity : 50
      const overlayColorMobile = popup.overlayColor || '#000000'
      
      return (
        <div style={{
          ...containerStyles,
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: getMinHeight(),
          maxWidth: getMaxWidth()
        }}>
          {/* Close button */}
          <button style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
            zIndex: 10
          }}>×</button>
          
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: popup.imageUrl ? `url(${popup.imageUrl}) center center / cover no-repeat` : '#1f2937'
          }} />
          
          {/* Overlay Layer - only show if enabled */}
          {showOverlayMobile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: overlayColorMobile,
              opacity: overlayOpacityMobile / 100
            }} />
          )}
          
          {/* Form */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            padding: '20px 15px',
            background: 'transparent',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              color: textColor, 
              margin: '0 0 10px 0', 
              fontSize: '18px',
              fontWeight: 'bold',
              wordWrap: 'break-word',
              maxWidth: '100%'
            }}>
              {popup.headline || 'Your Headline'}
            </h2>
            
            {popup.subheadline && (
              <p style={{ color: textLightColor, margin: '0 0 15px 0', fontSize: '13px' }}>
                {popup.subheadline}
              </p>
            )}
            
            <input 
              type="email" 
              placeholder="your@email.com" 
              disabled
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            
            {popup.includePhone && (
              <input 
                type="tel" 
                placeholder="Phone Number" 
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            
            <button 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                background: buttonColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            >
              {popup.buttonText || 'Get Started'}
            </button>
            
            {popup.showTrustText && (
              <p style={{ marginTop: '15px', fontSize: '11px', color: textLightColor }}>
                {popup.trustText || 'We respect your email inbox and will never spam!'}
              </p>
            )}
          </div>
        </div>
      )
    }
    
    // Desktop: Full background with configurable overlay
    const showOverlay = popup.showOverlay !== undefined ? popup.showOverlay : false
    const overlayOpacity = popup.overlayOpacity !== undefined ? popup.overlayOpacity : 50
    const overlayColor = popup.overlayColor || '#000000'
    
    return (
      <div style={{
        ...containerStyles,
        maxWidth: getMaxWidth(),
        minHeight: getMinHeight(),
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          zIndex: 10
        }}>×</button>
        
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: hasImage ? `url(${popup.imageUrl}) center center / cover no-repeat` : '#1f2937'
        }} />
        
        {/* Overlay Layer - only show if enabled */}
        {showOverlay && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: overlayColor,
            opacity: overlayOpacity / 100
          }} />
        )}
        
        {/* Overlay Form */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: getPadding(),
          background: 'transparent',
          color: textColor
        }}>
          <h2 style={{ 
            color: textColor, 
            margin: '0 0 10px 0', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {popup.headline || 'Your Headline'}
          </h2>
          
          {popup.subheadline && (
            <p style={{ color: textLightColor, margin: '0 0 20px 0', fontSize: '15px' }}>
              {popup.subheadline}
            </p>
          )}
          
          <input 
            type="email" 
            placeholder="your@email.com" 
            disabled
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          
          {popup.includePhone && (
            <input 
              type="tel" 
              placeholder="Phone Number" 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          )}
          
          <button 
            disabled
            style={{
              width: '100%',
              padding: '14px',
              background: buttonColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              boxSizing: 'border-box'
            }}
          >
            {popup.buttonText || 'Get Started'}
          </button>
          
          {popup.showTrustText && (
            <p style={{ marginTop: '15px', fontSize: '12px', color: textLightColor }}>
              {popup.trustText || 'We respect your email inbox and will never spam!'}
            </p>
          )}
        </div>
      </div>
    )
  }
}

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}
