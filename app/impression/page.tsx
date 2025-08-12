"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImpressionPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [findings, setFindings] = useState("")
  const [impression, setImpression] = useState("")
  const [format, setFormat] = useState("standard")
  const [loading, setLoading] = useState(false)

  const generateImpression = async () => {
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
        body: JSON.stringify({
          findings,
          format,
        }),
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
            tokensUsed: data.tokensUsed,
          }),
        })
      }

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to generate impressions.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Medical Impression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
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

            <div>
              <label className="block text-sm font-medium mb-2">Findings</label>
              <Textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Enter your imaging findings here..."
                rows={6}
              />
            </div>

            <Button onClick={generateImpression} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Impression"
              )}
            </Button>

            {impression && (
              <div>
                <label className="block text-sm font-medium mb-2">Generated Impression</label>
                <Textarea value={impression} readOnly rows={8} className="bg-gray-50" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
