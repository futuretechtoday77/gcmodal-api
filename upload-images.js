const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment');
  process.exit(1);
}

const images = [
  // ForbiddenFood images
  { file: '/root/.openclaw/media/inbound/file_36---c90f7f1c-2e10-4cf0-8041-46e537278ccc.jpg', name: 'popup-forbiddenfood-apricots.jpg' },
  { file: '/root/.openclaw/media/inbound/file_37---a8f6bca5-51b6-4369-ab3e-196141415b5f.jpg', name: 'popup-forbiddenfood-research-v1.jpg' },
  { file: '/root/.openclaw/media/inbound/file_38---e16bc9be-7159-4ca8-bb65-67cbd113851c.jpg', name: 'popup-forbiddenfood-research-v2.jpg' },
  { file: '/root/.openclaw/media/inbound/file_39---aa576a40-df1c-40eb-a975-1a3879e4eba4.jpg', name: 'popup-forbiddenfood-research-v3.jpg' },
  { file: '/root/.openclaw/media/inbound/file_40---953027c6-4bb2-4f38-afa2-54f56ff2346e.jpg', name: 'popup-forbiddenfood-research-v4.jpg' },
  { file: '/root/.openclaw/media/inbound/file_41---c17200fa-1da1-4f92-b079-ac6151c001b7.jpg', name: 'popup-forbiddenfood-research-v5.jpg' },
  // RifeLead images
  { file: '/root/.openclaw/media/inbound/file_42---ddb55f55-67eb-4b10-99ea-c73080636217.jpg', name: 'popup-rifelead-scientist-bw.jpg' },
  { file: '/root/.openclaw/media/inbound/file_43---6a04a107-652f-4cd4-8c67-67c768f5192a.jpg', name: 'popup-rifelead-scientist-sepia.jpg' },
  { file: '/root/.openclaw/media/inbound/file_44---7cf6bb10-bc7a-45ad-a364-047a6c6aaec4.jpg', name: 'popup-rifelead-microscope.jpg' },
  { file: '/root/.openclaw/media/inbound/file_45---9dbe933c-5f41-4769-9217-b437469707e7.jpg', name: 'popup-rifelead-waveforms.jpg' },
  // RedLightResearch images
  { file: '/root/.openclaw/media/inbound/file_46---71c3e3bb-04c6-409b-b386-dcfb5cc46f10.jpg', name: 'popup-redlight-athlete.jpg' },
  { file: '/root/.openclaw/media/inbound/file_47---0c78b350-04a2-403e-ab76-bb5aa20bfb9f.jpg', name: 'popup-redlight-spa.jpg' },
];

async function uploadImage(image) {
  try {
    const buffer = fs.readFileSync(image.file);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const result = await put(image.name, blob, {
      access: 'public',
      token: BLOB_TOKEN,
      addRandomSuffix: false,
    });
    
    console.log(`✅ Uploaded: ${image.name}`);
    console.log(`   URL: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ Failed to upload ${image.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image uploads to Vercel Blob...\n');
  
  for (const image of images) {
    await uploadImage(image);
    console.log('');
  }
  
  console.log('\n✨ Upload complete!');
}

main().catch(console.error);
