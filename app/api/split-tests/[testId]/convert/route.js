/**
 * Split Test Conversion Recording
 * Records when a visitor converts on a split test variant
 * 
 * v2.5.0 - Split Testing Feature
 * Public endpoint - called from frontend
 */

import { NextResponse } from 'next/server'

const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN
const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40'

// Simple rate limiting in memory (per IP)
const rateLimits = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  // Get or create rate limit entry
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, [])
  }
  
  const requests = rateLimits.get(ip)
  
  // Remove old requests outside window
  const validRequests = requests.filter(time => time > windowStart)
  
  // Check if under limit
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return false
  }
  
  // Add current request
  validRequests.push(now)
  rateLimits.set(ip, validRequests)
  
  return true
}

async function getSplitTest(testId) {
  try {
    if (!CONTROLBOARD_TOKEN) return null

    const response = await fetch('https://control.clawlauncher.io/api/settings', {
      headers: {
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      }
    })

    if (!response.ok) return null

    const data = await response.json()
    const settings = data.settings || {}
    const key = `split_test_${testId}`
    
    if (settings[key]) {
      return typeof settings[key] === 'string' ? JSON.parse(settings[key]) : settings[key]
    }
    
    return null
  } catch (error) {
    console.error('Error getting split test:', error)
    return null
  }
}

async function saveSplitTest(test) {
  try {
    if (!CONTROLBOARD_TOKEN) throw new Error('Control Board not configured')

    const response = await fetch('https://control.clawlauncher.io/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTROLBOARD_TOKEN}`,
        'X-Workspace-Id': WORKSPACE_ID
      },
      body: JSON.stringify({
        key: `split_test_${test.testId}`,
        value: JSON.stringify(test)
      })
    })

    return response.ok
  } catch (error) {
    console.error('Error saving split test:', error)
    return false
  }
}

/**
 * POST /api/split-tests/[testId]/convert
 * Record a conversion for a split test
 */
export async function POST(req, { params }) {
  try {
    const { testId } = params
    const body = await req.json()
    const { email, variant } = body

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Validation
    if (!email || !variant) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, variant' },
        { status: 400 }
      )
    }

    if (variant !== 'A' && variant !== 'B') {
      return NextResponse.json(
        { success: false, error: 'Variant must be A or B' },
        { status: 400 }
      )
    }

    // Get test
    const test = await getSplitTest(testId)
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    // Don't record conversions for completed tests
    if (test.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Test completed - conversion not recorded',
        isCompleted: true,
        totalConversions: variant === 'A' ? test.variantA.conversions : test.variantB.conversions,
        isDuplicate: false
      })
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if already converted
    if (test.uniqueConversions[normalizedEmail]) {
      return NextResponse.json({
        success: true,
        message: 'Conversion already recorded for this email',
        totalConversions: variant === 'A' ? test.variantA.conversions : test.variantB.conversions,
        isDuplicate: true,
        previousVariant: test.uniqueConversions[normalizedEmail]
      })
    }

    // Record conversion
    test.uniqueConversions[normalizedEmail] = variant
    
    if (variant === 'A') {
      test.variantA.conversions++
    } else {
      test.variantB.conversions++
    }

    // Save
    const saved = await saveSplitTest(test)
    
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to save conversion' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion recorded',
      totalConversions: variant === 'A' ? test.variantA.conversions : test.variantB.conversions,
      isDuplicate: false
    })

  } catch (error) {
    console.error('POST conversion error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
