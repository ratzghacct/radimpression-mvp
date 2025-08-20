"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, History, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { PricingSection } from "@/components/pricing-section-notrequired"
import { PricingPopup } from "@/components/pricing-popup"
import { PricingPopupFull } from "@/components/pricing-popup-full"
import { TokenUsageWidget } from "@/components/token-usage-widget"
import { getAvailableFormats } from "@/lib/plan-features"

// Import modular components
import ImpressionHeader from "@/components/impression-header"
import ImpressionFindingsCard from "@/components/impression-findings-card"
import ImpressionResultCard from "@/components/impression-result-card"
import ImpressionHistoryTab from "@/components/impression-history-tab"

// Import hooks and utilities
import { useImpressionState } from "@/hooks/use-impression-state"
import { useImpressionEditor } from "@/hooks/use-impression-editor"
import { generateImpressionAPI, fetchHistoryAPI, handleAPIErrors } from "@/lib/impression-api"
import { processImpressionData } from "@/lib/impression-data"
import { copyToClipboard } from "@/lib/impression-utils"

export default function ImpressionPage() {
  const { user } = useAuth()
  const router = useRouter()

  // State management
  const {
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
  } = useImpressionState()

  // Editor management
  const { editorRef, undoStack, redoStack, applyFormatting, onEditorInput } = useImpressionEditor()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchHistory()
  }, [user, router])

  useEffect(() => {
    const availableFormats = getAvailableFormats(user)
    if (availableFormats.length > 0 && !availableFormats.find((f) => f.value === format)) {
      setFormat(availableFormats[0].value)
    }
  }, [user, format])

  const fetchHistory = async () => {
    try {
      const userId = user?.uid || user?.id || "demo-user"
      const data = await fetchHistoryAPI(userId)
      if (data.history) {
        setHistory(data.history)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  const generateImpression = async () => {
    if (!findings.trim()) {
      toast({
        title: "Missing Findings",
        description: "Please enter your radiology findings first.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate impressions.",
        variant: "destructive",
      })
      return
    }

    const userId = user.uid || user.id || "demo-user"
    const userEmail = user.email || "demo@radimpression.com"
    const userName = user.displayName || user.name || "Demo User"

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "Unable to identify user. Please try logging in again.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setImpression("")
    setTokenUsage(null)
    let data: any = null

    try {
      data = await generateImpressionAPI({
        findings: findings.trim(),
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        format: format,
      })

      if (data.blocked) {
        setShowPricingPopup(true)
        toast({
          title: "Account Suspended",
          description: "Your account has reached its usage limit. Please upgrade to continue.",
          variant: "destructive",
        })
        return
      }

      const processedData = processImpressionData(data)
      setImpression(processedData.impression)
      setTokenUsage(processedData.tokenUsage)
      setLastGeneratedAt(processedData.generatedAt)

      fetchHistory()

      toast({
        title: "Impression Generated!",
        description: `Used ${data.tokenUsage.totalTokens} tokens (${format} format)`,
      })
    } catch (error: any) {
      console.error("Error:", error)

      const errorInfo = handleAPIErrors(error, data)

      if (errorInfo.type === "tokenLimit") {
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive",
          duration: 10000,
        })
      } else if (errorInfo.type === "blocked") {
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive",
          duration: 10000,
        })
      } else {
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive",
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePurchase = async (planId: string, planName: string, price: string) => {
    try {
      router.push(`/payment-success?plan=${planId}&amount=${price}&name=${encodeURIComponent(planName)}`)

      toast({
        title: "Redirecting to Payment",
        description: `Processing ${planName} purchase...`,
      })
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyImpression = async (text: string) => {
    await copyToClipboard(text)
  }

  const handleFormat = (command: string, value?: string) => {
    applyFormatting(command, value, impression, setImpression)
  }

  const handleEditorInput = () => {
    onEditorInput(setImpression)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImpressionHeader user={user} onShowFullPricing={() => setShowFullPricing(true)} />

        {showPricing && (
          <div className="mb-8">
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-blue-900">Pricing Plans</CardTitle>
                  {/* Button variant="ghost" onClick={() => setShowPricing(false)} className="text-gray-500">
                    ✕
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <PricingSection />
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate Impression</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History ({history.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImpressionFindingsCard
                findings={findings}
                format={format}
                isGenerating={isGenerating}
                user={user}
                onFindingsChange={setFindings}
                onFormatChange={setFormat}
                onGenerate={generateImpression}
              />

              <ImpressionResultCard
                impression={impression}
                tokenUsage={tokenUsage}
                lastGeneratedAt={lastGeneratedAt}
                isGenerating={isGenerating}
                format={format}
                editorRef={editorRef}
                undoStack={undoStack}
                redoStack={redoStack}
                onCopy={() => handleCopyImpression(impression)}
                onUndo={() => editorRef.current?.undo()}
                onRedo={() => editorRef.current?.redo()}
                onFormat={handleFormat}
                onEditorInput={handleEditorInput}
              />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ImpressionHistoryTab
              history={history}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onCopyImpression={handleCopyImpression}
              onSwitchToGenerate={() => setActiveTab("generate")}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-6">
          <TokenUsageWidget userId={user?.uid || ""} refreshTrigger={impression ? Date.now() : 0} />

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-700 leading-relaxed">
                  <strong>Disclaimer:</strong> The impressions generated by this tool are powered by AI based on the
                  input findings provided by the user. These outputs are intended for assistance and productivity
                  enhancement only.
                  <br />
                  <br />
                  They are not a substitute for professional medical judgment, diagnosis, or decision-making. Users must
                  independently verify all AI-generated content before using it in any official medical documentation,
                  communication, or reporting.
                  <br />
                  <br />
                  The tool's developers disclaim all liability for clinical use, interpretation errors, or patient
                  outcomes resulting from reliance on AI-generated impressions.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <PricingPopup isOpen={showPricingPopup} onClose={() => setShowPricingPopup(false)} />
        <PricingPopupFull
          isOpen={showFullPricing}
          onClose={() => setShowFullPricing(false)}
          onPurchase={handlePurchase}
        />
      </div>
    </div>
  )
}
