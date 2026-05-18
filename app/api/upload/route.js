import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getSecurityHeaders } from '@/lib/security-headers';
import { logUnauthorizedUpload } from '@/lib/security-logger';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // SECURITY FIX: Require admin authentication
    try {
      await verifyAuth(request);
    } catch (error) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      logUnauthorizedUpload(ip);
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload images.' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // SECURITY FIX: Validate file content (magic bytes), not just MIME type
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check magic bytes for actual file type
    const isValidImage = (
      // JPEG: FF D8 FF
      (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) ||
      // PNG: 89 50 4E 47
      (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) ||
      // GIF: 47 49 46
      (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) ||
      // WebP: 52 49 46 46 (RIFF)
      (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46)
    );
    
    if (!isValidImage) {
      return NextResponse.json({ 
        error: 'Invalid image file. File content does not match image format.' 
      }, { status: 400 });
    }
    
    // Also validate MIME type as secondary check
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only images allowed (jpg, png, gif, webp)' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Upload to Vercel Blob
    // Store is configured as public, so images are publicly accessible
    // Convert buffer back to Blob for upload
    const imageBlob = new Blob([buffer], { type: file.type });
    const blob = await put(file.name, imageBlob, {
      access: 'public',
      addRandomSuffix: true, // Prevents filename conflicts
    });

    console.log('✅ Image uploaded:', blob.url);
    console.log('Store access mode:', blob.url.includes('public') ? 'public' : 'private');

    return NextResponse.json(
      { 
        success: true, 
        url: blob.url 
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('❌ Upload failed:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed: ' + error.message 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// CORS headers
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
