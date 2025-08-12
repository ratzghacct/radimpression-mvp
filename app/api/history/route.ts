import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock history data - replace with actual database query
    const mockHistory = [
      {
        id: "1",
        userId: userId,
        findings:
          "Chest X-ray shows clear lung fields bilaterally. No acute cardiopulmonary abnormalities. Heart size within normal limits.",
        impression: "IMPRESSION: Normal chest X-ray. No acute cardiopulmonary process.",
        tokenUsage: {
          promptTokens: 45,
          completionTokens: 25,
          totalTokens: 70,
          cost: 0.0021,
          format: "formal",
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        model: "gpt-4",
      },
      {
        id: "2",
        userId: userId,
        findings: "CT abdomen shows mild hepatomegaly. No focal lesions identified.",
        impression: "Mild hepatomegaly, otherwise unremarkable.",
        tokenUsage: {
          promptTokens: 35,
          completionTokens: 15,
          totalTokens: 50,
          cost: 0.0015,
          format: "short",
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        model: "gpt-4",
      },
    ]

    return NextResponse.json({ history: mockHistory })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
