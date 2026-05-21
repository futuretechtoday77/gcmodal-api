#!/bin/bash
# Eugene Liberty Article Submission Script
# Created: 2026-05-20
# Publication ID: 68c89f073edbc53f1bfd4d31

set -e

# TODO: Set these variables with actual Letterman API details
LETTERMAN_API_BASE="https://api.letterman.example.com"  # REPLACE WITH ACTUAL URL
LETTERMAN_API_KEY="your-api-key-here"                   # REPLACE WITH ACTUAL KEY
PUBLICATION_ID="68c89f073edbc53f1bfd4d31"

ARTICLE_DIR="/root/.openclaw/workspace/eugene-liberty-drafts-2026-05-20"

echo "========================================="
echo "Eugene Liberty Article Submission"
echo "Date: $(date -u +"%Y-%m-%d %H:%M UTC")"
echo "========================================="
echo ""

# Counter for successfully created articles
SUCCESS_COUNT=0
declare -a ARTICLE_IDS
declare -a ARTICLE_TITLES

# Function to download and track Unsplash image
download_unsplash_image() {
  local download_url="$1"
  local attribution="$2"
  
  # Make the download request to track it
  curl -s "$download_url" > /dev/null 2>&1 || echo "  Warning: Could not track Unsplash download"
  echo "  ✓ Unsplash download tracked: $attribution"
}

# Function to submit one article
submit_article() {
  local article_file="$1"
  local article_json=$(cat "$article_file")
  
  # Extract article details
  local title=$(echo "$article_json" | jq -r '.title')
  local slug=$(echo "$article_json" | jq -r '.slug')
  local featured_image_url=$(echo "$article_json" | jq -r '.featuredImage.url')
  local featured_image_download=$(echo "$article_json" | jq -r '.featuredImage.downloadUrl')
  local featured_image_attribution=$(echo "$article_json" | jq -r '.featuredImage.attribution')
  
  echo "Submitting: $title"
  echo "  Slug: $slug"
  
  # Track Unsplash download
  download_unsplash_image "$featured_image_download" "$featured_image_attribution"
  
  # Prepare API payload
  # Note: Adjust fields based on actual Letterman API spec
  local payload=$(echo "$article_json" | jq '{
    title: .title,
    slug: .slug,
    content: .content,
    status: .status,
    publicationId: .publicationId,
    keepOriginal: .keepOriginal,
    featuredImage: {
      url: .featuredImage.url,
      alt: .featuredImage.alt,
      caption: .featuredImage.attribution
    }
  }')
  
  # Submit to Letterman API
  # TODO: Adjust curl command based on actual API requirements
  local response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${LETTERMAN_API_KEY}" \
    -d "$payload" \
    "${LETTERMAN_API_BASE}/articles" 2>&1)
  
  # Parse response (adjust based on actual API response format)
  local article_id=$(echo "$response" | jq -r '.id // .articleId // .data.id // empty')
  
  if [ -n "$article_id" ]; then
    echo "  ✓ Success! Article ID: $article_id"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    ARTICLE_IDS+=("$article_id")
    ARTICLE_TITLES+=("$title")
    return 0
  else
    echo "  ✗ Failed. Response: $response"
    return 1
  fi
}

# Submit each article
for article_file in "$ARTICLE_DIR"/*.json; do
  echo ""
  submit_article "$article_file" || echo "  (continuing to next article)"
  sleep 2  # Rate limiting courtesy pause
done

echo ""
echo "========================================="
echo "Submission Complete"
echo "========================================="
echo "Success: $SUCCESS_COUNT / 5 articles"
echo ""

if [ $SUCCESS_COUNT -gt 0 ]; then
  echo "Created Articles:"
  for i in "${!ARTICLE_TITLES[@]}"; do
    echo "  $((i+1)). ${ARTICLE_TITLES[$i]}"
    echo "     ID: ${ARTICLE_IDS[$i]}"
  done
else
  echo "No articles were successfully created."
  echo "Please check:"
  echo "  - Letterman API endpoint and credentials"
  echo "  - API payload format"
  echo "  - Network connectivity"
fi

echo ""
echo "Articles saved locally in: $ARTICLE_DIR"
