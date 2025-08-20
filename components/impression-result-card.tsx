"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Copy,
  RefreshCw,
  Clock,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"
import type { TokenUsage } from "@/lib/impression-types"

interface ResultCardProps {
  impression: string
  tokenUsage: TokenUsage | null
  lastGeneratedAt: Date | null
  isGenerating: boolean
  format: string
  editorRef: React.RefObject<HTMLDivElement>
  undoStack: string[]
  redoStack: string[]
  onCopy: () => void
  onUndo: () => void
  onRedo: () => void
  onFormat: (command: string, value?: string) => void
  onEditorInput: () => void
}

function ResultHeader({
  impression,
  tokenUsage,
  lastGeneratedAt,
  onCopy,
}: {
  impression: string
  tokenUsage: TokenUsage | null
  lastGeneratedAt: Date | null
  onCopy: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>AI-Generated Impression</span>
          {tokenUsage?.format && (
            <Badge variant="outline" className="ml-2">
              {tokenUsage.format === "formal" ? "Formal" : "Short"}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Professional radiology impression</CardDescription>
        {lastGeneratedAt && (
          <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              Last generated: {lastGeneratedAt.toLocaleDateString()} at {lastGeneratedAt.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      {impression && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
      )}
    </div>
  )
}

function FormattingToolbar({
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  onFormat,
}: {
  undoStack: string[]
  redoStack: string[]
  onUndo: () => void
  onRedo: () => void
  onFormat: (command: string, value?: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={undoStack.length === 0}
        className="h-8 px-2 hover:bg-blue-50 bg-transparent"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={redoStack.length === 0}
        className="h-8 px-2 hover:bg-blue-50 bg-transparent"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("bold")}
        className="h-8 px-2 hover:bg-blue-50 font-bold"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("italic")}
        className="h-8 px-2 hover:bg-blue-50 italic"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("underline")}
        className="h-8 px-2 hover:bg-blue-50 underline"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("justifyLeft")}
        className="h-8 px-2 hover:bg-blue-50"
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("justifyCenter")}
        className="h-8 px-2 hover:bg-blue-50"
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFormat("justifyRight")}
        className="h-8 px-2 hover:bg-blue-50"
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <select
        onChange={(e) => onFormat("fontSize", e.target.value)}
        className="h-8 px-2 border rounded hover:bg-blue-50 text-sm bg-white"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
      </select>
    </div>
  )
}

function EditableContent({
  impression,
  editorRef,
  onEditorInput,
}: {
  impression: string
  editorRef: React.RefObject<HTMLDivElement>
  onEditorInput: () => void
}) {
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning={true}
      className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 prose prose-sm max-w-none"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
      dangerouslySetInnerHTML={{
        __html: impression.replace(/\n/g, "<br>"),
      }}
      onInput={onEditorInput}
      onBlur={onEditorInput}
    />
  )
}

function EmptyState({
  isGenerating,
  format,
}: {
  isGenerating: boolean
  format: string
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center text-gray-500">
      {isGenerating ? (
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>AI is analyzing your findings...</p>
          <p className="text-sm mt-2">Generating {format} impression</p>
        </div>
      ) : (
        <div className="text-center">
          <p>Your AI-generated impression will appear here</p>
          <p className="text-sm mt-2">Select format: {format === "formal" ? "Formal" : "Short"}</p>
        </div>
      )}
    </div>
  )
}

export default function ImpressionResultCard({
  impression,
  tokenUsage,
  lastGeneratedAt,
  isGenerating,
  format,
  editorRef,
  undoStack,
  redoStack,
  onCopy,
  onUndo,
  onRedo,
  onFormat,
  onEditorInput,
}: ResultCardProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader>
        <ResultHeader
          impression={impression}
          tokenUsage={tokenUsage}
          lastGeneratedAt={lastGeneratedAt}
          onCopy={onCopy}
        />
      </CardHeader>
      <CardContent>
        {impression ? (
          <div className="space-y-4">
            <FormattingToolbar
              undoStack={undoStack}
              redoStack={redoStack}
              onUndo={onUndo}
              onRedo={onRedo}
              onFormat={onFormat}
            />

            <EditableContent impression={impression} editorRef={editorRef} onEditorInput={onEditorInput} />
          </div>
        ) : (
          <EmptyState isGenerating={isGenerating} format={format} />
        )}
      </CardContent>
    </Card>
  )
}
