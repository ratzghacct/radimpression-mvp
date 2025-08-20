import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Zap } from "lucide-react"
import type { UserUsage, AdminStats } from "@/lib/admin-types"

interface AdminStatsCardsProps {
  users: UserUsage[]
}

export function AdminStatsCards({ users }: AdminStatsCardsProps) {
  const calculateStats = (): AdminStats => {
    const totalUsers = users.length
    const totalTokens = users.reduce((sum, user) => sum + user.totalTokensUsed, 0)
    const totalImpressions = users.reduce((sum, user) => sum + user.totalImpressions, 0)
    const totalCost = (totalTokens * 0.005) / 1000 // $0.005 per 1K tokens (GPT-4o pricing)

    const activeUsers = users.filter((user) => {
      const daysSinceLastUse = (Date.now() - new Date(user.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLastUse <= 7
    }).length

    const blockedUsers = users.filter((user) => user.isBlocked).length

    return {
      totalUsers,
      totalTokens,
      totalImpressions,
      totalCost,
      activeUsers,
      blockedUsers,
    }
  }

  const stats = calculateStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">{stats.activeUsers} active in last 7 days</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalImpressions}</div>
          <p className="text-xs text-muted-foreground">AI-generated reports</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">OpenAI API usage</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">OpenAI API costs</p>
        </CardContent>
      </Card>
    </div>
  )
}
