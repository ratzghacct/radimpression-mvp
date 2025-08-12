import { type NextRequest, NextResponse } from "next/server"
import { canUserGenerate, updateUserUsage } from "@/lib/usage-tracker"

export async function POST(request: NextRequest) {
  try {
    const { patientData, format, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (!canUserGenerate(userId)) {
      return NextResponse.json({ error: "Usage limit exceeded or user blocked" }, { status: 403 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const prompt =
      format === "formal"
        ? `Generate a formal medical impression based on the following patient data: ${JSON.stringify(patientData)}`
        : `Generate a concise medical impression based on the following patient data: ${JSON.stringify(patientData)}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant. Generate professional medical impressions based on patient data.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const impression = data.choices[0]?.message?.content || "Unable to generate impression"
    const tokensUsed = data.usage?.total_tokens || 100

    // Update user usage
    updateUserUsage(userId, tokensUsed)

    return NextResponse.json({
      impression,
      tokensUsed,
      format,
    })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
  }
}
