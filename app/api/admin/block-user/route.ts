import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { blockUser } from "@/lib/usage-tracker"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    blockUser(userId)

    return NextResponse.json({
      success: true,
      message: `User ${userId} has been blocked`,
    })
  } catch (error) {
    console.error("Error blocking user:", error)
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 })
  }
}
