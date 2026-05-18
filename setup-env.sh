#!/bin/bash
# Add security environment variables to Vercel

cd ~/.openclaw/workspace/gcmodal-api

echo "Setting up environment variables for gcmodal-api..."
echo ""
echo "⚠️  You'll need to paste values when prompted"
echo ""

# JWT Secret (already generated)
echo "Adding JWT_SECRET..."
echo "AXxKFHXiHAlYnahVbj+zv9xSyug1pSl/COsIbtNXfOE=" | vercel env add JWT_SECRET production

echo ""
echo "Adding UPSTASH_REDIS_REST_URL..."
echo "Paste your Upstash URL (from https://console.upstash.com):"
vercel env add UPSTASH_REDIS_REST_URL production

echo ""
echo "Adding UPSTASH_REDIS_REST_TOKEN..."
echo "Paste your Upstash Token:"
vercel env add UPSTASH_REDIS_REST_TOKEN production

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Now deploying with security fixes..."
vercel --prod
