import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { findings, format = "standard" } = await request.json()

    if (!findings) {
      return NextResponse.json({ error: "Findings are required" }, { status: 400 })
    }

    let prompt = ""

    if (format === "formal") {
      prompt = `As a radiologist, provide a formal medical impression based on these findings: ${findings}. Use professional medical terminology and structured format.`
    } else if (format === "short") {
      prompt = `Provide a concise medical impression for these findings: ${findings}. Keep it brief but accurate.`
    } else {
      prompt = `Provide a medical impression based on these findings: ${findings}.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an experienced radiologist providing medical impressions based on imaging findings.",
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

    return NextResponse.json({
      impression,
      tokensUsed: completion.usage?.total_tokens || 0,
      format,
    })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
