import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    // Mock history data - in production, fetch from database
    const history = [
      {
        id: "1",
        findings: "Chest X-ray shows bilateral lower lobe opacities...",
        impression: "Findings consistent with bilateral pneumonia...",
        format: "formal",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "2",
        findings: "CT abdomen shows appendiceal wall thickening...",
        impression: "Acute appendicitis.",
        format: "short",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
      },
    ]

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
