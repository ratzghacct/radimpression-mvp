"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, FileText, Zap, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export default function ImpressionPage() {
  const [findings, setFindings] = useState("")
  const [format, setFormat] = useState("standard")
  const [impression, setImpression] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokensUsed, setTokensUsed] = useState(0)
  const { user } = useAuth()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!findings.trim()) {
      toast({
        title: "Error",
        description: "Please enter your findings",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-impression", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ findings, format }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate impression")
      }

      const data = await response.json()
      setImpression(data.impression)
      setTokensUsed(data.tokensUsed)

      toast({
        title: "Success",
        description: "Impression generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate impression",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFindings("")
    setImpression("")
    setTokensUsed(0)
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Impression</h1>
              <p className="text-gray-600">AI-powered medical impression generation</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>{tokensUsed} tokens used</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Clinical Findings</span>
              </CardTitle>
              <CardDescription>Enter the imaging findings or clinical observations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Findings</label>
                <Textarea
                  placeholder="Enter your clinical findings here..."
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleGenerate} disabled={loading || !findings.trim()} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Impression
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={loading}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Generated Impression</span>
              </CardTitle>
              <CardDescription>AI-generated medical impression based on your findings</CardDescription>
            </CardHeader>
            <CardContent>
              {impression ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-800 whitespace-pre-wrap">{impression}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Format: {format}</span>
                    <span>Tokens: {tokensUsed}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Your generated impression will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
