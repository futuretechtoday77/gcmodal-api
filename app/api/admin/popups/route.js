import { NextResponse } from 'next/server'
import { verifyAuth } from '../../../../lib/auth'
import popupsConfig from '../../../../public/popups.json'

export async function GET(req) {
  // Verify JWT authentication
  const authResult = verifyAuth(req)
  if (!authResult.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Return full config including tagId for admin use
  return NextResponse.json({
    success: true,
    popups: popupsConfig.popups
  })
}
