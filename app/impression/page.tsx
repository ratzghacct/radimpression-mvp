"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImpressionHeader } from "@/components/impression-header"
import { ImpressionFindingsCard } from "@/components/impression-findings-card"
import { ImpressionResultCard } from "@/components/impression-result-card"
import { ImpressionHistoryTab } from "@/components/impression-history-tab"
import { useImpressionState } from "@/hooks/use-impression-state"
import { useImpressionEditor } from "@/hooks/use-impression-editor"
import { generateImpressionAPI } from "@/lib/impression-api"
import { fetchHistoryData } from "@/lib/impression-data"
import { refreshUserPlan, getAvailableFormats } from "@/lib/plan-features"

export default function ImpressionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const {
    findings,
    impression,
    format,
    isGenerating,
    history,
    isLoadingHistory,
    activeTab,
    userPlan,
    planRefreshTrigger,
    setFindings,
    setImpression,
    setFormat,
    setIsGenerating,
    setHistory,
    setIsLoadingHistory,
    setActiveTab,
    setUserPlan,
    updateState,
  } = useImpressionState()

  const { editorRef, undoStack, redoStack, canUndo, canRedo, handleUndo, handleRedo, applyFormatting } =
    useImpressionEditor(impression, setImpression)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Refresh user plan on mount and periodically
  useEffect(() => {
    if (user?.uid) {
      const refreshPlan = async () => {
        const freshPlan = await refreshUserPlan(user.uid)
        setUserPlan(freshPlan)
      }

      refreshPlan()

      // Refresh every 30 seconds
      const interval = setInterval(refreshPlan, 30000)

      return () => clearInterval(interval)
    }
  }, [user?.uid, planRefreshTrigger, setUserPlan])

  // Refresh plan when window gains focus (user returns from admin)
  useEffect(() => {
    const handleFocus = async () => {
      if (user?.uid) {
        const freshPlan = await refreshUserPlan(user.uid)
        setUserPlan(freshPlan)
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [user?.uid, setUserPlan])

  // Auto-adjust format if user loses access
  useEffect(() => {
    const availableFormats = getAvailableFormats(userPlan)
    if (!availableFormats.includes(format)) {
      setFormat(availableFormats[0] || "short")
    }
  }, [userPlan, format, setFormat])

  // Load history when switching to history tab
  useEffect(() => {
    if (activeTab === "history" && user?.uid && history.length === 0) {
      fetchHistoryData(user.uid, setHistory, setIsLoadingHistory)
    }
  }, [activeTab, user?.uid, history.length, setHistory, setIsLoadingHistory])

  const handleGenerate = async () => {
    if (!findings.trim() || !user?.uid) return

    setIsGenerating(true)
    try {
      const result = await generateImpressionAPI(findings, format, user.uid)
      setImpression(result)

      // Refresh history after generating
      if (activeTab === "history") {
        fetchHistoryData(user.uid, setHistory, setIsLoadingHistory)
      }
    } catch (error) {
      console.error("Error generating impression:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ImpressionHeader />

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Impression</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImpressionFindingsCard
                findings={findings}
                setFindings={setFindings}
                format={format}
                setFormat={setFormat}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
                userPlan={userPlan}
              />

              <ImpressionResultCard
                impression={impression}
                editorRef={editorRef}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onFormat={applyFormatting}
              />
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
              <p>
                This tool is for educational purposes only and should not replace professional medical judgment. Always
                consult with qualified healthcare professionals for patient care decisions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ImpressionHistoryTab history={history} isLoading={isLoadingHistory} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
