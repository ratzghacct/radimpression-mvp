import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { findings, format = "standard" } = await request.json()

    if (!findings) {
      return NextResponse.json({ error: "Findings are required" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    let prompt = ""
    if (format === "formal") {
      prompt = `As a radiologist, provide a formal medical impression based on these findings: ${findings}. Use professional medical terminology and structured format.`
    } else if (format === "short") {
      prompt = `Provide a concise medical impression based on these findings: ${findings}. Keep it brief but accurate.`
    } else {
      prompt = `As a radiologist, provide a professional medical impression based on these findings: ${findings}`
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const impression = data.choices[0]?.message?.content

    if (!impression) {
      throw new Error("No impression generated")
    }

    return NextResponse.json({ impression })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
  }
}
