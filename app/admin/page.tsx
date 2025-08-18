"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Activity,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { isAdmin } from "@/lib/admin"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  displayName: string
  plan: string
  tokensUsed: number
  tokensLimit: number
  impressionsCount: number
  lastActive: string
  status: "active" | "blocked" | "inactive"
  createdAt: string
}

interface AdminStats {
  totalUsers: number
  totalImpressions: number
  totalTokens: number
  totalCost: number
  activeUsers: number
  blockedUsers: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalImpressions: 0,
    totalTokens: 0,
    totalCost: 0,
    activeUsers: 0,
    blockedUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPlan, setFilterPlan] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!isAdmin(user.email)) {
      router.push("/")
      return
    }

    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        // Filter out dummy users and only show real users with actual usage
        const realUsers = data.users.filter((user: User) => {
          // Remove dummy users by email patterns and display names
          const isDummyEmail =
            user.email.includes("@medical.edu") ||
            user.email.includes("@hospital.com") ||
            user.email.includes("@clinic.org")
          const isDummyName = user.displayName.startsWith("Dr.") && !user.email.includes("demo@radimpression.com")

          // Only show users with actual usage or the demo user
          const hasActualUsage = user.tokensUsed > 0 || user.impressionsCount > 0
          const isDemoUser = user.email.includes("demo@radimpression.com")

          return !isDummyEmail && !isDummyName && (hasActualUsage || isDemoUser)
        })

        setUsers(realUsers)

        // Calculate stats from real users only
        const totalUsers = realUsers.length
        const totalImpressions = realUsers.reduce((sum, user) => sum + user.impressionsCount, 0)
        const totalTokens = realUsers.reduce((sum, user) => sum + user.tokensUsed, 0)
        const totalCost = (totalTokens * 0.005) / 1000 // GPT-4o pricing: $0.005 per 1K tokens
        const activeUsers = realUsers.filter((user) => user.status === "active").length
        const blockedUsers = realUsers.filter((user) => user.status === "blocked").length

        setStats({
          totalUsers,
          totalImpressions,
          totalTokens,
          totalCost,
          activeUsers,
          blockedUsers,
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string, value?: string) => {
    try {
      const response = await fetch("/api/admin/user-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action,
          value,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchUsers() // Refresh the data
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform action",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesPlan = filterPlan === "all" || user.plan.toLowerCase().includes(filterPlan.toLowerCase())

    return matchesSearch && matchesStatus && matchesPlan
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900 p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">
                Monitor usage, manage users, and view analytics (showing only real active users)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={fetchUsers} variant="outline" className="text-blue-600 border-blue-600 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-red-100 text-red-700">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} active in last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImpressions}</div>
              <p className="text-xs text-muted-foreground">AI-generated reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">OpenAI API usage</p>
            </CardContent>
          </Card>

          <Card>
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

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="early-access">Early Access</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Monitor and manage user accounts, plans, and usage (showing only active users)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free Plan</SelectItem>
                      <SelectItem value="basic">Basic Plan</SelectItem>
                      <SelectItem value="pro">Pro Plan</SelectItem>
                      <SelectItem value="rad">Rad Plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterStatus !== "all" || filterPlan !== "all"
                        ? "No users match your current filters."
                        : "No users with actual usage data found."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Current Plan</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Usage</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Today's Usage</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Plan Management</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{user.displayName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className="text-xs">
                                {user.plan}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <div>
                                  {user.tokensUsed.toLocaleString()} / {user.tokensLimit.toLocaleString()} tokens
                                </div>
                                <div className="text-gray-500">{user.impressionsCount} impressions</div>
                                <div className="text-xs text-gray-400">
                                  {((user.tokensUsed / user.tokensLimit) * 100).toFixed(1)}% used
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <div>0 tokens</div>
                                <div className="text-gray-500">0 impressions</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <div>{new Date(user.lastActive).toLocaleDateString()}</div>
                                <div className="text-gray-500">{new Date(user.lastActive).toLocaleTimeString()}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : user.status === "blocked"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {user.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                                {user.status === "blocked" && <XCircle className="w-3 h-3 mr-1" />}
                                {user.status === "inactive" && <Clock className="w-3 h-3 mr-1" />}
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Select
                                value={user.plan}
                                onValueChange={(value) => handleUserAction(user.id, "update-plan", value)}
                              >
                                <SelectTrigger className="w-[120px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Free Plan">Free Plan</SelectItem>
                                  <SelectItem value="Basic Plan">Basic Plan</SelectItem>
                                  <SelectItem value="Pro Plan">Pro Plan</SelectItem>
                                  <SelectItem value="Rad Plus">Rad Plus</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col space-y-2">
                                <Button
                                  size="sm"
                                  variant={user.status === "blocked" ? "default" : "destructive"}
                                  onClick={() =>
                                    handleUserAction(user.id, user.status === "blocked" ? "unblock" : "block")
                                  }
                                  className="text-xs"
                                >
                                  {user.status === "blocked" ? "Unblock" : "Block"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, "reset-usage")}
                                  className="text-xs"
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Reset
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="early-access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Early Access Requests</CardTitle>
                <CardDescription>Manage early access requests for premium features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Early Access Requests</h3>
                  <p className="text-gray-600">
                    Early access requests will appear here when users sign up for premium features.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
