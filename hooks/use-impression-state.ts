"use client"

import { useState } from "react"
import type { ImpressionHistory } from "@/lib/impression-types"

export function useImpressionState() {
  const [findings, setFindings] = useState("")
  const [impression, setImpression] = useState("")
  const [format, setFormat] = useState("short")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<ImpressionHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [userPlan, setUserPlan] = useState("free")
  const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0)

  const resetState = () => {
    setFindings("")
    setImpression("")
    setFormat("short")
    setIsGenerating(false)
  }

  const updateState = (
    newState: Partial<{
      findings: string
      impression: string
      format: string
      isGenerating: boolean
      history: ImpressionHistory[]
      isLoadingHistory: boolean
      activeTab: string
      userPlan: string
    }>,
  ) => {
    if (newState.findings !== undefined) setFindings(newState.findings)
    if (newState.impression !== undefined) setImpression(newState.impression)
    if (newState.format !== undefined) setFormat(newState.format)
    if (newState.isGenerating !== undefined) setIsGenerating(newState.isGenerating)
    if (newState.history !== undefined) setHistory(newState.history)
    if (newState.isLoadingHistory !== undefined) setIsLoadingHistory(newState.isLoadingHistory)
    if (newState.activeTab !== undefined) setActiveTab(newState.activeTab)
    if (newState.userPlan !== undefined) setUserPlan(newState.userPlan)
  }

  const triggerPlanRefresh = () => {
    setPlanRefreshTrigger((prev) => prev + 1)
  }

  return {
    // State values
    findings,
    impression,
    format,
    isGenerating,
    history,
    isLoadingHistory,
    activeTab,
    userPlan,
    planRefreshTrigger,

    // State setters
    setFindings,
    setImpression,
    setFormat,
    setIsGenerating,
    setHistory,
    setIsLoadingHistory,
    setActiveTab,
    setUserPlan,

    // Utility functions
    resetState,
    updateState,
    triggerPlanRefresh,
  }
}
