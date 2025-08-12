import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Mock usage reset - replace with actual database update
    console.log("Resetting usage for user:", userId)

    return NextResponse.json({
      success: true,
      message: "User usage reset successfully",
    })
  } catch (error) {
    console.error("Error resetting user usage:", error)
    return NextResponse.json({ error: "Failed to reset usage" }, { status: 500 })
  }
}
