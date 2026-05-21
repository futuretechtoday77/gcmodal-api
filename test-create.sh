#!/bin/bash
API_URL="https://gcmodal-api77.vercel.app"

# Get token
LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"password":"fvMrQOtOM0gyvrkeH^^7FlrM"}')

TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))")
echo "Got token: ${TOKEN:0:20}..."

# Create test
CREATE=$(curl -s -X POST "$API_URL/api/admin/split-tests" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "Test Suite Split Test 3",
        "variantA": "redlight-athlete",
        "variantB": "redlight-spa",
        "triggerType": "delay",
        "triggerDelay": 10
    }')

echo "Create response:"
echo "$CREATE" | python3 -m json.tool
