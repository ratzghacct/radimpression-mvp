import { type NextRequest, NextResponse } from "next/server"
import { resetUserUsage } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    resetUserUsage(userId)

    return NextResponse.json({
      message: "User usage reset successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error resetting user usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
