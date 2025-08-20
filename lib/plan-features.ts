// Plan-based feature access control
// This file manages what features are available for each subscription plan

export interface PlanFeatures {
  formalImpression: boolean
  shortImpression: boolean
  // Future features can be added here
  // advancedAnalytics: boolean
  // prioritySupport: boolean
}

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    formalImpression: false,
    shortImpression: true,
  },
  basic: {
    formalImpression: false,
    shortImpression: true,
  },
  pro: {
    formalImpression: true,
    shortImpression: true,
  },
  radplus: {
    formalImpression: true,
    shortImpression: true,
  },
}

export const getUserPlan = (user: any): string => {
  // Get user's plan from user object or default to free
  // This assumes the plan is stored in user object from admin updates
  return user?.plan?.toLowerCase() || "free"
}

export const hasFeatureAccess = (user: any, feature: keyof PlanFeatures): boolean => {
  const userPlan = getUserPlan(user)
  const planFeatures = PLAN_FEATURES[userPlan] || PLAN_FEATURES.free

  return planFeatures[feature] || false
}

export const getAvailableFormats = (user: any): Array<{ value: string; label: string; icon: string }> => {
  const formats = []

  // Short format is available for all plans
  if (hasFeatureAccess(user, "shortImpression")) {
    formats.push({
      value: "short",
      label: "Short",
      icon: "zap",
    })
  }

  // Formal format only for Pro and Rad Plus
  if (hasFeatureAccess(user, "formalImpression")) {
    formats.push({
      value: "formal",
      label: "Formal",
      icon: "fileCheck",
    })
  }

  return formats
}
