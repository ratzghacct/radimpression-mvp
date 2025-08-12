import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { findings, format, userId, userEmail, userName } = await request.json()

    if (!findings) {
      return NextResponse.json({ error: "Findings are required" }, { status: 400 })
    }

    // Create the prompt based on format
    let prompt = ""
    if (format === "short") {
      prompt = `As a radiologist, provide a concise impression for the following findings. Keep it brief and to the point:

Findings: ${findings}

Provide only the impression, no additional text or explanations.`
    } else {
      prompt = `As a radiologist, provide a comprehensive and professional impression for the following findings:

Findings: ${findings}

Provide a detailed impression that includes:
1. Primary findings and their clinical significance
2. Differential diagnoses if applicable
3. Recommendations for follow-up or additional studies if needed

Format the response as a professional radiology impression.`
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: format === "short" ? 200 : 500,
    })

    // Here you would typically:
    // 1. Save to database
    // 2. Update user usage
    // 3. Log the generation

    return NextResponse.json({
      impression: text,
      tokensUsed: text.length / 4, // Rough estimate
    })
  } catch (error) {
    console.error("Error generating impression:", error)
    return NextResponse.json({ error: "Failed to generate impression" }, { status: 500 })
  }
}
