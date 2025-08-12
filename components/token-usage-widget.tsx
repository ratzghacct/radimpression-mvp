"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, Clock, AlertCircle } from "lucide-react"

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
  const [usage, setUsage] = useState<UsageData>({
    used: 3800,
    limit: 10000,
    percentage: 38,
    plan: "Demo",
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchUsage = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/user-usage", {
          headers: {
            "x-user-id": userId,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Error fetching usage:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [userId, refreshTrigger])

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const daysUntilReset = Math.ceil((new Date(usage.resetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Token Usage</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {usage.plan} Plan
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Track your monthly token consumption and limits
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Usage this month</span>
                <span className={`font-semibold ${getUsageColor(usage.percentage)}`}>
                  {formatNumber(usage.used)} / {formatNumber(usage.limit)} tokens
                </span>
              </div>
              <Progress value={usage.percentage} className="h-2" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{usage.percentage.toFixed(1)}% used</span>
                <span>{formatNumber(usage.limit - usage.used)} remaining</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Daily Average</div>
                  <div className="text-sm font-medium">
                    {Math.round(usage.used / (30 - daysUntilReset || 1)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Resets in</div>
                  <div className="text-sm font-medium">{daysUntilReset} days</div>
                </div>
              </div>
            </div>

            {usage.percentage >= 80 && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <div className="font-medium mb-1">Usage Warning</div>
                  <div>
                    You've used {usage.percentage.toFixed(1)}% of your monthly tokens. Consider upgrading your plan to
                    avoid interruptions.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
