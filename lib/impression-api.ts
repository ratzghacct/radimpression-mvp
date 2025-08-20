import type { GenerationRequest } from "./impression-types"

export const generateImpressionAPI = async (request: GenerationRequest) => {
  const response = await fetch("/api/generate-impression", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate impression")
  }

  return data
}

export const fetchHistoryAPI = async (userId: string) => {
  const response = await fetch("/api/history", {
    headers: {
      "x-user-id": userId,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Failed to fetch history")
  }

  return data
}

export const handleAPIErrors = (error: any, data: any) => {
  if (data?.tokenLimitReached) {
    return {
      type: "tokenLimit",
      title: "Token Limit Reached!",
      description: `You've used ${data.usage.used.toLocaleString()} of ${data.usage.limit.toLocaleString()} tokens. Please upgrade your plan to continue.`,
    }
  } else if (data?.blocked) {
    return {
      type: "blocked",
      title: "Account Suspended",
      description: "Your account has been temporarily suspended. Please contact support.",
    }
  } else {
    return {
      type: "general",
      title: "Generation Failed",
      description: error.message || "Failed to generate impression. Please try again.",
    }
  }
}

export const validateAPIResponse = (data: any) => {
  return data && data.impression && data.tokenUsage
}
