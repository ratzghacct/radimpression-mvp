import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const adminEmail = request.headers.get("x-user-email")

    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Mock users data - replace with actual database query
    const mockUsers = [
      {
        userId: "user1",
        email: "user1@example.com",
        displayName: "John Doe",
        totalTokensUsed: 2500,
        totalImpressions: 15,
        isBlocked: false,
        lastUsed: new Date(),
        createdAt: new Date(),
        tokensToday: 500,
        impressionsToday: 3,
        lastResetDate: new Date(),
        plan: "free",
      },
      {
        userId: "user2",
        email: "user2@example.com",
        displayName: "Jane Smith",
        totalTokensUsed: 8500,
        totalImpressions: 45,
        isBlocked: false,
        lastUsed: new Date(),
        createdAt: new Date(),
        tokensToday: 1200,
        impressionsToday: 7,
        lastResetDate: new Date(),
        plan: "pro",
      },
    ]

    return NextResponse.json({ users: mockUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
