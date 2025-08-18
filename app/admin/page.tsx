"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  ShieldOff,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RotateCcw,
  Crown,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

interface UserUsage {
  userId: string
  email: string
  displayName: string
  totalTokensUsed: number
  totalImpressions: number
  isBlocked: boolean
  lastUsed: Date
  createdAt: Date
  tokensToday: number
  impressionsToday: number
  lastResetDate: Date
  plan?: string
}

interface EarlyAccessUser {
  id: number
  email: string
  name: string
  created_at: string
  status: string
}

const PLAN_LIMITS = {
  free: 10000,
  basic: 50000,
  pro: 200000,
  "rad-plus": 1000000,
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free Plan", limit: "10K tokens" },
  { value: "basic", label: "Basic Plan", limit: "50K tokens" },
  { value: "pro", label: "Pro Plan", limit: "200K tokens" },
  { value: "rad-plus", label: "Rad Plus Plan", limit: "1M tokens" },
]

export default function AdminPage() {
  const [users, setUsers] = useState<UserUsage[]>([])
  const [earlyAccessUsers, setEarlyAccessUsers] = useState<EarlyAccessUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({})
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching admin data...")

      // Fetch user usage data
      const usersResponse = await fetch("/api/admin/users", {
        headers: {
          "x-user-email": user?.email || "",
        },
        cache: "no-store",
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log("Users data received:", usersData)

        // Filter out dummy users - only show real users who have actually used the system
        const realUsers = (usersData.users || []).filter((userData: UserUsage) => {
          // Remove dummy users by email patterns and only show users with actual usage
          const isDummyUser =
            userData.email.includes("@medical.edu") ||
            userData.email.includes("@hospital.com") ||
            userData.email.includes("@clinic.org") ||
            (userData.displayName.startsWith("Dr. ") && userData.totalTokensUsed === 0)

          // Only show current user or users with actual usage (not dummy data)
          return (
            !isDummyUser &&
            (userData.email === user?.email || userData.totalTokensUsed > 0 || userData.totalImpressions > 0)
          )
        })

        setUsers(realUsers)

        // Initialize selected plans with current user plans
        const planMap: Record<string, string> = {}
        realUsers.forEach((userData: UserUsage) => {
          planMap[userData.userId] = userData.plan || "free"
        })
        setSelectedPlans(planMap)
      } else {
        const errorData = await usersResponse.json()
        console.error("Users API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch users")
      }

      // Fetch early access data
      try {
        const earlyAccessResponse = await fetch("/api/early-access", {
          cache: "no-store",
        })
        if (earlyAccessResponse.ok) {
          const earlyAccessData = await earlyAccessResponse.json()
          setEarlyAccessUsers(earlyAccessData.users || [])
        }
      } catch (earlyAccessError) {
        console.log("Early access API not available, skipping...")
        setEarlyAccessUsers([])
      }
    } catch (error: any) {
      console.error("Error fetching admin data:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId: string, action: "block" | "unblock") => {
    try {
      setActionLoading(`${action}-${userId}`)

      const response = await fetch("/api/admin/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action,
          adminEmail: user?.email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${action}ed successfully`,
        })
        await fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} user`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetUsage = async (userId: string) => {
    try {
      setActionLoading(`reset-${userId}`)

      const response = await fetch("/api/admin/reset-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          adminEmail: user?.email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User usage reset successfully",
        })
        await fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reset usage")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivatePlan = async (userId: string) => {
    try {
      setActionLoading(`activate-${userId}`)

      const newPlan = selectedPlans[userId]
      if (!newPlan) {
        throw new Error("Please select a plan first")
      }

      const response = await fetch("/api/admin/update-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plan: newPlan,
          adminEmail: user?.email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User plan updated to ${newPlan} and usage reset`,
        })
        await fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handlePlanChange = (userId: string, plan: string) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [userId]: plan,
    }))
  }

  // Calculate statistics from the actual filtered users data (real data only)
  const totalUsers = users.length
  const totalTokens = users.reduce((sum, user) => sum + user.totalTokensUsed, 0)
  const totalImpressions = users.reduce((sum, user) => sum + user.totalImpressions, 0)
  const totalCost = (totalTokens * 0.005) / 1000 // $0.005 per 1K tokens (GPT-4o pricing)
  const activeUsers = users.filter((user) => {
    const daysSinceLastUse = (Date.now() - new Date(user.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceLastUse <= 7
  }).length
  const blockedUsers = users.filter((user) => user.isBlocked).length

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor usage, manage users, and view analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
              <RotateCcw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge className="bg-red-100 text-red-700">
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading admin data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards - Now showing real filtered data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{activeUsers} active in last 7 days</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalImpressions}</div>
                  <p className="text-xs text-muted-foreground">AI-generated reports</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">OpenAI API usage</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">OpenAI API costs</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="early-access">Early Access</TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Monitor and manage user accounts, plans, and usage (showing only real active users)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {users.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No real users found. Only showing users with actual usage data.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Current Plan</TableHead>
                              <TableHead>Usage</TableHead>
                              <TableHead>Today's Usage</TableHead>
                              <TableHead>Last Active</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Plan Management</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((userData) => {
                              const currentPlan = userData.plan || "free"
                              const selectedPlan = selectedPlans[userData.userId] || currentPlan
                              const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
                              const usagePercentage = (userData.totalTokensUsed / planLimit) * 100
                              const planChanged = selectedPlan !== currentPlan

                              return (
                                <TableRow key={userData.userId}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{userData.displayName}</div>
                                      <div className="text-sm text-gray-500">{userData.email}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={currentPlan === "free" ? "secondary" : "default"}
                                      className="flex items-center space-x-1 w-fit"
                                    >
                                      {currentPlan !== "free" && <Crown className="w-3 h-3" />}
                                      <span>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan</span>
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div>
                                        {userData.totalTokensUsed.toLocaleString()} / {planLimit.toLocaleString()}
                                      </div>
                                      <div className="text-gray-500">
                                        {userData.totalImpressions} impressions • {usagePercentage.toFixed(1)}% used
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div>{userData.tokensToday.toLocaleString()} tokens</div>
                                      <div className="text-gray-500">{userData.impressionsToday} impressions</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm">
                                        {new Date(userData.lastUsed).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {userData.isBlocked ? (
                                      <Badge variant="destructive" className="flex items-center space-x-1 w-fit">
                                        <ShieldOff className="w-3 h-3" />
                                        <span>Blocked</span>
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Active</span>
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col space-y-2 min-w-[200px]">
                                      <Select
                                        value={selectedPlan}
                                        onValueChange={(value) => handlePlanChange(userData.userId, value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {PLAN_OPTIONS.map((plan) => (
                                            <SelectItem key={plan.value} value={plan.value}>
                                              <div className="flex items-center justify-between w-full">
                                                <span>{plan.label}</span>
                                                <span className="text-xs text-gray-500 ml-2">({plan.limit})</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {planChanged && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleActivatePlan(userData.userId)}
                                          disabled={actionLoading === `activate-${userData.userId}`}
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          {actionLoading === `activate-${userData.userId}` ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <>
                                              <Crown className="w-3 h-3 mr-1" />
                                              Activate
                                            </>
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col space-y-2">
                                      <Button
                                        variant={userData.isBlocked ? "default" : "destructive"}
                                        size="sm"
                                        onClick={() =>
                                          handleBlockUser(userData.userId, userData.isBlocked ? "unblock" : "block")
                                        }
                                        disabled={
                                          actionLoading ===
                                          `${userData.isBlocked ? "unblock" : "block"}-${userData.userId}`
                                        }
                                      >
                                        {actionLoading ===
                                        `${userData.isBlocked ? "unblock" : "block"}-${userData.userId}` ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : userData.isBlocked ? (
                                          "Unblock"
                                        ) : (
                                          "Block"
                                        )}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleResetUsage(userData.userId)}
                                        disabled={actionLoading === `reset-${userData.userId}`}
                                      >
                                        {actionLoading === `reset-${userData.userId}` ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <>
                                            <RotateCcw className="w-3 h-3 mr-1" />
                                            Reset
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Early Access Tab */}
              <TabsContent value="early-access">
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Early Access Requests</CardTitle>
                    <CardDescription>Users who signed up for early access to the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {earlyAccessUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No early access requests yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Date Signed Up</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {earlyAccessUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="font-medium">{user.name || "Not provided"}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{user.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
