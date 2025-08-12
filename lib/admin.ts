const ADMIN_EMAILS = [
  "admin@radimpression.com",
  "support@radimpression.com",
  // Add your admin emails here
]

export function isAdmin(email?: string | null): boolean {
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

export function calculateCost(tokens: number): number {
  // OpenAI GPT-4 pricing: $0.03 per 1K prompt tokens, $0.06 per 1K completion tokens
  // Using average of $0.045 per 1K tokens for estimation
  return (tokens / 1000) * 0.045
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }
  return tokens.toString()
}

export function getPlanLimits() {
  return {
    free: 10000,
    basic: 50000,
    pro: 200000,
    "rad-plus": 1000000,
  }
}

export function getPlanName(planId: string): string {
  const names: Record<string, string> = {
    free: "Free Plan",
    basic: "Basic Plan",
    pro: "Pro Plan",
    "rad-plus": "Rad Plus Plan",
  }
  return names[planId] || "Unknown Plan"
}
