"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TokenUsageWidgetProps {
  used: number
  limit: number
}

export function TokenUsageWidget({ used, limit }: TokenUsageWidgetProps) {
  const percentage = (used / limit) * 100
  const remaining = limit - used

  return (
    <Card className="w-64">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Usage</span>
          <Badge variant={remaining <= 10 ? "destructive" : "secondary"} className="text-xs">
            {remaining} left
          </Badge>
        </div>
        <Progress value={percentage} className="h-2 mb-2" />
        <div className="text-xs text-gray-600">
          {used} / {limit} impressions
        </div>
      </CardContent>
    </Card>
  )
}
