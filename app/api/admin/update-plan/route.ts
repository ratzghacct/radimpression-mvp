import { type NextRequest, NextResponse } from "next/server"
import { updateUserPlan } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    updateUserPlan(userId, plan)

    return NextResponse.json({
      message: "User plan updated successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error updating user plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
