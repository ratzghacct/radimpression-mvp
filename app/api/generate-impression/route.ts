import { type NextRequest, NextResponse } from "next/server"
import { trackTokenUsage, isUserBlocked, addToHistory } from "@/lib/usage-tracker"

export async function POST(request: NextRequest) {
  try {
    const { findings, userId, email, displayName, format = "standard" } = await request.json()

    if (!findings || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user is blocked
    if (isUserBlocked(userId)) {
      return NextResponse.json({ error: "User is blocked from generating impressions" }, { status: 403 })
    }

    // Prepare the prompt based on format
    let systemPrompt = ""
    let userPrompt = ""

    if (format === "formal") {
      systemPrompt =
        "You are a radiologist providing formal medical impressions. Use professional medical terminology and structured format."
      userPrompt = `Please provide a formal radiological impression for the following findings:\n\n${findings}`
    } else if (format === "short") {
      systemPrompt = "You are a radiologist providing concise medical impressions. Keep responses brief but accurate."
      userPrompt = `Please provide a short radiological impression for the following findings:\n\n${findings}`
    } else {
      systemPrompt =
        "You are an experienced radiologist. Provide clear, professional medical impressions based on the given findings."
      userPrompt = `Please provide a radiological impression for the following findings:\n\n${findings}`
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error("OpenAI API error:", errorData)
      return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
    }

    const data = await openaiResponse.json()
    const impression = data.choices[0]?.message?.content

    if (!impression) {
      return NextResponse.json({ error: "No impression generated" }, { status: 500 })
    }

    // Track token usage
    const tokenUsage = {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    }

    await trackTokenUsage(userId, email, displayName, tokenUsage)
    addToHistory(userId, findings, impression, tokenUsage)

    return NextResponse.json({
      impression,
      tokenUsage,
      format,
    })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
