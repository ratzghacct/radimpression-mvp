import { type NextRequest, NextResponse } from "next/server"
import { changePlan, resetUserUsage, blockUser, unblockUser } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    console.log("=== USER ACTION API CALLED ===")
    
    const body = await request.json()
    console.log("Request body:", body)
    
    const { userId, action, value, adminEmail } = body

    console.log("Admin check for:", adminEmail)
    console.log("Is admin?", isAdmin(adminEmail))

    if (!isAdmin(adminEmail)) {
      console.log("❌ Admin check failed")
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    if (!userId || !action) {
      console.log("❌ Missing fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log(`Performing action: ${action} for user: ${userId}`)

    switch (action) {
      case "changePlan":
        if (!value) {
          return NextResponse.json({ error: "Plan value required" }, { status: 400 })
        }
        changePlan(userId, value)
        console.log("✅ Plan changed")
        break

      case "resetUsage":
        resetUserUsage(userId)
        console.log("✅ Usage reset")
        break

      case "block":
        blockUser(userId)
        console.log("✅ User blocked")
        break

      case "unblock":
      case "activate":
        unblockUser(userId)
        console.log("✅ User unblocked")
        break

      case "deactivate":
        blockUser(userId)
        console.log("✅ User deactivated")
        break

      default:
        console.log("❌ Invalid action:", action)
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    console.log("=== SUCCESS ===")
    return NextResponse.json({ success: true, message: `User ${action} completed successfully` })
  } catch (error) {
    console.error("❌ Error in user action:", error)
    return NextResponse.json({ error: "Failed to perform user action" }, { status: 500 })
  }
}
