/**
 * GC Modal - Popup Manager
 * Version: 2.8.5-beta.5
 * Supports: All Templates, Split Testing, Phone Field
 */

(function(global) {
  'use strict';

  const GCModal = {
    version: '2.8.5-beta',
    config: {
      apiUrl: 'https://gcmodal-api.vercel.app',
      cookieExpiry: 7  // 1 week - allows seeing different popups across the network
    },
    currentPopup: null,

    init: function(options) {
      this.config = { ...this.config, ...options };
      
      // ALWAYS set up button click listeners (for data attributes)
      this.attachEventListeners();
      
      // Support direct init with popupId and trigger (admin-generated code)
      if (options.popupId && options.trigger) {
        this.setupDirectTrigger(options);
      }
      
      console.log('GC Modal v2.8.5-beta initialized');
    },

    setupDirectTrigger: function(options) {
      const popupId = options.popupId;
      const trigger = options.trigger;
      const self = this;
      
      if (trigger === 'exit') {
        document.addEventListener('mouseout', function exitHandler(e) {
          if (e.clientY < 10) {
            console.log('Exit intent detected for:', popupId);
            self.showPopup(popupId, false);
            // Remove listener after triggering once
            document.removeEventListener('mouseout', exitHandler);
          }
        });
        console.log('Exit intent trigger set up for:', popupId);
      } else if (trigger === 'delay') {
        const delay = options.triggerDelay || 180000; // Default 3 minutes in ms
        console.log('Delay trigger set up for:', popupId, 'delay:', delay, 'ms');
        setTimeout(() => {
          console.log('Delay triggered for:', popupId);
          self.showPopup(popupId, false);
        }, delay);
      } else if (trigger === 'button') {
        // Button trigger with direct config - show immediately
        this.showPopup(popupId, true);
      }
    },

    attachEventListeners: function() {
      // Button clicks via data attributes
      document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-popup-id]');
        if (button) {
          const popupId = button.getAttribute('data-popup-id');
          const trigger = button.getAttribute('data-trigger') || 'button';
          if (trigger === 'button') {
            // Button popups ALWAYS show - no cookie check
            this.showPopup(popupId, true);
          }
        }
      });

      // Split test button clicks (buttons with IDs starting with 'split-')
      document.addEventListener('click', (e) => {
        const button = e.target.closest('button[id^="split-"]');
        if (button && button.id) {
          // The button ID is the split test ID - show it directly
          this.showPopup(button.id, true);
        }
      });

      // Exit intent via data attributes
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10) {
          const exitButtons = document.querySelectorAll('[data-popup-id][data-trigger="exit"]');
          exitButtons.forEach(btn => {
            const popupId = btn.getAttribute('data-popup-id');
            this.showPopup(popupId, false);
          });
        }
      });

      // Delay via data attributes
      window.addEventListener('load', () => {
        const delayButtons = document.querySelectorAll('[data-popup-id][data-trigger="delay"]');
        delayButtons.forEach(btn => {
          const popupId = btn.getAttribute('data-popup-id');
          const delay = parseInt(btn.getAttribute('data-delay')) || 180;
          setTimeout(() => {
            this.showPopup(popupId, false);
          }, delay * 1000);
        });
      });
    },

    showPopup: async function(popupId, skipCookieCheck = false) {
      try {
        // Prevent showing multiple popups at once
        if (this.currentPopup) {
          console.log('Popup already open, closing first');
          this.closePopup();
        }

        // Only check cookie for exit intent and delay triggers, NOT button clicks
        if (!skipCookieCheck && this.hasSeenPopup(popupId)) {
          console.log('Popup already shown:', popupId);
          return;
        }

        console.log('Fetching popup:', popupId);
        const response = await fetch(`${this.config.apiUrl}/api/popups?id=${encodeURIComponent(popupId)}`);
        const data = await response.json();
        console.log('API response:', data);

        if (!data.success) {
          console.error('Failed to load popup:', data.error);
          return;
        }

        // Handle both single popup (popup) and all popups (popups) responses
        const popup = data.popup || data.popups?.[popupId];
        if (!popup) {
          console.error('Popup not found in response:', popupId, 'data:', data);
          return;
        }
        
        console.log('Showing popup:', popup.name || popupId);
        this.currentPopup = popup;
        this.renderPopup(popup);
        this.setPopupSeen(popupId);
      } catch (err) {
        console.error('Error showing popup:', err);
      }
    },

    renderPopup: function(popup) {
      const template = popup.template || 'clean-gradient';
      const design = popup.design || {};
      const fields = popup.fields || ['email'];
      
      // Remove existing popup
      this.closePopup();

      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'gc-modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      `;

      // Render based on template
      let contentHTML = '';
      
      switch(template) {
        case 'split-lead-magnet':
          contentHTML = this.renderSplitLeadMagnet(popup, design, fields);
          break;
        case 'clean-gradient':
          contentHTML = this.renderCleanGradient(popup, design, fields);
          break;
        case 'ultra-minimal':
          contentHTML = this.renderUltraMinimal(popup, design, fields);
          break;
        case 'split-screen':
          contentHTML = this.renderSplitScreen(popup, design, fields);
          break;
        case 'lead-magnet':
          contentHTML = this.renderLeadMagnet(popup, design, fields);
          break;
        case 'personal-consultation':
          contentHTML = this.renderPersonalConsultation(popup, design, fields);
          break;
        case 'full-background':
        case 'full-background-tall':
        case 'full-background-wide':
        case 'full-background-compact':
          contentHTML = this.renderFullBackground(popup, design, fields);
          break;
        default:
          contentHTML = this.renderCleanGradient(popup, design, fields);
      }

      overlay.innerHTML = contentHTML;
      document.body.appendChild(overlay);

      // Handle form submission
      const form = document.getElementById('gc-modal-form');
      if (form) {
        form.onsubmit = (e) => this.handleSubmit(e);
      }

      // Close handlers
      overlay.onclick = (e) => {
        if (e.target === overlay) this.closePopup();
      };

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closePopup();
      });

      const closeBtn = document.getElementById('gc-modal-close');
      if (closeBtn) {
        closeBtn.onclick = () => this.closePopup();
      }
    },

    renderSplitLeadMagnet: function(popup, design, fields) {
      const isMobile = window.innerWidth <= 768;
      const buttonColor = popup.buttonColor || '#3b82f6';
      
      if (isMobile) {
        return `
          <div style="background: #e8f4fc; border-radius: 16px; max-width: 320px; width: 100%; position: relative; overflow: hidden;">
            <button id="gc-modal-close" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; cursor: pointer; color: #6b7280; z-index: 10;">×</button>
            <div style="padding: 20px; text-align: center;">
              ${design.image?.url ? `<img src="${design.image.url}" alt="" style="max-width: 100%; max-height: 150px; object-fit: contain; margin-bottom: 15px;">` : ''}
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">${design.headline || 'Discover How It Works'}</h2>
              ${design.subheadline ? `<p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">${design.subheadline}</p>` : ''}
              <form id="gc-modal-form">
                ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box;">` : ''}
                <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
                ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box;">` : ''}
                <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Send Report To My Email!'}</button>
              </form>
            </div>
          </div>
        `;
      }
      
      return `
        <div style="background: white; border-radius: 16px; max-width: 700px; width: 100%; display: flex; position: relative; overflow: hidden;">
          <button id="gc-modal-close" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; cursor: pointer; color: #6b7280; z-index: 10;">×</button>
          <div style="width: 40%; background: #e8f4fc; display: flex; align-items: center; justify-content: center; padding: 30px;">
            ${design.image?.url ? `<img src="${design.image.url}" alt="" style="max-width: 100%; max-height: 300px; object-fit: contain;">` : '<div style="color: #64748b;">Image</div>'}
          </div>
          <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
            <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 26px; font-weight: bold;">${design.headline || 'Discover How It Works In Simple Terms'}</h2>
            ${design.subheadline ? `<p style="color: #4b5563; margin: 0 0 20px 0; font-size: 15px;">${design.subheadline}</p>` : ''}
            <form id="gc-modal-form">
              ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 14px; margin-bottom: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; box-sizing: border-box;">` : ''}
              <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 14px; margin-bottom: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; box-sizing: border-box;">
              ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 14px; margin-bottom: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; box-sizing: border-box;">` : ''}
              <button type="submit" style="width: 100%; padding: 16px; background: ${buttonColor}; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Send Report To My Email!'}</button>
            </form>
          </div>
        </div>
      `;
    },

    renderCleanGradient: function(popup, design, fields) {
      const variant = design.variant || 'purple';
      const colorMap = {
        purple: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: 'white' },
        blue: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: 'white' },
        green: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: 'white' },
        orange: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: 'white' },
        dark: { bg: '#1f2937', text: 'white' }
      };
      const colors = colorMap[variant] || colorMap.purple;
      const buttonColor = popup.buttonColor || '#3b82f6';

      return `
        <div style="background: ${colors.bg}; color: ${colors.text}; border-radius: 12px; max-width: 500px; width: 100%; position: relative; overflow: hidden;">
          <button id="gc-modal-close" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; cursor: pointer; color: ${colors.text}; z-index: 10;">×</button>
          <div style="padding: 40px;">
            ${design.image?.url ? `<img src="${design.image.url}" alt="" style="width: 100%; max-height: 180px; object-fit: contain; margin-bottom: 20px;">` : ''}
            <h2 style="margin: 0 0 10px 0; font-size: 26px; font-weight: bold;">${design.headline || 'Your Headline'}</h2>
            ${design.subheadline ? `<p style="margin: 0 0 15px 0; font-size: 16px; opacity: 0.9;">${design.subheadline}</p>` : ''}
            ${design.bodyCopy ? `<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; opacity: 0.8;">${design.bodyCopy}</p>` : ''}
            <form id="gc-modal-form">
              ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <input type="email" name="email" placeholder="Email Address" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Submit'}</button>
            </form>
          </div>
        </div>
      `;
    },

    renderUltraMinimal: function(popup, design, fields) {
      const buttonColor = popup.buttonColor || '#3b82f6';

      return `
        <div style="background: white; border-radius: 8px; max-width: 400px; width: 100%; position: relative; padding: 30px; text-align: center;">
          <button id="gc-modal-close" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.05); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; cursor: pointer; color: #9ca3af;">×</button>
          <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">${design.headline || 'Your Headline'}</h2>
          ${design.subheadline ? `<p style="color: #6b7280; margin: 0 0 15px 0; font-size: 13px;">${design.subheadline}</p>` : ''}
          <form id="gc-modal-form">
            ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
            <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
            <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Download'}</button>
          </form>
        </div>
      `;
    },

    renderSplitScreen: function(popup, design, fields) {
      const buttonColor = popup.buttonColor || '#3b82f6';

      return `
        <div style="background: white; border-radius: 12px; max-width: 700px; width: 100%; display: flex; position: relative; overflow: hidden;">
          <button id="gc-modal-close" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.1); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; cursor: pointer; color: #666; z-index: 10;">×</button>
          <div style="width: 50%; background: #f8f9fa; display: flex; align-items: center; justify-content: center; min-height: 400px;">
            ${design.image?.url ? `<img src="${design.image.url}" alt="" style="width: 100%; height: 100%; object-fit: contain;">` : '<span style="color: #999;">Image</span>'}
          </div>
          <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">${design.headline || 'Your Headline'}</h2>
            ${design.subheadline ? `<p style="color: #4b5563; margin: 0 0 15px 0; font-size: 15px;">${design.subheadline}</p>` : ''}
            <form id="gc-modal-form" style="margin-top: 20px;">
              ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <input type="email" name="email" placeholder="Email" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone" style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Submit'}</button>
            </form>
          </div>
        </div>
      `;
    },

    renderLeadMagnet: function(popup, design, fields) {
      const buttonColor = popup.buttonColor || '#3b82f6';

      return `
        <div style="background: white; border-radius: 8px; max-width: 400px; width: 100%; position: relative; padding: 20px; text-align: center;">
          <button id="gc-modal-close" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.05); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; cursor: pointer; color: #666;">×</button>
          ${design.image?.url ? `<img src="${design.image.url}" alt="" style="max-width: 150px; max-height: 200px; object-fit: contain; margin-bottom: 15px;">` : ''}
          <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">${design.headline || 'Free Guide'}</h2>
          ${design.subheadline ? `<p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">${design.subheadline}</p>` : ''}
          <form id="gc-modal-form">
            ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
            <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
            <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Download Now'}</button>
          </form>
        </div>
      `;
    },

    renderPersonalConsultation: function(popup, design, fields) {
      const buttonColor = popup.buttonColor || '#3b82f6';
      const avatarUrl = popup.avatarUrl || '';

      return `
        <div style="background: white; border-radius: 12px; max-width: 500px; width: 100%; position: relative; overflow: hidden;">
          <button id="gc-modal-close" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; cursor: pointer; color: #6b7280; z-index: 10;">×</button>
          ${design.image?.url ? `<div style="height: 200px; background: url(${design.image.url}) center center / cover no-repeat;"></div>` : ''}
          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 22px; font-weight: bold;">${design.headline || 'Book a Consultation'}</h2>
            ${design.subheadline ? `<p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px;">${design.subheadline}</p>` : ''}
            <form id="gc-modal-form">
              ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Schedule Now'}</button>
            </form>
          </div>
          ${avatarUrl ? `<div style="position: absolute; bottom: -20px; left: 20px; width: 60px; height: 60px; border-radius: 50%; background: url(${avatarUrl}) center center / cover no-repeat; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>` : ''}
        </div>
      `;
    },

    renderFullBackground: function(popup, design, fields) {
      const buttonColor = popup.buttonColor || '#3b82f6';
      const showOverlay = popup.showOverlay || false;
      const overlayColor = popup.overlayColor || '#000000';
      const overlayOpacity = (popup.overlayOpacity || 50) / 100;

      return `
        <div style="background: ${design.image?.url ? `url(${design.image.url}) center center / cover no-repeat` : '#1f2937'}; border-radius: 12px; max-width: 500px; width: 100%; position: relative; overflow: hidden; min-height: 350px;">
          <button id="gc-modal-close" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; cursor: pointer; color: #6b7280; z-index: 10;">×</button>
          ${showOverlay ? `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${overlayColor}; opacity: ${overlayOpacity};"></div>` : ''}
          <div style="position: relative; z-index: 1; padding: 40px; text-align: center; color: white;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">${design.headline || 'Your Headline'}</h2>
            ${design.subheadline ? `<p style="margin: 0 0 20px 0; font-size: 15px; opacity: 0.9;">${design.subheadline}</p>` : ''}
            <form id="gc-modal-form" style="max-width: 400px; margin: 0 auto;">
              ${fields.includes('firstName') ? `<input type="text" name="firstName" placeholder="Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              ${fields.includes('phone') ? `<input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 6px; font-size: 14px; box-sizing: border-box;">` : ''}
              <button type="submit" style="width: 100%; padding: 14px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">${design.buttonText || 'Get Started'}</button>
            </form>
          </div>
        </div>
      `;
    },

    handleSubmit: async function(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${this.config.apiUrl}/api/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            popupId: this.currentPopup.id,
            tagId: this.currentPopup.tagId,
            ...data
          })
        });

        const result = await response.json();

        if (result.success) {
          this.closePopup();
          alert('Thank you! Your submission has been received.');
        } else {
          alert('Error: ' + (result.error || 'Something went wrong'));
        }
      } catch (err) {
        console.error('Submit error:', err);
        alert('Error submitting form. Please try again.');
      }
    },

    closePopup: function() {
      const overlay = document.getElementById('gc-modal-overlay');
      if (overlay) {
        overlay.remove();
      }
      this.currentPopup = null;
    },

    hasSeenPopup: function(popupId) {
      const seen = document.cookie.match(new RegExp('(^| )gc_popup_' + popupId + '=([^;]+)'));
      return !!seen;
    },

    setPopupSeen: function(popupId) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + this.config.cookieExpiry);
      document.cookie = `gc_popup_${popupId}=1; expires=${expiry.toUTCString()}; path=/`;
    },

    // Backward compatibility alias
    initUniversal: function(options) {
      return this.init(options);
    }
  };

  // Export for global access
  global.GCModal = GCModal;

})(window);
