"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TokenUsageWidget } from "@/components/token-usage-widget"

export default function ImpressionPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [findings, setFindings] = useState("")
  const [impression, setImpression] = useState("")
  const [format, setFormat] = useState("standard")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!findings.trim()) {
      toast({
        title: "Error",
        description: "Please enter your findings first.",
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate impression")
      }

      setImpression(data.impression)

      // Save to history
      if (user?.email) {
        await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            findings,
            impression: data.impression,
            format,
          }),
        })
      }

      toast({
        title: "Success",
        description: "Impression generated successfully!",
      })
    } catch (error) {
      console.error("Error generating impression:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate impression",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(impression)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Impression copied to clipboard!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to generate impressions.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Generate Medical Impression</h1>
        <p className="text-muted-foreground">
          Enter your imaging findings to generate a professional medical impression.
        </p>
      </div>

      <div className="mb-6">
        <TokenUsageWidget />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Imaging Findings</CardTitle>
            <CardDescription>Enter the radiological findings from your imaging study</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter your imaging findings here..."
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={handleGenerate} disabled={loading || !findings.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Impression"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Medical Impression
              {impression && (
                <Button variant="outline" size="sm" onClick={handleCopy} className="ml-2 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardTitle>
            <CardDescription>AI-generated medical impression based on your findings</CardDescription>
          </CardHeader>
          <CardContent>
            {impression ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{format}</Badge>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{impression}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Your generated impression will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
