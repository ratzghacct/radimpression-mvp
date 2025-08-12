import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email")

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    // Mock user usage data - replace with actual database query
    const mockUsage = {
      tokensUsed: 2500,
      tokensLimit: 10000,
      impressionsGenerated: 15,
      plan: "free",
    }

    return NextResponse.json(mockUsage)
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
