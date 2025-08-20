"use client"

import { useState } from "react"
import type { ImpressionHistory, TokenUsage } from "@/lib/impression-types"

export const useImpressionState = () => {
  const [findings, setFindings] = useState("")
  const [impression, setImpression] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)
  const [history, setHistory] = useState<ImpressionHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [showFullPricing, setShowFullPricing] = useState(false)
  const [showPricingPopup, setShowPricingPopup] = useState(false)
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null)
  const [showPricing, setShowPricing] = useState(false)
  const [format, setFormat] = useState("formal")

  const resetState = () => {
    setFindings("")
    setImpression("")
    setIsGenerating(false)
    setTokenUsage(null)
    setLastGeneratedAt(null)
    setFormat("formal")
  }

  const validateState = () => {
    return {
      hasFindings: findings.trim().length > 0,
      canGenerate: !isGenerating && findings.trim().length > 0,
    }
  }

  return {
    // State values
    findings,
    impression,
    isGenerating,
    tokenUsage,
    history,
    searchTerm,
    activeTab,
    showFullPricing,
    showPricingPopup,
    lastGeneratedAt,
    showPricing,
    format,

    // State setters
    setFindings,
    setImpression,
    setIsGenerating,
    setTokenUsage,
    setHistory,
    setSearchTerm,
    setActiveTab,
    setShowFullPricing,
    setShowPricingPopup,
    setLastGeneratedAt,
    setShowPricing,
    setFormat,

    // Utility functions
    resetState,
    validateState,
  }
}
