import type { UserUsage } from "./admin-types"

export const PLAN_LIMITS = {
  free: 10000,
  basic: 50000,
  pro: 200000,
  "rad-plus": 1000000,
}

export const PLAN_OPTIONS = [
  { value: "free", label: "Free Plan", limit: "10K tokens" },
  { value: "basic", label: "Basic Plan", limit: "50K tokens" },
  { value: "pro", label: "Pro Plan", limit: "200K tokens" },
  { value: "rad-plus", label: "Rad Plus Plan", limit: "1M tokens" },
]

export const calculateUsagePercentage = (tokensUsed: number, plan: string): number => {
  const planLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  return (tokensUsed / planLimit) * 100
}

export const filterRealUsers = (users: UserUsage[], currentUserEmail: string): UserUsage[] => {
  return users.filter((userData: UserUsage) => {
    // Remove dummy users by email patterns and only show users with actual usage
    const isDummyUser =
      userData.email.includes("@medical.edu") ||
      userData.email.includes("@hospital.com") ||
      userData.email.includes("@clinic.org") ||
      (userData.displayName.startsWith("Dr. ") && userData.totalTokensUsed === 0)

    // Only show current user or users with actual usage (not dummy data)
    return (
      !isDummyUser &&
      (userData.email === currentUserEmail || userData.totalTokensUsed > 0 || userData.totalImpressions > 0)
    )
  })
}

export const formatUserData = (userData: UserUsage) => {
  const currentPlan = userData.plan || "free"
  const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  const usagePercentage = calculateUsagePercentage(userData.totalTokensUsed, currentPlan)

  return {
    ...userData,
    currentPlan,
    planLimit,
    usagePercentage,
  }
}
