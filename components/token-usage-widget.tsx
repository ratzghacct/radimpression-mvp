"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, AlertTriangle, Zap } from "lucide-react"

interface TokenUsageWidgetProps {
  userId: string
  refreshTrigger?: number
}

interface UsageData {
  used: number
  limit: number
  percentage: number
  plan: string
  resetDate: string
}

export function TokenUsageWidget({ userId, refreshTrigger }: TokenUsageWidgetProps) {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [userId, refreshTrigger])

  const fetchUsage = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user-usage", {
        headers: {
          "x-user-id": userId,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setUsage(data.usage)
      }
    } catch (error) {
      console.error("Error fetching usage:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) {
    return null
  }

  const getStatusColor = () => {
    if (usage.percentage >= 90) return "text-red-600"
    if (usage.percentage >= 75) return "text-amber-600"
    return "text-green-600"
  }

  const getProgressColor = () => {
    if (usage.percentage >= 90) return "bg-red-500"
    if (usage.percentage >= 75) return "bg-amber-500"
    return "bg-blue-500"
  }

  const getStatusIcon = () => {
    if (usage.percentage >= 90) return <AlertTriangle className="w-4 h-4 text-red-600" />
    if (usage.percentage >= 75) return <TrendingUp className="w-4 h-4 text-amber-600" />
    return <Activity className="w-4 h-4 text-green-600" />
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            Token Usage
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {usage.plan} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Used this month</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`font-medium ${getStatusColor()}`}>
                {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
              </span>
            </div>
          </div>
          <Progress
            value={usage.percentage}
            className="h-2"
            style={{
              background: usage.percentage >= 90 ? "#fee2e2" : usage.percentage >= 75 ? "#fef3c7" : "#dbeafe",
            }}
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{usage.percentage.toFixed(1)}% used</span>
            <span>Resets: {new Date(usage.resetDate).toLocaleDateString()}</span>
          </div>
        </div>

        {usage.percentage >= 90 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-700">
                <p className="font-medium">Usage limit almost reached!</p>
                <p className="mt-1">Consider upgrading your plan to continue using the service.</p>
              </div>
            </div>
          </div>
        )}

        {usage.percentage >= 75 && usage.percentage < 90 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-700">
                <p className="font-medium">High usage detected</p>
                <p className="mt-1">You're using tokens at a high rate this month.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
