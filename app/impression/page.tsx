"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function ImpressionPage() {
  const [findings, setFindings] = useState("")
  const [format, setFormat] = useState("standard")
  const [impression, setImpression] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!findings.trim()) {
      toast({
        title: "Error",
        description: "Please enter your findings first.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to generate impressions.",
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
        body: JSON.stringify({
          findings,
          format,
          userId: user.uid,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate impression")
      }

      setImpression(data.impression)
      toast({
        title: "Success",
        description: "Impression generated successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate Medical Impression</h1>
        <p className="text-muted-foreground">
          Enter your radiological findings and get an AI-generated professional impression.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Findings</CardTitle>
            <CardDescription>Enter the radiological findings you want to generate an impression for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your radiological findings here..."
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="min-h-[200px]"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="formal">Formal (2 tokens)</SelectItem>
                  <SelectItem value="short">Short (1 token)</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              Generated Impression
              {impression && (
                <Button variant="outline" size="sm" onClick={handleCopy} className="ml-2 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardTitle>
            <CardDescription>Your AI-generated medical impression will appear here.</CardDescription>
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
                Enter findings and click generate to see your impression here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
