import type { UserUsage, TokenUsage } from "./admin"

// In-memory storage for demo (replace with database in production)
const userUsage = new Map<string, { tokens: number; plan: string; blocked: boolean }>()
let isInitialized = false

// Initialize demo data only once
const initializeDemoData = () => {
  if (isInitialized) {
    console.log("Demo data already initialized, skipping...")
    return
  }

  console.log("Initializing demo data for the first time...")

  userUsage.set("demo-user", {
    tokens: 0,
    plan: "free",
    blocked: false,
  })

  userUsage.set("user-2", {
    tokens: 85000,
    plan: "basic",
    blocked: false,
  })

  userUsage.set("user-3", {
    tokens: 310000,
    plan: "pro",
    blocked: true,
  })

  userUsage.set("user-4", {
    tokens: 750000,
    plan: "rad-plus",
    blocked: false,
  })

  isInitialized = true
  console.log("Demo data initialized successfully")
}

// Initialize on module load (only once)
initializeDemoData()

const blockedUsers: Set<string> = new Set(["user-3"])

export const trackTokenUsage = async (
  userId: string,
  email: string,
  displayName: string,
  tokenUsage: TokenUsage,
  model = "gpt-4o",
) => {
  const now = new Date()
  const today = now.toDateString()

  // Make sure user exists in our data
  if (!userUsage.has(userId)) {
    console.log(`Creating new user entry for ${userId}`)
    userUsage.set(userId, {
      tokens: 0,
      plan: "free",
      blocked: false,
    })
  }

  const user = userUsage.get(userId)!

  // Update usage
  user.tokens += tokenUsage.totalTokens

  console.log(`Token usage tracked for ${email}:`, {
    previousTokens: user.tokens - tokenUsage.totalTokens,
    newTokens: tokenUsage.totalTokens,
    totalTokens: user.tokens,
  })

  return user
}

export const isUserBlocked = (userId: string): boolean => {
  return blockedUsers.has(userId) || userUsage.get(userId)?.blocked || false
}

export const blockUser = (userId: string): void => {
  blockedUsers.add(userId)
  const user = userUsage.get(userId)
  if (user) {
    user.blocked = true
  }
  console.log(`User ${userId} blocked`)
}

export const unblockUser = (userId: string): void => {
  blockedUsers.delete(userId)
  const user = userUsage.get(userId)
  if (user) {
    user.blocked = false
  }
  console.log(`User ${userId} unblocked`)
}

export const resetUserUsage = (userId: string): void => {
  const user = userUsage.get(userId)
  if (user) {
    user.tokens = 0
    console.log(`Usage reset for user ${userId}`)
  } else {
    console.log(`User ${userId} not found for reset`)
  }
}

export const getAllUsers = (): UserUsage[] => {
  return Array.from(userUsage.entries())
    .map(([userId, { tokens, plan, blocked }]) => ({
      userId,
      email: "",
      displayName: "",
      totalTokensUsed: tokens,
      totalImpressions: 0,
      isBlocked: blocked,
      lastUsed: new Date(),
      createdAt: new Date(),
      tokensToday: 0,
      impressionsToday: 0,
      lastResetDate: new Date(),
      plan: plan,
    }))
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
}

export const getUserUsage = (userId: string): UserUsage | null => {
  const user = userUsage.get(userId)
  if (user) {
    console.log(`Getting usage for ${userId}:`, {
      totalTokens: user.tokens,
      totalImpressions: 0,
    })
  } else {
    console.log(`User ${userId} not found in usage data`)
  }
  return user
    ? {
        userId,
        email: "",
        displayName: "",
        totalTokensUsed: user.tokens,
        totalImpressions: 0,
        isBlocked: user.blocked,
        lastUsed: new Date(),
        createdAt: new Date(),
        tokensToday: 0,
        impressionsToday: 0,
        lastResetDate: new Date(),
        plan: user.plan,
      }
    : null
}

// History tracking
export interface ImpressionHistory {
  id: string
  userId: string
  findings: string
  impression: string
  tokenUsage: TokenUsage
  createdAt: Date
  model: string
}

const impressionHistory: ImpressionHistory[] = []

export const getUserHistory = (userId: string): ImpressionHistory[] => {
  return impressionHistory
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const addToHistory = (
  userId: string,
  findings: string,
  impression: string,
  tokenUsage: TokenUsage,
  model = "gpt-4o",
): void => {
  const historyItem: ImpressionHistory = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    findings,
    impression,
    tokenUsage,
    createdAt: new Date(),
    model,
  }

  impressionHistory.push(historyItem)
  console.log(`Added history item for ${userId}`)
}

export const updateUserPlan = (userId: string, plan: string): void => {
  const current = userUsage.get(userId)
  if (current) {
    userUsage.set(userId, {
      ...current,
      plan,
    })
    console.log(`User ${userId} plan updated to ${plan}`)
  } else {
    console.log(`User ${userId} not found for plan update`)
  }
}

export const setUserPlan = (userId: string, plan: string): void => {
  updateUserPlan(userId, plan)
}

export const changePlan = (userId: string, newPlan: string): void => {
  updateUserPlan(userId, newPlan)
}

export const canUserGenerate = (userId: string): boolean => {
  const usage = userUsage.get(userId)
  if (usage?.blocked) return false

  const limits = {
    free: 10,
    basic: 100,
    pro: 1000,
    premium: 10000,
  }

  return usage?.tokens < (limits[usage.plan as keyof typeof limits] || 10)
}
