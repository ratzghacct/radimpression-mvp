import { type NextRequest, NextResponse } from "next/server"
import { getUserHistory } from "@/lib/usage-tracker"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const history = getUserHistory(userId)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching user history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
