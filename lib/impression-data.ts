import type { ImpressionHistory } from "./impression-types"

export const processImpressionData = (data: any) => {
  return {
    impression: data.impression,
    tokenUsage: data.tokenUsage,
    generatedAt: new Date(),
  }
}

export const updateHistoryData = (currentHistory: ImpressionHistory[], newData: any) => {
  // History will be refreshed from API, so we return current state
  return currentHistory
}

export const filterHistoryData = (history: ImpressionHistory[], searchTerm: string) => {
  if (!searchTerm) return history

  return history.filter(
    (item) =>
      item.findings.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.impression.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

export const formatDisplayData = (history: ImpressionHistory[]) => {
  return history.map((item) => ({
    ...item,
    formattedDate: new Date(item.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    formattedCost: item.tokenUsage.cost.toFixed(4),
  }))
}
