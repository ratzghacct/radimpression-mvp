import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { calculateCost, getUserUsage, updateUserUsage } from "@/lib/admin"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { findings, format = "standard", userId } = await request.json()

    if (!findings) {
      return NextResponse.json({ error: "Findings are required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 })
    }

    // Check user usage and limits
    const userUsage = await getUserUsage(userId)
    const cost = calculateCost(format)

    const limits = {
      free: 10,
      basic: 100,
      premium: 1000,
    }

    if (userUsage.tokens_used + cost > limits[userUsage.plan as keyof typeof limits]) {
      return NextResponse.json({ error: "Usage limit exceeded" }, { status: 403 })
    }

    // Generate prompt based on format
    let prompt = ""
    switch (format) {
      case "formal":
        prompt = `As a radiologist, provide a detailed, formal medical impression based on these findings: ${findings}. Use proper medical terminology and structure.`
        break
      case "short":
        prompt = `Provide a concise medical impression for these findings: ${findings}. Keep it brief but accurate.`
        break
      default:
        prompt = `Provide a professional medical impression based on these findings: ${findings}.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced radiologist providing medical impressions. Be accurate, professional, and use appropriate medical terminology.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: format === "short" ? 150 : 500,
      temperature: 0.3,
    })

    const impression = completion.choices[0]?.message?.content

    if (!impression) {
      return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
    }

    // Update user usage
    await updateUserUsage(userId, userUsage.tokens_used + cost)

    // Save to history (you can implement this)
    // await saveToHistory(userId, findings, impression, format)

    return NextResponse.json({
      impression,
      tokensUsed: cost,
      remainingTokens: limits[userUsage.plan as keyof typeof limits] - (userUsage.tokens_used + cost),
    })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
