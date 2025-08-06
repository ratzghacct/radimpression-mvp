"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Copy, FileText, Loader2, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface ImpressionHistory {
  id: string
  userId: string
  findings: string
  impression: string
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost: number
  }
  createdAt: Date
  model: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ImpressionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchHistory()
  }, [user, router])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history", {
        headers: {
          "x-user-id": user?.uid || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Impression copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const filteredHistory = history.filter(
    (item) =>
      item.findings.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.impression.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Impression History</h1>
              <p className="text-gray-600">View your previous AI-generated impressions</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-700">
            <FileText className="w-4 h-4 mr-1" />
            {filteredHistory.length} Impressions
          </Badge>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your impressions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Impressions Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No impressions match your search." : "You haven't generated any impressions yet."}
              </p>
              <Button onClick={() => router.push("/impression")} className="bg-blue-600 hover:bg-blue-700">
                Generate Your First Impression
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardTitle>
                        <CardDescription>
                          {item.tokenUsage.totalTokens} tokens • ${item.tokenUsage.cost.toFixed(4)} • {item.model}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.impression)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Findings:</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">{item.findings}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Impression:</h4>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap">
                      {item.impression}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
