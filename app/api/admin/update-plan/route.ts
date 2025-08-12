import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { setUserPlan } from "@/lib/usage-tracker"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    setUserPlan(userId, plan)

    return NextResponse.json({
      success: true,
      message: `User ${userId} plan updated to ${plan}`,
    })
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}
