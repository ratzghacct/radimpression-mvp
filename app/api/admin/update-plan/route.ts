import { type NextRequest, NextResponse } from "next/server"
import { resetUserUsage, updateUserPlan } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    console.log("Update plan request:", { userId, plan, adminEmail })

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    if (!userId || !plan) {
      return NextResponse.json({ error: "User ID and plan are required" }, { status: 400 })
    }

    // Update the user's plan
    updateUserPlan(userId, plan)

    // Reset usage when plan changes (fresh start with new limits)
    resetUserUsage(userId)

    return NextResponse.json({
      success: true,
      message: `User ${userId} upgraded to ${plan} plan and usage reset`,
    })
  } catch (error) {
    console.error("Error updating user plan:", error)
    return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
  }
}
