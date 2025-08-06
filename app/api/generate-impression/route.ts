import { trackTokenUsage, isUserBlocked, addToHistory, getUserUsage, blockUser } from "@/lib/usage-tracker"
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Cost per 1K tokens (as of 2024)
const COSTS = {
  'gpt-4o': {
    input: 0.005,   // $0.005 per 1K input tokens
    output: 0.015,  // $0.015 per 1K output tokens
  },
  'gpt-4o-mini': {
    input: 0.00015, // $0.00015 per 1K input tokens
    output: 0.0006, // $0.0006 per 1K output tokens
  },
  'gpt-3.5-turbo': {
    input: 0.001,   // $0.001 per 1K input tokens
    output: 0.002,  // $0.002 per 1K output tokens
  }
}

export async function POST(request: NextRequest) {
  try {
    const { findings, userId, userEmail, userName, format = 'formal' } = await request.json()

    // Check if user is blocked
    const blocked = await isUserBlocked(userId)
    if (blocked) {
      return NextResponse.json(
        {
          error: 'Account temporarily suspended',
          blocked: true,
          message: 'Your account has been temporarily suspended. Please email support@radimpression.tech.'
        },
        { status: 403 }
      )
    }

    // Check token usage limits before generating
    const currentUsage = await getUserUsage(userId)
    const limits = {
      free: 10000,
      starter: 100000,
      pro: 300000,
      "rad-plus": 1000000
    }

    // Get user's actual plan from usage data
    const userUsage = await getUserUsage(userId)
    const userPlan = userUsage?.plan || "free" // Default to free if no plan set
    const tokenLimit = limits[userPlan as keyof typeof limits]

    if (currentUsage && currentUsage.totalTokensUsed >= tokenLimit) {
      // Auto-block user when they hit the limit
      await blockUser(userId)
      
      return NextResponse.json(
        {
          error: "Token limit reached. Please upgrade your plan to continue.",
          tokenLimitReached: true,
          usage: {
            used: currentUsage.totalTokensUsed,
            limit: tokenLimit
          }
        },
        { status: 403 }
      )
    }

    if (!findings) {
      return NextResponse.json(
        { error: 'Findings are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Different prompts based on selected format
    const prompts = {
      formal: `You are a board-certified senior and experienced radiologist. Your task is to generate a formal, concise "IMPRESSION" section suitable for inclusion in a radiology report. Use professional medical language and appropriate clinical tone. Do not include recommendations, explanations, or findings section. Use numbered bullet points. Include lesion size only if provided. Classify clearly whether findings are primary or incidental.`,
      
      short: `You are an experienced senior radiologist. Based on the provided findings, generate a concise and minimal "IMPRESSION" section using medical terms only. Limit each point to one line. Do not include explanations, recommendations, or formatting beyond a numbered list. Focus only on the core findings. No headers or summaries — output should begin directly with the numbered impression.`
    }

    const systemPrompt = prompts[format as keyof typeof prompts] || prompts.formal
    const userPrompt = `FINDINGS:\n${findings}\n\nIMPRESSION:`

    console.log('Generating impression for user:', userEmail)
    console.log('Format:', format)
    console.log('Findings length:', findings.length)

    // Use GPT-4o for maximum accuracy in medical contexts
    const model = 'gpt-4o'
    
    // Adjust max tokens based on format
    const maxTokens = format === 'short' ? 400 : 800
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.1, // Very low temperature for maximum consistency
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const impression = completion.choices[0]?.message?.content?.trim()
    if (!impression) {
      throw new Error('No impression generated')
    }

    // Calculate token usage and cost
    const usage = completion.usage
    const inputTokens = usage?.prompt_tokens || 0
    const outputTokens = usage?.completion_tokens || 0
    const totalTokens = usage?.total_tokens || 0

    const modelCosts = COSTS[model as keyof typeof COSTS] || COSTS['gpt-4o']
    const inputCost = (inputTokens / 1000) * modelCosts.input
    const outputCost = (outputTokens / 1000) * modelCosts.output
    const totalCost = inputCost + outputCost

    const tokenUsage = {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens: totalTokens,
      cost: totalCost,
      model: model,
      format: format
    }

    console.log('Generation successful:', {
      userId,
      userEmail,
      tokens: totalTokens,
      cost: totalCost.toFixed(4),
      model,
      format
    })

    // Track token usage
    await trackTokenUsage(userId, userEmail || "unknown@email.com", userName || "Unknown User", tokenUsage)

    // Add to history
    await addToHistory(userId, findings, impression, tokenUsage, model)

    return NextResponse.json({
      impression,
      tokenUsage,
      success: true
    })

  } catch (error: any) {
    console.error('Error generating impression:', error)
    
    // Handle specific OpenAI errors
    if (error?.error?.type === 'insufficient_quota') {
      return NextResponse.json(
        {
          error: 'API quota exceeded. Please try again later or contact support.',
          type: 'quota_exceeded'
        },
        { status: 429 }
      )
    }

    if (error?.error?.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait a moment and try again.',
          type: 'rate_limit'
        },
        { status: 429 }
      )
    }

    if (error?.error?.code === 'invalid_api_key') {
      return NextResponse.json(
        {
          error: 'API configuration error. Please contact support.',
          type: 'api_error'
        },
        { status: 500 }
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Failed to generate impression. Please try again.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint for health checks
export async function GET() {
  return NextResponse.json({
    status: 'API is working',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.OPENAI_API_KEY,
    model: 'gpt-4o'
  })
}