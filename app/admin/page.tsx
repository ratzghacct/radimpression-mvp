"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, Loader2, AlertTriangle, RotateCcw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

// Import modular components and utilities
import type { UserUsage, EarlyAccessUser } from "@/lib/admin-types"
import { refreshAllData } from "@/lib/admin-data"
import { AdminStatsCards } from "@/components/admin-stats-cards"
import { AdminUserTable } from "@/components/admin-user-table"
import { AdminEarlyAccessTable } from "@/components/admin-early-access-table"

export default function AdminPage() {
  const [users, setUsers] = useState<UserUsage[]>([])
  const [earlyAccessUsers, setEarlyAccessUsers] = useState<EarlyAccessUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

      const { users: fetchedUsers, earlyAccessUsers: fetchedEarlyAccess } = await refreshAllData(user?.email || "")

      setUsers(fetchedUsers)
      setEarlyAccessUsers(fetchedEarlyAccess)
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
            {/* Stats Cards */}
            <AdminStatsCards users={users} />

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
                    <AdminUserTable users={users} onDataRefresh={fetchData} adminEmail={user?.email || ""} />
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
                    <AdminEarlyAccessTable earlyAccessUsers={earlyAccessUsers} />
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
