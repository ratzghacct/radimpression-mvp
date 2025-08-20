"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Sparkles, RefreshCw, FileCheck, Zap } from "lucide-react"
import { getAvailableFormats, hasFeatureAccess } from "@/lib/plan-features"

interface User {
  uid?: string
  id?: string
  email?: string
  displayName?: string
  name?: string
}

interface FindingsCardProps {
  findings: string
  format: string
  isGenerating: boolean
  user: User
  onFindingsChange: (value: string) => void
  onFormatChange: (value: string) => void
  onGenerate: () => void
}

function FindingsTextarea({
  findings,
  isGenerating,
  onFindingsChange,
}: {
  findings: string
  isGenerating: boolean
  onFindingsChange: (value: string) => void
}) {
  return (
    <Textarea
      placeholder="Enter your radiology findings here... 

Example:
- Chest X-ray shows clear lung fields bilaterally
- No acute cardiopulmonary abnormalities
- Heart size within normal limits
- No pleural effusion or pneumothorax"
      value={findings}
      onChange={(e) => onFindingsChange(e.target.value)}
      className="min-h-[250px] medical-focus medical-transition"
      disabled={isGenerating}
    />
  )
}

function FormatSelector({
  format,
  user,
  onFormatChange,
}: {
  format: string
  user: User
  onFormatChange: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Impression Format:</Label>
      <RadioGroup value={format} onValueChange={onFormatChange} className="flex space-x-6">
        {getAvailableFormats(user).map((formatOption) => (
          <div key={formatOption.value} className="flex items-center space-x-2">
            <RadioGroupItem value={formatOption.value} id={formatOption.value} />
            <Label htmlFor={formatOption.value} className="flex items-center space-x-2 cursor-pointer">
              {formatOption.icon === "fileCheck" && <FileCheck className="w-4 h-4 text-blue-600" />}
              {formatOption.icon === "zap" && <Zap className="w-4 h-4 text-green-600" />}
              <span>{formatOption.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="text-xs text-gray-500">
        {format === "formal"
          ? "Professional, detailed impression suitable for radiology reports"
          : "Concise, minimal impression with core findings only"}
        {!hasFeatureAccess(user, "formalImpression") && (
          <div className="mt-1 text-amber-600">
            <strong>Note:</strong> Formal impressions are available with Pro and Rad Plus plans.
          </div>
        )}
      </div>
    </div>
  )
}

function GenerateButton({
  isGenerating,
  findings,
  format,
  onGenerate,
}: {
  isGenerating: boolean
  findings: string
  format: string
  onGenerate: () => void
}) {
  return (
    <Button
      onClick={onGenerate}
      disabled={isGenerating || !findings.trim()}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 medical-transition"
    >
      {isGenerating ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Generating {format} Impression...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate {format === "formal" ? "Formal" : "Short"} AI Impression
        </>
      )}
    </Button>
  )
}

export default function ImpressionFindingsCard({
  findings,
  format,
  isGenerating,
  user,
  onFindingsChange,
  onFormatChange,
  onGenerate,
}: FindingsCardProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>Radiology Findings</span>
        </CardTitle>
        <CardDescription>Enter your radiology findings below</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FindingsTextarea findings={findings} isGenerating={isGenerating} onFindingsChange={onFindingsChange} />

        <FormatSelector format={format} user={user} onFormatChange={onFormatChange} />

        <GenerateButton isGenerating={isGenerating} findings={findings} format={format} onGenerate={onGenerate} />
      </CardContent>
    </Card>
  )
}
