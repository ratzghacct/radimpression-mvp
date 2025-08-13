import { type NextRequest, NextResponse } from "next/server"
import { resetUserUsage } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    console.log("Reset usage request:", { userId, adminEmail })

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    resetUserUsage(userId)

    return NextResponse.json({ success: true, message: `Usage reset for user ${userId}` })
  } catch (error) {
    console.error("Error resetting user usage:", error)
    return NextResponse.json({ error: "Failed to reset user usage" }, { status: 500 })
  }
}
