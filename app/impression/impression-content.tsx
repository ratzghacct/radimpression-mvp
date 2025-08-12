"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Copy,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  History,
  AlertTriangle,
  Brain,
  ArrowLeft,
  LogOut,
} from "lucide-react"
import { toast } from "sonner"
import { TokenUsageWidget } from "@/components/token-usage-widget"
import { PricingPopup } from "@/components/pricing-popup"

interface GeneratedImpression {
  id: string
  findings: string
  impression: string
  format: string
  timestamp: Date
}

export default function ImpressionPageContent() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [findings, setFindings] = useState("")
  const [impression, setImpression] = useState("")
  const [format, setFormat] = useState("formal")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<GeneratedImpression[]>([])
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [showPricing, setShowPricing] = useState(false)
  const [usageData, setUsageData] = useState({ used: 0, limit: 100 })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUsageData()
      fetchHistory()
    }
  }, [user])

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/user-usage", {
        headers: {
          "x-user-id": user?.uid || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsageData(data)
      }
    } catch (error) {
      console.error("Error fetching usage data:", error)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history", {
        headers: {
          "x-user-id": user?.uid || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  const handleGenerate = async () => {
    if (!findings.trim()) {
      toast.error("Please enter your findings first")
      return
    }

    if (usageData.used >= usageData.limit) {
      setShowPricing(true)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-impression", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          findings,
          format,
          userId: user?.uid,
          userEmail: user?.email,
          userName: user?.displayName || user?.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 429) {
          setShowPricing(true)
          return
        }
        throw new Error(errorData.error || "Failed to generate impression")
      }

      const data = await response.json()

      // Save current impression to undo stack
      if (impression) {
        setUndoStack((prev) => [...prev, impression])
        setRedoStack([])
      }

      setImpression(data.impression)

      // Add to history
      const newImpression: GeneratedImpression = {
        id: Date.now().toString(),
        findings,
        impression: data.impression,
        format,
        timestamp: new Date(),
      }
      setHistory((prev) => [newImpression, ...prev])

      // Update usage data
      await fetchUsageData()

      toast.success("Impression generated successfully!")
    } catch (error) {
      console.error("Error generating impression:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate impression")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(impression)
    toast.success("Impression copied to clipboard!")
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastImpression = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [impression, ...prev])
      setImpression(lastImpression)
      setUndoStack((prev) => prev.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextImpression = redoStack[0]
      setUndoStack((prev) => [...prev, impression])
      setImpression(nextImpression)
      setRedoStack((prev) => prev.slice(1))
    }
  }

  const formatText = (type: "bold" | "italic" | "underline") => {
    const textarea = document.querySelector("textarea[data-impression]") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = impression.substring(start, end)

    if (selectedText) {
      let formattedText = selectedText
      switch (type) {
        case "bold":
          formattedText = `**${selectedText}**`
          break
        case "italic":
          formattedText = `*${selectedText}*`
          break
        case "underline":
          formattedText = `<u>${selectedText}</u>`
          break
      }

      const newImpression = impression.substring(0, start) + formattedText + impression.substring(end)
      setImpression(newImpression)
    }
  }

  const alignText = (alignment: "left" | "center" | "right") => {
    const lines = impression.split("\n")
    const formattedLines = lines.map((line) => {
      // Remove existing alignment
      const cleanLine = line.replace(/^<div style="text-align: (left|center|right);">|<\/div>$/g, "")

      if (alignment === "left") {
        return cleanLine
      } else {
        return `<div style="text-align: ${alignment};">${cleanLine}</div>`
      }
    })

    setImpression(formattedLines.join("\n"))
  }

  const loadFromHistory = (item: GeneratedImpression) => {
    setFindings(item.findings)
    setImpression(item.impression)
    setFormat(item.format)
    toast.success("Loaded from history")
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">RadImpression</h1>
                  <p className="text-xs text-gray-600">AI Impression Generator</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TokenUsageWidget used={usageData.used} limit={usageData.limit} />
              <Badge className="bg-blue-100 text-blue-700">{user.displayName || user.email}</Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Findings</CardTitle>
                <CardDescription>Enter the clinical findings from your radiology report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter clinical findings here..."
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="format" className="text-sm font-medium">
                      Format:
                    </label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleGenerate} disabled={isGenerating || !findings.trim()} className="ml-auto">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Impression"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Impression */}
            {impression && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Impression</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
                        <Undo className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                        <Redo className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="outline" size="sm" onClick={() => formatText("bold")}>
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => formatText("italic")}>
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => formatText("underline")}>
                        <Underline className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="outline" size="sm" onClick={() => alignText("left")}>
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alignText("center")}>
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alignText("right")}>
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button onClick={handleCopy} size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    data-impression
                    value={impression}
                    onChange={(e) => setImpression(e.target.value)}
                    className="min-h-[200px] resize-none font-mono"
                  />

                  {/* Disclaimer */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Important Disclaimer</p>
                        <p>
                          This AI-generated impression is for educational and reference purposes only. Always verify
                          with clinical correlation and professional medical judgment. Do not use as a substitute for
                          professional medical diagnosis.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* History Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent History
                </CardTitle>
                <CardDescription>Your recently generated impressions</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No impressions generated yet</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {history.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.format}
                          </Badge>
                          <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.findings.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.impression.substring(0, 80)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Popup */}
      <PricingPopup isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  )
}
