"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Zap, Loader2 } from 'lucide-react'

interface TokenUsageWidgetProps {
  userId: string
  refreshTrigger?: number
}

export function TokenUsageWidget({ userId, refreshTrigger }: TokenUsageWidgetProps) {
  const [usage, setUsage] = useState({
    used: 0,
    available: 10000,
    remaining: 10000,
    plan: "Free Plan"
  })
  const [loading, setLoading] = useState(true)

  const fetchUsage = async () => {
  console.log("Fetching usage for userId:", userId)
  try {
    const response = await fetch("/api/user-usage", {
      headers: {
        "x-user-id": userId,
      },
    })
    
    console.log("API response status:", response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log("API response data:", data)
      setUsage({
        used: data.used,
        available: data.available,
        remaining: data.remaining,
        plan: data.plan === "free" ? "Free Plan" : data.plan
      })
    } else {
      const errorData = await response.json()
      console.log("API error:", errorData)
    }
  } catch (error) {
    console.error("Error fetching usage:", error)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (userId) {
      fetchUsage()
    }
  }, [userId, refreshTrigger])

  const usagePercentage = usage.available > 0 ? (usage.used / usage.available) * 100 : 0

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Token Usage - {usage.plan}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Used</span>
            <span className="font-medium">{usage.used.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available</span>
            <span className="font-medium">{usage.available.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-green-600">{usage.remaining.toLocaleString()}</span>
          </div>
        </div>
                
        <div className="space-y-2">
          <Progress 
            value={Math.min(usagePercentage, 100)}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{usagePercentage.toFixed(1)}% used</span>
            <span>{(100 - usagePercentage).toFixed(1)}% remaining</span>
          </div>
        </div>
        
        {usagePercentage > 80 && (
          <div className="flex items-center space-x-2 text-amber-600 text-xs">
            <Zap className="w-3 h-3" />
            <span>Running low on tokens</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
