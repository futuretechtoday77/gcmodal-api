#!/bin/bash
# Simple deployment script for gcmodal-api

echo "🚀 Deploying gcmodal-api with security fixes..."
echo ""

cd ~/.openclaw/workspace/gcmodal-api

# Check if logged in
if ! vercel whoami &>/dev/null; then
    echo "⚠️  You need to login to Vercel first"
    echo "Run: vercel login"
    echo ""
    echo "Then run this script again: ./DEPLOY.sh"
    exit 1
fi

echo "📦 Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Visit: https://gcmodal-api.vercel.app/admin"
