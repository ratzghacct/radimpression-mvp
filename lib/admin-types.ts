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
}

export interface EarlyAccessUser {
  id: number
  email: string
  name: string
  created_at: string
  status: string
}

export interface AdminStats {
  totalUsers: number
  totalTokens: number
  totalImpressions: number
  totalCost: number
  activeUsers: number
  blockedUsers: number
}

export interface ActionLoadingState {
  type: "block" | "unblock" | "reset" | "activate"
  userId: string
}
