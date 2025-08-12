import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email")

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    // Mock history data - replace with actual database query
    const mockHistory = [
      {
        id: "1",
        findings: "Chest X-ray shows clear lungs",
        impression: "Normal chest radiograph",
        format: "standard",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        findings: "CT scan shows small nodule in right lung",
        impression: "Small pulmonary nodule, recommend follow-up",
        format: "formal",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    return NextResponse.json({ history: mockHistory })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
