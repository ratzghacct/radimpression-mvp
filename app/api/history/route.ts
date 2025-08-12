import { type NextRequest, NextResponse } from "next/server"

// Mock history data - in production this would come from your database
const impressionHistory = new Map<string, any[]>()

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const history = impressionHistory.get(userId) || []

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, impression, patientData, format } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const historyItem = {
      id: Date.now().toString(),
      impression,
      patientData,
      format,
      createdAt: new Date().toISOString(),
    }

    const currentHistory = impressionHistory.get(userId) || []
    currentHistory.unshift(historyItem)

    // Keep only last 50 items
    if (currentHistory.length > 50) {
      currentHistory.splice(50)
    }

    impressionHistory.set(userId, currentHistory)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving to history:", error)
    return NextResponse.json({ error: "Failed to save to history" }, { status: 500 })
  }
}
