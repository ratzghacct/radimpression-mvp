"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Brain, Clock, Search, Copy } from "lucide-react"
import type { ImpressionHistory } from "@/lib/impression-types"
import { filterHistoryData, formatDisplayData } from "@/lib/impression-data"

interface HistoryTabProps {
  history: ImpressionHistory[]
  searchTerm: string
  onSearchChange: (value: string) => void
  onCopyImpression: (text: string) => void
  onSwitchToGenerate: () => void
}

function HistorySearch({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string
  onSearchChange: (value: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your impressions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryItem({
  item,
  onCopyImpression,
}: {
  item: any
  onCopyImpression: (text: string) => void
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>{item.formattedDate}</span>
                {item.tokenUsage.format && (
                  <Badge variant="outline" className="text-xs">
                    {item.tokenUsage.format === "formal" ? "Formal" : "Short"}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {item.tokenUsage.totalTokens} tokens • ${item.formattedCost} • {item.model}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopyImpression(item.impression)}
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
          <div className="bg-blue-50 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap">{item.impression}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryList({
  items,
  onCopyImpression,
}: {
  items: any[]
  onCopyImpression: (text: string) => void
}) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} onCopyImpression={onCopyImpression} />
      ))}
    </div>
  )
}

function EmptyHistoryState({
  searchTerm,
  onSwitchToGenerate,
}: {
  searchTerm: string
  onSwitchToGenerate: () => void
}) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Impressions Found</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm ? "No impressions match your search." : "You haven't generated any impressions yet."}
        </p>
        <Button onClick={onSwitchToGenerate} className="bg-blue-600 hover:bg-blue-700">
          Generate Your First Impression
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ImpressionHistoryTab({
  history,
  searchTerm,
  onSearchChange,
  onCopyImpression,
  onSwitchToGenerate,
}: HistoryTabProps) {
  const filteredHistory = filterHistoryData(history, searchTerm)
  const formattedHistory = formatDisplayData(filteredHistory)

  return (
    <div className="space-y-6">
      <HistorySearch searchTerm={searchTerm} onSearchChange={onSearchChange} />

      {formattedHistory.length === 0 ? (
        <EmptyHistoryState searchTerm={searchTerm} onSwitchToGenerate={onSwitchToGenerate} />
      ) : (
        <HistoryList items={formattedHistory} onCopyImpression={onCopyImpression} />
      )}
    </div>
  )
}
