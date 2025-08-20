export interface PlanFeatures {
  formats: string[]
  tokenLimit: number
  name: string
}

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    formats: ["short"],
    tokenLimit: 10000,
    name: "Free",
  },
  basic: {
    formats: ["short"],
    tokenLimit: 50000,
    name: "Basic",
  },
  pro: {
    formats: ["short", "formal"],
    tokenLimit: 200000,
    name: "Pro",
  },
  "rad-plus": {
    formats: ["short", "formal"],
    tokenLimit: 1000000,
    name: "Rad Plus",
  },
}

export function hasFeatureAccess(plan: string, feature: string): boolean {
  const planFeatures = PLAN_FEATURES[plan?.toLowerCase()] || PLAN_FEATURES.free
  return planFeatures.formats.includes(feature)
}

export function getAvailableFormats(plan: string): string[] {
  const planFeatures = PLAN_FEATURES[plan?.toLowerCase()] || PLAN_FEATURES.free
  return planFeatures.formats
}

export function getPlanName(plan: string): string {
  const planFeatures = PLAN_FEATURES[plan?.toLowerCase()] || PLAN_FEATURES.free
  return planFeatures.name
}

export async function refreshUserPlan(userId: string): Promise<string> {
  try {
    const response = await fetch(`/api/user-plan?userId=${userId}`)
    const data = await response.json()

    if (data.success) {
      return data.plan
    }

    return "free" // fallback
  } catch (error) {
    console.error("Error refreshing user plan:", error)
    return "free" // fallback
  }
}
