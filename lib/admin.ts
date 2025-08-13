// Types
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
  plan: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

// Admin check function
export const isAdmin = (email: string): boolean => {
  const adminEmails = ["admin@radimpression.com", "demo@radimpression.com", "ratzghacct@gmail.com"]
  return adminEmails.includes(email.toLowerCase())
}

// Cost calculation function
export const calculateCost = (tokenUsage: TokenUsage, model = "gpt-4o"): number => {
  // OpenAI pricing (per 1K tokens)
  const pricing = {
    "gpt-4o": {
      input: 0.0025, // $0.0025 per 1K input tokens
      output: 0.01, // $0.01 per 1K output tokens
    },
    "gpt-4": {
      input: 0.03,
      output: 0.06,
    },
    "gpt-3.5-turbo": {
      input: 0.0015,
      output: 0.002,
    },
  }

  const modelPricing = pricing[model as keyof typeof pricing] || pricing["gpt-4o"]

  const inputCost = (tokenUsage.promptTokens / 1000) * modelPricing.input
  const outputCost = (tokenUsage.completionTokens / 1000) * modelPricing.output

  return inputCost + outputCost
}

// Plan limits
export const getPlanLimits = (plan: string) => {
  const limits = {
    free: { tokens: 10000, impressions: 10 },
    basic: { tokens: 100000, impressions: 100 },
    pro: { tokens: 500000, impressions: 500 },
    premium: { tokens: 2000000, impressions: 2000 },
    "rad-plus": { tokens: 5000000, impressions: 5000 },
  }

  return limits[plan as keyof typeof limits] || limits.free
}

// Check if user can generate
export const canUserGenerate = (usage: UserUsage): boolean => {
  if (usage.isBlocked) return false

  const limits = getPlanLimits(usage.plan)
  return usage.totalTokensUsed < limits.tokens && usage.totalImpressions < limits.impressions
}
