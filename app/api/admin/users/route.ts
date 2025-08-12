import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const adminEmail = request.nextUrl.searchParams.get("adminEmail")

    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Mock user data - in production this would come from your database
    const users = [
      {
        id: "user1",
        email: "user1@example.com",
        plan: "free",
        tokens: 5,
        blocked: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "user2",
        email: "user2@example.com",
        plan: "pro",
        tokens: 150,
        blocked: false,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
