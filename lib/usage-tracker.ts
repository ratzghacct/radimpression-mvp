import { type UserUsage, type TokenUsage, calculateCost } from "./admin"

// In-memory storage for demo (replace with database in production)
let userUsageData: Record<string, UserUsage> = {}
let isInitialized = false

// Initialize demo data only once
const initializeDemoData = () => {
  if (isInitialized) {
    console.log("Demo data already initialized, skipping...")
    return
  }

  console.log("Initializing demo data for the first time...")
  
  userUsageData = {
    // Demo user starts with 0 usage
    "demo-user": {
      userId: "demo-user",
      email: "demo@radimpression.com",
      displayName: "Dr. Demo User",
      totalTokensUsed: 0,
      totalImpressions: 0,
      isBlocked: false,
      lastUsed: new Date(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      tokensToday: 0,
      impressionsToday: 0,
      lastResetDate: new Date(),
      plan: "free",
    },
    // Other demo users with existing data
    "user-2": {
      userId: "user-2",
      email: "dr.smith@hospital.com",
      displayName: "Dr. Sarah Smith",
      totalTokensUsed: 85000,
      totalImpressions: 67,
      isBlocked: false,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      tokensToday: 5670,
      impressionsToday: 8,
      lastResetDate: new Date(),
      plan: "basic",
    },
    "user-3": {
      userId: "user-3",
      email: "dr.johnson@clinic.org",
      displayName: "Dr. Michael Johnson",
      totalTokensUsed: 310000,
      totalImpressions: 134,
      isBlocked: true,
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      tokensToday: 0,
      impressionsToday: 0,
      lastResetDate: new Date(),
      plan: "pro",
    },
    "user-4": {
      userId: "user-4",
      email: "dr.wilson@medical.edu",
      displayName: "Dr. Emily Wilson",
      totalTokensUsed: 750000,
      totalImpressions: 450,
      isBlocked: false,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tokensToday: 3420,
      impressionsToday: 5,
      lastResetDate: new Date(),
      plan: "rad-plus",
    },
  }

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
  if (!userUsageData[userId]) {
    console.log(`Creating new user entry for ${userId}`)
    userUsageData[userId] = {
      userId,
      email,
      displayName,
      totalTokensUsed: 0,
      totalImpressions: 0,
      isBlocked: false,
      lastUsed: now,
      createdAt: now,
      tokensToday: 0,
      impressionsToday: 0,
      lastResetDate: now,
      plan: "free",
    }
  }

  const user = userUsageData[userId]

  // Reset daily counters if new day
  if (user.lastResetDate.toDateString() !== today) {
    user.tokensToday = 0
    user.impressionsToday = 0
    user.lastResetDate = now
  }

  // Update usage
  const previousTokens = user.totalTokensUsed
  user.totalTokensUsed += tokenUsage.totalTokens
  user.totalImpressions += 1
  user.tokensToday += tokenUsage.totalTokens
  user.impressionsToday += 1
  user.lastUsed = now

  console.log(`Token usage tracked for ${email}:`, {
    previousTokens,
    newTokens: tokenUsage.totalTokens,
    totalTokens: user.totalTokensUsed,
    totalImpressions: user.totalImpressions,
  })

  return user
}

export const isUserBlocked = (userId: string): boolean => {
  return blockedUsers.has(userId) || userUsageData[userId]?.isBlocked || false
}

export const blockUser = (userId: string): void => {
  blockedUsers.add(userId)
  if (userUsageData[userId]) {
    userUsageData[userId].isBlocked = true
  }
  console.log(`User ${userId} blocked`)
}

export const unblockUser = (userId: string): void => {
  blockedUsers.delete(userId)
  if (userUsageData[userId]) {
    userUsageData[userId].isBlocked = false
  }
  console.log(`User ${userId} unblocked`)
}

export const resetUserUsage = (userId: string): void => {
  if (userUsageData[userId]) {
    userUsageData[userId].totalTokensUsed = 0
    userUsageData[userId].totalImpressions = 0
    userUsageData[userId].tokensToday = 0
    userUsageData[userId].impressionsToday = 0
    userUsageData[userId].lastResetDate = new Date()
    console.log(`Usage reset for user ${userId}`)
  } else {
    console.log(`User ${userId} not found for reset`)
  }
}

export const getAllUsers = (): UserUsage[] => {
  return Object.values(userUsageData).sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
}

export const getUserUsage = (userId: string): UserUsage | null => {
  const user = userUsageData[userId]
  if (user) {
    console.log(`Getting usage for ${userId}:`, {
      totalTokens: user.totalTokensUsed,
      totalImpressions: user.totalImpressions,
    })
  } else {
    console.log(`User ${userId} not found in usage data`)
  }
  return user || null
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
  if (userUsageData[userId]) {
    userUsageData[userId].plan = plan
    console.log(`User ${userId} plan updated to ${plan}`)
  } else {
    console.log(`User ${userId} not found for plan update`)
  }
}
// ADD THESE MISSING FUNCTIONS:
export const setUserPlan = (userId: string, plan: string): void => {
  updateUserPlan(userId, plan)
}

export const changePlan = (userId: string, newPlan: string): void => {
  updateUserPlan(userId, newPlan)
}
