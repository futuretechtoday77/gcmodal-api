#!/bin/bash
# Upload all popup images via the admin API

# First, let's check if we can access the admin endpoint
API_URL="https://gcmodal-api77.vercel.app"

echo "Checking API availability..."
curl -s "$API_URL/api/admin/popups" | head -100
