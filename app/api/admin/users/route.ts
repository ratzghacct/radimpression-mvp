import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email")

    if (!userEmail) {
      return NextResponse.json({ error: "No user email provided" }, { status: 400 })
    }

    if (!isAdmin(userEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Use in-memory data instead of Supabase
    const users = getAllUsers()

    return NextResponse.json({
      users,
      debug: {
        adminEmail: userEmail,
        userCount: users.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in admin API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
