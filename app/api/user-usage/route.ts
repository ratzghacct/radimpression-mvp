import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock usage data - replace with actual database query
    const mockUsage = {
      used: Math.floor(Math.random() * 8000) + 1000,
      limit: 10000,
      plan: "free",
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json({ usage: mockUsage })
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
