import { type NextRequest, NextResponse } from "next/server"
import { getUserUsage } from "@/lib/usage-tracker"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const usage = getUserUsage(userId)

    return NextResponse.json({
      tokens: usage.tokens,
      plan: usage.plan,
      blocked: usage.blocked,
    })
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
