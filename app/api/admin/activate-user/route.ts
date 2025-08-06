import { NextRequest, NextResponse } from "next/server"
import { unblockUser, setUserPlan } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Unblock the user
    unblockUser(userId)
    
    // Set their new plan
    setUserPlan(userId, plan)

    return NextResponse.json({ 
      success: true,
      message: `User activated with ${plan} plan`
    })
  } catch (error) {
    console.error("Error activating user:", error)
    return NextResponse.json({ error: "Failed to activate user" }, { status: 500 })
  }
}