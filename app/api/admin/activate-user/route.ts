import { type NextRequest, NextResponse } from "next/server"
import { unblockUser } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    unblockUser(userId)

    return NextResponse.json({
      message: "User activated successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error activating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
