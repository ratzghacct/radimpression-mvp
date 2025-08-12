import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { resetUserUsage } from "@/lib/usage-tracker"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    resetUserUsage(userId)

    return NextResponse.json({
      success: true,
      message: `Usage reset for user ${userId}`,
    })
  } catch (error) {
    console.error("Error resetting usage:", error)
    return NextResponse.json({ error: "Failed to reset usage" }, { status: 500 })
  }
}
