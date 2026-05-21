/**
 * GC Modal - Popup Manager
 * Version: 2.5.0
 * Supports: Regular popups and Split Testing (A/B Testing)
 */

(function(global) {
  'use strict';

  const GCModal = {
    version: '2.5.0',
    config: {
      apiUrl: 'https://gcmodal-api77.vercel.app',
      cookieExpiry: 30 // days
    },
    currentPopup: null,
    currentSplitTest: null,

    /**
     * Initialize Universal Mode (handles both popups and split tests)
     */
    initUniversal: function(options) {
      this.config = { ...this.config, ...options };
      this.attachEventListeners();
      console.log('✅ GC Modal v2.5.0 initialized (with Split Testing support)');
    },

    /**
     * Attach event listeners for buttons, exit intent, etc.
     */
    attachEventListeners: function() {
      // Button triggers (data-popup-id attribute)
      document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-popup-id]');
        if (button) {
          const popupId = button.getAttribute('data-popup-id');
          this.showPopup(popupId);
        }
      });

      // Button triggers (ID attribute - for split tests)
      // Buttons with IDs starting with "split-" are treated as split test triggers
      document.addEventListener('click', (e) => {
        const button = e.target.closest('button[id^="split-"]');
        if (button && button.id) {
          // The button ID is the split test ID - show it directly
          this.showPopup(button.id);
        }
      });

      // Exit intent trigger
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10) {
          const exitButtons = document.querySelectorAll('[data-popup-id][data-trigger="exit"]');
          exitButtons.forEach(btn => {
            const popupId = btn.getAttribute('data-popup-id');
            if (!this.hasSeenPopup(popupId)) {
              this.showPopup(popupId);
            }
          });
        }
      });

      // Delay triggers (check on load)
      window.addEventListener('load', () => {
        const delayButtons = document.querySelectorAll('[data-popup-id][data-trigger="delay"]');
        delayButtons.forEach(btn => {
          const popupId = btn.getAttribute('data-popup-id');
          const delay = parseInt(btn.getAttribute('data-delay')) || 180;
          
          if (!this.hasSeenPopup(popupId)) {
            setTimeout(() => {
              this.showPopup(popupId);
            }, delay * 1000);
          }
        });
      });
    },

    /**
     * Show popup by ID (handles both regular popups and split tests)
     */
    showPopup: async function(popupId) {
      try {
        // Check if recently shown (30-day cookie)
        if (this.hasSeenPopup(popupId)) {
          console.log('Popup already shown recently:', popupId);
          return;
        }

        // Fetch popup config (use query param to support split tests)
        const response = await fetch(`${this.config.apiUrl}/api/popups?id=${encodeURIComponent(popupId)}`);
        const data = await response.json();

        if (!data.success) {
          console.error('Failed to load popup:', data.error);
          return;
        }

        const popup = data.popup;

        // Check if this is a split test
        if (data._splitTest) {
          this.currentSplitTest = {
            testId: data._splitTest.testId,
            variant: data._splitTest.variant,
            isCompleted: data._splitTest.isCompleted
          };
        } else {
          this.currentSplitTest = null;
        }

        // Store current popup
        this.currentPopup = popup;

        // Render the popup
        this.renderPopup(popup);

        // Mark as shown
        this.markPopupShown(popupId);

      } catch (error) {
        console.error('Error showing popup:', error);
      }
    },

    /**
     * Render popup HTML
     */
    renderPopup: function(popup) {
      const design = popup.design;
      const hasImage = design.image && design.image.url && design.image.position !== 'none';
      const isSideBySide = design.layout === 'side-by-side';
      
      // Color schemes
      const colors = {
        purple: { bg: '#7c3aed', hover: '#6d28d9' },
        blue: { bg: '#3b82f6', hover: '#2563eb' },
        green: { bg: '#10b981', hover: '#059669' },
        red: { bg: '#ef4444', hover: '#dc2626' },
        orange: { bg: '#f97316', hover: '#ea580c' }
      };
      const color = colors[design.variant] || colors.purple;

      // Create popup container
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

      const container = document.createElement('div');
      container.style.cssText = `
        max-width: ${isSideBySide ? '700px' : '500px'};
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
        position: relative;
      `;

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(0,0,0,0.1);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
        color: #666;
        z-index: 10;
      `;
      closeBtn.onclick = () => this.closePopup();
      container.appendChild(closeBtn);

      // Build content based on layout
      let contentHTML = '';
      
      if (isSideBySide && hasImage && design.image.position === 'left-side') {
        contentHTML = `
          <div style="display: flex;">
            <div style="width: 280px; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
              <img src="${design.image.url}" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="flex: 1; padding: 40px;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #1a202c;">${design.headline}</h2>
              ${design.subheadline ? `<p style="font-size: 16px; color: #4a5568; margin-bottom: 15px;">${design.subheadline}</p>` : ''}
              ${design.bodyCopy ? `<p style="font-size: 14px; color: #718096; margin-bottom: 20px; line-height: 1.6;">${design.bodyCopy}</p>` : ''}
              <form id="gc-modal-form" style="margin-top: 20px;">
                ${popup.fields.includes('firstName') ? `
                  <input type="text" name="firstName" placeholder="First Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                ` : ''}
                <input type="email" name="email" placeholder="Email Address" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                <button type="submit" style="width: 100%; padding: 14px; background: ${color.bg}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">${design.buttonText}</button>
              </form>
            </div>
          </div>
        `;
      } else {
        // Centered layout
        contentHTML = `
          <div style="padding: 40px; text-align: center;">
            ${hasImage && design.image.position === 'full-width' ? `<img src="${design.image.url}" alt="" style="width: 100%; max-height: 200px; object-fit: cover; margin-bottom: 20px;">` : ''}
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #1a202c;">${design.headline}</h2>
            ${design.subheadline ? `<p style="font-size: 16px; color: #4a5568; margin-bottom: 15px;">${design.subheadline}</p>` : ''}
            ${design.bodyCopy ? `<p style="font-size: 14px; color: #718096; margin-bottom: 20px; line-height: 1.6;">${design.bodyCopy}</p>` : ''}
            <form id="gc-modal-form" style="margin-top: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">
              ${popup.fields.includes('firstName') ? `
                <input type="text" name="firstName" placeholder="First Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              ` : ''}
              <input type="email" name="email" placeholder="Email Address" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
              <button type="submit" style="width: 100%; padding: 14px; background: ${color.bg}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">${design.buttonText}</button>
            </form>
          </div>
        `;
      }

      container.innerHTML += contentHTML;
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Handle form submission
      const form = document.getElementById('gc-modal-form');
      form.onsubmit = (e) => this.handleSubmit(e);

      // Close on overlay click
      overlay.onclick = (e) => {
        if (e.target === overlay) this.closePopup();
      };

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closePopup();
      });
    },

    /**
     * Handle form submission
     */
    handleSubmit: async function(e) {
      e.preventDefault();
      
      const form = e.target;
      const formData = new FormData(form);
      const data = {
        email: formData.get('email'),
        firstName: formData.get('firstName') || ''
      };

      try {
        // Submit to CRM
        const response = await fetch(`${this.config.apiUrl}/api/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            popupId: this.currentPopup.id || 'unknown'
          })
        });

        const result = await response.json();

        if (result.success) {
          // If split test, record conversion
          if (this.currentSplitTest && !this.currentSplitTest.isCompleted) {
            await this.recordConversion(data.email);
          }

          this.showThankYou();
        } else {
          alert('Submission failed: ' + result.error);
        }
      } catch (error) {
        console.error('Submit error:', error);
        alert('Submission failed. Please try again.');
      }
    },

    /**
     * Record conversion for split test
     */
    recordConversion: async function(email) {
      try {
        await fetch(`${this.config.apiUrl}/api/split-tests/${this.currentSplitTest.testId}/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            variant: this.currentSplitTest.variant
          })
        });
      } catch (error) {
        console.error('Conversion tracking error:', error);
      }
    },

    /**
     * Show thank you message
     */
    showThankYou: function() {
      const container = document.querySelector('#gc-modal-overlay > div');
      if (container) {
        container.innerHTML = `
          <div style="padding: 60px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">✓</div>
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Thank You!</h2>
            <p style="font-size: 16px; color: #666;">Check your email for next steps.</p>
          </div>
        `;
        
        setTimeout(() => {
          this.closePopup();
        }, 3000);
      }
    },

    /**
     * Close popup
     */
    closePopup: function() {
      const overlay = document.getElementById('gc-modal-overlay');
      if (overlay) {
        overlay.remove();
      }
      this.currentPopup = null;
      this.currentSplitTest = null;
    },

    /**
     * Check if popup was shown recently
     */
    hasSeenPopup: function(popupId) {
      const cookie = document.cookie.match(new RegExp(`(^| )gc_modal_${popupId}=([^;]+)`));
      if (cookie) {
        const expiry = new Date(cookie[2]);
        if (expiry > new Date()) {
          return true;
        }
      }
      return false;
    },

    /**
     * Mark popup as shown
     */
    markPopupShown: function(popupId) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + this.config.cookieExpiry);
      document.cookie = `gc_modal_${popupId}=${expiry.toISOString()}; expires=${expiry.toUTCString()}; path=/`;
    }
  };

  // Expose to global scope
  global.GCModal = GCModal;

})(window);
