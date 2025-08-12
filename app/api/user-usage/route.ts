import { type NextRequest, NextResponse } from "next/server"
import { getUserUsage } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const usage = await getUserUsage(userId)

    const limits = {
      free: 10,
      basic: 100,
      premium: 1000,
    }

    return NextResponse.json({
      ...usage,
      limit: limits[usage.plan as keyof typeof limits],
      remaining: limits[usage.plan as keyof typeof limits] - usage.tokens_used,
    })
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
