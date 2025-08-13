import { type NextRequest, NextResponse } from "next/server"
import { getUserUsage } from "@/lib/usage-tracker"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const usage = getUserUsage(userId)

    if (!usage) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(usage)
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
