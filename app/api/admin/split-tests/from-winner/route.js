/**
 * Create New Test From Winner (Champion vs Challenger)
 * Creates a new split test with previous winner as variant A
 * 
 * v2.5.0 - Split Testing Feature
 */

import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

const CONTROLBOARD_TOKEN = process.env.CONTROLBOARD_API_TOKEN
const WORKSPACE_ID = process.env.WORKSPACE_ID || '674e44e4a85f45d1b44c1a40'

function generateTestId(name) {
  const date = new Date().toISOString().split('T')[0]
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30)
  return `split-${slug}-${date}`
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

function generateImplementationCode(test) {
  const baseCode = `<!-- GC Modal: Universal Script (already on your site) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>`

  let triggerCode = ''

  if (test.triggerType === 'button') {
    triggerCode = `
<!-- Trigger: Button Click -->
<button data-popup-id="${test.testId}">Get Free Report</button>`
  } else if (test.triggerType === 'exit') {
    triggerCode = `
<!-- Trigger: Exit Intent -->`
  } else if (test.triggerType === 'delay') {
    triggerCode = `
<!-- Trigger: Time Delay (${test.triggerDelay}s) -->`
  }

  return `${baseCode}\n${triggerCode}`
}

/**
 * POST /api/admin/split-tests/from-winner
 * Create new test from previous winner
 */
export async function POST(req) {
  try {
    await verifyAuth(req)
    
    const body = await req.json()
    const { parentTestId, challengerPopupId, name } = body

    // Validation
    if (!parentTestId || !challengerPopupId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: parentTestId, challengerPopupId' },
        { status: 400 }
      )
    }

    // Get parent test
    const parentTest = await getSplitTest(parentTestId)
    
    if (!parentTest) {
      return NextResponse.json(
        { success: false, error: 'Parent test not found' },
        { status: 404 }
      )
    }

    // Must be completed to have a winner
    if (parentTest.status !== 'completed' || !parentTest.winnerPopupId) {
      return NextResponse.json(
        { success: false, error: 'Parent test must be completed with a winner' },
        { status: 400 }
      )
    }

    // Generate name if not provided
    let testName = name
    if (!testName) {
      // Get challenger popup name (we'll need to fetch this from the popups API)
      // For now, use ID
      testName = `Champion vs ${challengerPopupId}`
    }

    // Generate test ID
    const testId = generateTestId(testName)

    // Create new test with winner as variant A
    const newTest = {
      testId,
      name: testName,
      variantA: {
        popupId: parentTest.winnerPopupId,
        conversions: 0  // Fresh counter
      },
      variantB: {
        popupId: challengerPopupId,
        conversions: 0  // Fresh counter
      },
      // Copy trigger settings from parent
      triggerType: parentTest.triggerType,
      triggerDelay: parentTest.triggerDelay,
      buttonId: parentTest.buttonId,
      status: 'running',
      winnerPopupId: null,
      completedAt: null,
      archivedAt: null,
      uniqueConversions: {},
      createdAt: new Date().toISOString(),
      parentTestId: parentTestId  // Reference to parent
    }

    // Save
    const saved = await saveSplitTest(newTest)
    
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to save test' },
        { status: 500 }
      )
    }

    // Generate implementation code
    const implementationCode = generateImplementationCode(newTest)

    return NextResponse.json({
      success: true,
      test: newTest,
      implementationCode: implementationCode,
      message: 'Champion test created successfully',
      champion: parentTest.winnerPopupId,
      challenger: challengerPopupId
    })

  } catch (error) {
    console.error('POST from-winner error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
