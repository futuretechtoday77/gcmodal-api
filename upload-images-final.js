const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Get token from environment
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_xxH72g0cOw7gBbIq_uh43u0l1MgKI3sLbEhWXJoJz2EeNy4';

// Image mapping: filename -> source file path
const images = [
  // ForbiddenFood images (from first batch)
  { 
    file: '/root/.openclaw/media/inbound/file_36---c90f7f1c-2e10-4cf0-8041-46e537278ccc.jpg', 
    name: 'popup-forbiddenfood-apricots.jpg',
    popup: 'forbiddenfood-apricots'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_37---a8f6bca5-51b6-4369-ab3e-196141415b5f.jpg', 
    name: 'popup-forbiddenfood-research-v1.jpg',
    popup: 'forbiddenfood-research-v1'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_38---e16bc9be-7159-4ca8-bb65-67cbd113851c.jpg', 
    name: 'popup-forbiddenfood-research-v2.jpg',
    popup: 'forbiddenfood-research-v2'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_39---aa576a40-df1c-40eb-a975-1a3879e4eba4.jpg', 
    name: 'popup-forbiddenfood-research-v3.jpg',
    popup: 'forbiddenfood-research-v3'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_40---953027c6-4bb2-4f38-afa2-54f56ff2346e.jpg', 
    name: 'popup-forbiddenfood-research-v4.jpg',
    popup: 'forbiddenfood-research-v4'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_41---c17200fa-1da1-4f92-b079-ac6151c001b7.jpg', 
    name: 'popup-forbiddenfood-research-v5.jpg',
    popup: 'forbiddenfood-research-v5'
  },
  // RifeLead images (from second batch)
  { 
    file: '/root/.openclaw/media/inbound/file_42---ddb55f55-67eb-4b10-99ea-c73080636217.jpg', 
    name: 'popup-rifelead-scientist-bw.jpg',
    popup: 'rifelead-scientist-bw'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_43---6a04a107-652f-4cd4-8c67-67c768f5192a.jpg', 
    name: 'popup-rifelead-scientist-sepia.jpg',
    popup: 'rifelead-scientist-sepia'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_44---7cf6bb10-bc7a-45ad-a364-047a6c6aaec4.jpg', 
    name: 'popup-rifelead-microscope.jpg',
    popup: 'rifelead-microscope'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_45---9dbe933c-5f41-4769-9217-b437469707e7.jpg', 
    name: 'popup-rifelead-waveforms.jpg',
    popup: 'rifelead-waveforms'
  },
  // RedLightResearch images (from second batch)
  { 
    file: '/root/.openclaw/media/inbound/file_46---71c3e3bb-04c6-409b-b386-dcfb5cc46f10.jpg', 
    name: 'popup-redlight-athlete.jpg',
    popup: 'redlight-athlete'
  },
  { 
    file: '/root/.openclaw/media/inbound/file_47---0c78b350-04a2-403e-ab76-bb5aa20bfb9f.jpg', 
    name: 'popup-redlight-spa.jpg',
    popup: 'redlight-spa'
  },
];

async function uploadImage(image) {
  try {
    // Check if file exists
    if (!fs.existsSync(image.file)) {
      console.error(`❌ File not found: ${image.file}`);
      return null;
    }

    const buffer = fs.readFileSync(image.file);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    console.log(`⏳ Uploading: ${image.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
    
    const result = await put(image.name, blob, {
      access: 'public',
      token: BLOB_TOKEN,
      addRandomSuffix: false,
    });
    
    console.log(`✅ Uploaded: ${image.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Popup: ${image.popup}`);
    
    return {
      popupId: image.popup,
      url: result.url,
      name: image.name
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${image.name}:`, error.message);
    if (error.message.includes('store')) {
      console.error('   Blob store issue - token may be invalid or store not configured');
    }
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image uploads to Vercel Blob...\n');
  console.log('Token prefix:', BLOB_TOKEN.substring(0, 30) + '...\n');
  
  const results = [];
  
  for (const image of images) {
    const result = await uploadImage(image);
    if (result) {
      results.push(result);
    }
    console.log('');
  }
  
  console.log('\n✨ Upload complete!');
  console.log(`\nSuccessfully uploaded: ${results.length}/${images.length} images\n`);
  
  if (results.length > 0) {
    console.log('Image URLs for popups:\n');
    results.forEach(r => {
      console.log(`${r.popupId}:`);
      console.log(`  ${r.url}\n`);
    });
  }
}

main().catch(console.error);
