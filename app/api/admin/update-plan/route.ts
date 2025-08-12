import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Mock plan update - replace with actual database update
    console.log("Updating user plan:", { userId, plan })

    return NextResponse.json({
      success: true,
      message: `User plan updated to ${plan}`,
    })
  } catch (error) {
    console.error("Error updating user plan:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}
