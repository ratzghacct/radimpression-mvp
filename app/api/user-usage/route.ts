import { type NextRequest, NextResponse } from "next/server"
import { getUserUsage } from "@/lib/usage-tracker"

const PLAN_LIMITS = {
  free: 10000,
  basic: 50000,
  pro: 200000,
  "rad-plus": 1000000,
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Use in-memory data instead of Supabase
    const user = getUserUsage(userId)

    if (!user) {
      return NextResponse.json({
        totalTokensUsed: 0,
        totalImpressions: 0,
        tokensToday: 0,
        impressionsToday: 0,
        plan: "free",
        isBlocked: false,
        used: 0,
        available: 10000,
        remaining: 10000,
        impressions: { used: 0, limit: 1000 }
      })
    }

    const planLimit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
    const remaining = Math.max(0, planLimit - user.totalTokensUsed)

    return NextResponse.json({
      totalTokensUsed: user.totalTokensUsed,
      totalImpressions: user.totalImpressions,
      tokensToday: user.tokensToday,
      impressionsToday: user.impressionsToday,
      plan: user.plan || "free",
      isBlocked: user.isBlocked,
      used: user.totalTokensUsed,
      available: planLimit,
      remaining: remaining,
      impressions: {
        used: user.totalImpressions,
        limit: 1000
      }
    })
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
