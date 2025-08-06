// Admin configuration - PRODUCTION VERSION
export const ADMIN_EMAILS = [
  "your-actual-email@gmail.com", // ⚠️ REPLACE WITH YOUR REAL EMAIL
  // Remove demo email for production:
  "demo@radimpression.com",
]

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export interface UserUsage {
  userId: string
  email: string
  displayName: string
  totalTokensUsed: number
  totalImpressions: number
  isBlocked: boolean
  lastUsed: Date
  createdAt: Date
  tokensToday: number
  impressionsToday: number
  lastResetDate: Date
  plan?: string
  tokenLimit?: number
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

// OpenAI pricing (as of 2024) - REAL PRICING
export const OPENAI_PRICING = {
  "gpt-4": {
    input: 0.03 / 1000,
    output: 0.06 / 1000,
  },
  "gpt-4o": {
    input: 0.0025 / 1000,
    output: 0.01 / 1000,
  },
  "gpt-3.5-turbo": {
    input: 0.001 / 1000,
    output: 0.002 / 1000,
  },
}

export const calculateCost = (usage: TokenUsage, model = "gpt-4o"): number => {
  const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING] || OPENAI_PRICING["gpt-4o"]
  return usage.promptTokens * pricing.input + usage.completionTokens * pricing.output
}
