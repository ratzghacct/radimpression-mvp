import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { action } from "@/lib/action" // Declare the variable before using it

export async function POST(request: NextRequest) {
  try {
    const { userId, action, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Mock user blocking - replace with actual database update
    console.log(`${action}ing user:`, userId)

    return NextResponse.json({
      success: true,
      message: `User ${action}ed successfully`,
    })
  } catch (error) {
    console.error(`Error ${action}ing user:`, error)
    return NextResponse.json({ error: `Failed to ${action} user` }, { status: 500 })
  }
}
