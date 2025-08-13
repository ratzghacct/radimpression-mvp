import { type NextRequest, NextResponse } from "next/server"
import { blockUser } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    blockUser(userId)

    return NextResponse.json({
      message: "User blocked successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error blocking user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
