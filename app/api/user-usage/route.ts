import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    // Mock usage data - in production, fetch from database
    const usageData = {
      used: Math.floor(Math.random() * 50),
      limit: 100,
      plan: "free",
    }

    return NextResponse.json(usageData)
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
  }
}
