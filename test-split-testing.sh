#!/bin/bash
# Split Testing Test Suite v2.5.0
# Comprehensive testing of all split test functionality

echo "========================================"
echo "SPLIT TESTING TEST SUITE - v2.5.0"
echo "========================================"
echo ""

API_URL="https://gcmodal-api77.vercel.app"
ADMIN_TOKEN=""  # Will be obtained via login

# Test Results
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_pass() {
    echo "✅ PASS: $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

test_fail() {
    echo "❌ FAIL: $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

echo "1. Testing Public API Endpoints"
echo "--------------------------------"

# Test 1: List popups
echo -n "   List popups endpoint... "
POPUPS=$(curl -s "$API_URL/api/popups" 2>/dev/null)
if echo "$POPUPS" | grep -q '"success":true'; then
    COUNT=$(echo "$POPUPS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('popups', {})))" 2>/dev/null)
    test_pass "List popups returns $COUNT popups"
else
    test_fail "List popups endpoint failed"
fi

# Test 2: Get specific popup
echo -n "   Get single popup... "
POPUP=$(curl -s "$API_URL/api/popups?id=redlight-athlete" 2>/dev/null)
if echo "$POPUP" | grep -q '"success":true'; then
    test_pass "Get single popup works"
else
    test_fail "Get single popup failed"
fi

echo ""
echo "2. Testing Admin Authentication"
echo "--------------------------------"

# Test 3: Admin login
echo -n "   Admin login... "
LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"password":"fvMrQOtOM0gyvrkeH^^7FlrM"}' 2>/dev/null)

if echo "$LOGIN" | grep -q '"success":true'; then
    ADMIN_TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))" 2>/dev/null)
    if [ -n "$ADMIN_TOKEN" ]; then
        test_pass "Admin login successful"
    else
        test_fail "Admin login returned no token"
    fi
else
    test_fail "Admin login failed"
fi

echo ""
echo "3. Testing Split Test Admin Endpoints"
echo "--------------------------------------"

if [ -n "$ADMIN_TOKEN" ]; then
    # Test 4: List split tests (should be empty initially)
    echo -n "   List split tests (empty)... "
    TESTS=$(curl -s "$API_URL/api/admin/split-tests" \
        -H "Authorization: Bearer $ADMIN_TOKEN" 2>/dev/null)
    if echo "$TESTS" | grep -q '"success":true'; then
        test_pass "List split tests endpoint works"
    else
        test_fail "List split tests endpoint failed"
    fi
    
    # Test 5: Create split test
    echo -n "   Create split test... "
    CREATE=$(curl -s -X POST "$API_URL/api/admin/split-tests" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -d '{
            "name": "Test Suite Split Test",
            "variantA": "redlight-athlete",
            "variantB": "redlight-spa",
            "triggerType": "delay",
            "triggerDelay": 10
        }' 2>/dev/null)
    
    if echo "$CREATE" | grep -q '"success":true'; then
        TEST_ID=$(echo "$CREATE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('test', {}).get('testId', ''))" 2>/dev/null)
        test_pass "Create split test works (ID: $TEST_ID)"
    else
        test_fail "Create split test failed"
    fi
    
    if [ -n "$TEST_ID" ]; then
        # Test 6: Get specific test
        echo -n "   Get specific test... "
        GET_TEST=$(curl -s "$API_URL/api/admin/split-tests/$TEST_ID" \
            -H "Authorization: Bearer $ADMIN_TOKEN" 2>/dev/null)
        if echo "$GET_TEST" | grep -q '"success":true'; then
            test_pass "Get specific test works"
        else
            test_fail "Get specific test failed"
        fi
        
        # Test 7: Public endpoint returns split test popup
        echo -n "   Public API returns split test... "
        SPLIT_POPUP=$(curl -s "$API_URL/api/popups/$TEST_ID" 2>/dev/null)
        if echo "$SPLIT_POPUP" | grep -q '"success":true'; then
            HAS_METADATA=$(echo "$SPLIT_POPUP" | grep '"_splitTest"' || echo "")
            if [ -n "$HAS_METADATA" ]; then
                test_pass "Split test returns with metadata"
            else
                test_fail "Split test missing metadata"
            fi
        else
            test_fail "Public API failed for split test"
        fi
        
        # Test 8: Record conversion
        echo -n "   Record conversion... "
        CONVERT=$(curl -s -X POST "$API_URL/api/split-tests/$TEST_ID/convert" \
            -H "Content-Type: application/json" \
            -d '{
                "email": "test@example.com",
                "variant": "A"
            }' 2>/dev/null)
        if echo "$CONVERT" | grep -q '"success":true'; then
            test_pass "Conversion recording works"
        else
            test_fail "Conversion recording failed"
        fi
        
        # Test 9: Duplicate conversion (should be ignored)
        echo -n "   Duplicate conversion ignored... "
        DUP=$(curl -s -X POST "$API_URL/api/split-tests/$TEST_ID/convert" \
            -H "Content-Type: application/json" \
            -d '{
                "email": "test@example.com",
                "variant": "A"
            }' 2>/dev/null)
        IS_DUP=$(echo "$DUP" | grep '"isDuplicate":true' || echo "")
        if [ -n "$IS_DUP" ]; then
            test_pass "Duplicate correctly identified"
        else
            test_fail "Duplicate detection failed"
        fi
        
        # Test 10: Complete test
        echo -n "   Complete test... "
        COMPLETE=$(curl -s -X PUT "$API_URL/api/admin/split-tests/$TEST_ID" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $ADMIN_TOKEN" \
            -d '{
                "action": "complete",
                "winnerPopupId": "redlight-athlete"
            }' 2>/dev/null)
        if echo "$COMPLETE" | grep -q '"success":true'; then
            test_pass "Complete test works"
        else
            test_fail "Complete test failed"
        fi
        
        # Test 11: Completed test returns winner
        echo -n "   Completed test returns winner... "
        WINNER=$(curl -s "$API_URL/api/popups/$TEST_ID" 2>/dev/null)
        IS_COMPLETED=$(echo "$WINNER" | grep '"isCompleted":true' || echo "")
        if [ -n "$IS_COMPLETED" ]; then
            test_pass "Completed test shows winner"
        else
            test_fail "Completed test not showing winner"
        fi
        
        # Test 12: Archive test
        echo -n "   Archive test... "
        ARCHIVE=$(curl -s -X PUT "$API_URL/api/admin/split-tests/$TEST_ID" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $ADMIN_TOKEN" \
            -d '{"action": "archive"}' 2>/dev/null)
        if echo "$ARCHIVE" | grep -q '"success":true'; then
            test_pass "Archive test works"
        else
            test_fail "Archive test failed"
        fi
        
        # Cleanup: Delete test
        echo -n "   Cleanup: Delete test... "
        DELETE=$(curl -s -X DELETE "$API_URL/api/admin/split-tests/$TEST_ID" \
            -H "Authorization: Bearer $ADMIN_TOKEN" 2>/dev/null)
        if echo "$DELETE" | grep -q '"success":true'; then
            test_pass "Delete test works"
        else
            test_fail "Delete test failed"
        fi
    fi
else
    echo "   ⚠️  Skipping admin tests - no auth token"
fi

echo ""
echo "========================================"
echo "TEST RESULTS"
echo "========================================"
echo "✅ Passed: $TESTS_PASSED"
echo "❌ Failed: $TESTS_FAILED"
echo ""
if [ $TESTS_FAILED -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
else
    echo "⚠️  SOME TESTS FAILED - Review needed"
fi
echo "========================================"
