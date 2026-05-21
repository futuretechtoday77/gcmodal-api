#!/usr/bin/env node
/**
 * Upload images to MV Popup Manager with JWT authentication
 * Requires ADMIN_PASSWORD environment variable
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'https://gcmodal-api77.vercel.app';

// Images to upload
const images = [
  // ForbiddenFood
  { file: '/root/.openclaw/media/inbound/file_36---c90f7f1c-2e10-4cf0-8041-46e537278ccc.jpg', name: 'popup-forbiddenfood-apricots.jpg' },
  { file: '/root/.openclaw/media/inbound/file_37---a8f6bca5-51b6-4369-ab3e-196141415b5f.jpg', name: 'popup-forbiddenfood-research-v1.jpg' },
  { file: '/root/.openclaw/media/inbound/file_38---e16bc9be-7159-4ca8-bb65-67cbd113851c.jpg', name: 'popup-forbiddenfood-research-v2.jpg' },
  { file: '/root/.openclaw/media/inbound/file_39---aa576a40-df1c-40eb-a975-1a3879e4eba4.jpg', name: 'popup-forbiddenfood-research-v3.jpg' },
  { file: '/root/.openclaw/media/inbound/file_40---953027c6-4bb2-4f38-afa2-54f56ff2346e.jpg', name: 'popup-forbiddenfood-research-v4.jpg' },
  { file: '/root/.openclaw/media/inbound/file_41---c17200fa-1da1-4f92-b079-ac6151c001b7.jpg', name: 'popup-forbiddenfood-research-v5.jpg' },
  // RifeLead
  { file: '/root/.openclaw/media/inbound/file_42---ddb55f55-67eb-4b10-99ea-c73080636217.jpg', name: 'popup-rifelead-scientist-bw.jpg' },
  { file: '/root/.openclaw/media/inbound/file_43---6a04a107-652f-4cd4-8c67-67c768f5192a.jpg', name: 'popup-rifelead-scientist-sepia.jpg' },
  { file: '/root/.openclaw/media/inbound/file_44---7cf6bb10-bc7a-45ad-a364-047a6c6aaec4.jpg', name: 'popup-rifelead-microscope.jpg' },
  { file: '/root/.openclaw/media/inbound/file_45---9dbe933c-5f41-4769-9217-b437469707e7.jpg', name: 'popup-rifelead-waveforms.jpg' },
  // RedLight
  { file: '/root/.openclaw/media/inbound/file_46---71c3e3bb-04c6-409b-b386-dcfb5cc46f10.jpg', name: 'popup-redlight-athlete.jpg' },
  { file: '/root/.openclaw/media/inbound/file_47---0c78b350-04a2-403e-ab76-bb5aa20bfb9f.jpg', name: 'popup-redlight-spa.jpg' },
];

async function login(password) {
  console.log('🔐 Authenticating...');
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Login failed: ${err.error || res.status}`);
  }
  
  const data = await res.json();
  console.log('✅ Authenticated\n');
  return data.token;
}

async function uploadImage(token, image) {
  try {
    if (!fs.existsSync(image.file)) {
      console.error(`❌ File not found: ${image.file}`);
      return null;
    }

    const buffer = fs.readFileSync(image.file);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', blob, image.name);
    
    console.log(`⏳ Uploading: ${image.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
    
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`✅ Uploaded: ${image.name}`);
    console.log(`   URL: ${data.url}\n`);
    return data.url;
    
  } catch (error) {
    console.error(`❌ Failed: ${image.name} - ${error.message}\n`);
    return null;
  }
}

async function main() {
  const password = process.env.ADMIN_PASSWORD;
  
  if (!password) {
    console.error('❌ ADMIN_PASSWORD environment variable not set');
    console.error('Usage: ADMIN_PASSWORD=yourpassword node upload-with-auth.js');
    process.exit(1);
  }
  
  console.log('🚀 Starting image uploads...\n');
  
  let token;
  try {
    token = await login(password);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
  
  const results = [];
  for (const image of images) {
    const url = await uploadImage(token, image);
    if (url) results.push({ name: image.name, url });
  }
  
  console.log(`\n✨ Complete! Uploaded ${results.length}/${images.length} images`);
  
  if (results.length === images.length) {
    console.log('\n🎉 All images uploaded successfully!');
    console.log('Popups are now fully functional with images.');
  } else {
    console.log('\n⚠️ Some uploads failed. Check errors above.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
