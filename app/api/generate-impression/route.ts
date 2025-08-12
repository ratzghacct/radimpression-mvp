import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { findings, userId, userEmail, userName, format = "formal" } = await request.json()

    if (!findings || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create format-specific prompts
    const prompts = {
      formal: `You are an expert radiologist. Based on the following radiology findings, generate a professional, detailed impression suitable for a radiology report. The impression should be comprehensive, well-structured, and follow standard radiology reporting conventions.

Findings: ${findings}

Generate a formal radiology impression:`,

      short: `You are an expert radiologist. Based on the following radiology findings, generate a concise, minimal impression with only the core findings. Keep it brief and to the point.

Findings: ${findings}

Generate a short radiology impression:`,
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert radiologist with years of experience in medical imaging interpretation. Generate professional radiology impressions based on the provided findings.",
        },
        {
          role: "user",
          content: prompts[format as keyof typeof prompts] || prompts.formal,
        },
      ],
      max_tokens: format === "short" ? 200 : 500,
      temperature: 0.3,
    })

    const impression = completion.choices[0]?.message?.content || "Unable to generate impression"

    const tokenUsage = {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
      cost: ((completion.usage?.total_tokens || 0) * 0.03) / 1000,
      format: format,
    }

    return NextResponse.json({
      impression,
      tokenUsage,
      model: "gpt-4",
    })
  } catch (error: any) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
  }
}
