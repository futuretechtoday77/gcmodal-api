#!/bin/bash
# Add environment variables to Vercel via CLI

cd ~/.openclaw/workspace/gcmodal-api

echo "🔐 Adding environment variables to Vercel..."
echo ""

# JWT Secret
echo "Adding JWT_SECRET..."
echo 'AXxKFHXiHAlYnahVbj+zv9xSyug1pSl/COsIbtNXfOE=' | vercel env add JWT_SECRET production

# Upstash URL
echo "Adding UPSTASH_REDIS_REST_URL..."
echo 'https://learning-firefly-128770.upstash.io' | vercel env add UPSTASH_REDIS_REST_URL production

# Upstash Token
echo "Adding UPSTASH_REDIS_REST_TOKEN..."
echo 'gQAAAAAAAfcCAAIgcDJhOTQxYzM5NWExZDk0MmZlODcxMTMzMTdlNGIzOTUxMw' | vercel env add UPSTASH_REDIS_REST_TOKEN production

echo ""
echo "✅ Environment variables added!"
echo ""
echo "📦 Deploying to production..."
vercel --prod

echo ""
echo "🎉 Deployment complete! Security fixes are now live."
