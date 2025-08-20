"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { getAvailableFormats, hasFeatureAccess, getPlanName } from "@/lib/plan-features"

interface ImpressionFindingsCardProps {
  findings: string
  setFindings: (value: string) => void
  format: string
  setFormat: (value: string) => void
  isGenerating: boolean
  onGenerate: () => void
  userPlan: string
}

export function ImpressionFindingsCard({
  findings,
  setFindings,
  format,
  setFormat,
  isGenerating,
  onGenerate,
  userPlan,
}: ImpressionFindingsCardProps) {
  const availableFormats = getAvailableFormats(userPlan)
  const planName = getPlanName(userPlan)

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Clinical Findings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your clinical findings here..."
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          className="min-h-[200px] resize-none"
        />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Format</Label>
          <RadioGroup value={format} onValueChange={setFormat}>
            {availableFormats.includes("short") && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short">Short</Label>
              </div>
            )}
            {availableFormats.includes("formal") && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="formal" />
                <Label htmlFor="formal">Formal</Label>
              </div>
            )}
          </RadioGroup>

          {!hasFeatureAccess(userPlan, "formal") && (
            <p className="text-sm text-muted-foreground">
              Formal format is available for Pro and Rad Plus plans. Current plan: {planName}
            </p>
          )}
        </div>

        <Button onClick={onGenerate} disabled={!findings.trim() || isGenerating} className="w-full">
          {isGenerating ? (
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
  )
}
