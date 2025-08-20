"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ShieldOff, CheckCircle, Clock, RotateCcw, Crown, Loader2 } from "lucide-react"
import type { UserUsage } from "@/lib/admin-types"
import { PLAN_OPTIONS, formatUserData } from "@/lib/admin-utils"
import { handleBlockUser, handleResetUsage, handleActivatePlan } from "@/lib/admin-actions"
import { toast } from "@/hooks/use-toast"

interface AdminUserTableProps {
  users: UserUsage[]
  onDataRefresh: () => void
  adminEmail: string
}

export function AdminUserTable({ users, onDataRefresh, adminEmail }: AdminUserTableProps) {
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Initialize selected plans with current user plans
  useState(() => {
    const planMap: Record<string, string> = {}
    users.forEach((userData: UserUsage) => {
      planMap[userData.userId] = userData.plan || "free"
    })
    setSelectedPlans(planMap)
  })

  const handlePlanChange = (userId: string, plan: string) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [userId]: plan,
    }))
  }

  const executeBlockUser = async (userId: string, action: "block" | "unblock") => {
    try {
      setActionLoading(`${action}-${userId}`)
      await handleBlockUser(userId, action, adminEmail, onDataRefresh)
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

  const executeResetUsage = async (userId: string) => {
    try {
      setActionLoading(`reset-${userId}`)
      await handleResetUsage(userId, adminEmail, onDataRefresh)
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

  const executeActivatePlan = async (userId: string) => {
    try {
      setActionLoading(`activate-${userId}`)
      const newPlan = selectedPlans[userId]
      await handleActivatePlan(userId, newPlan, adminEmail, onDataRefresh)
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

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No real users found. Only showing users with actual usage data.</p>
      </div>
    )
  }

  return (
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
            const formattedUser = formatUserData(userData)
            const selectedPlan = selectedPlans[userData.userId] || formattedUser.currentPlan
            const planChanged = selectedPlan !== formattedUser.currentPlan

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
                    variant={formattedUser.currentPlan === "free" ? "secondary" : "default"}
                    className="flex items-center space-x-1 w-fit"
                  >
                    {formattedUser.currentPlan !== "free" && <Crown className="w-3 h-3" />}
                    <span>
                      {formattedUser.currentPlan.charAt(0).toUpperCase() + formattedUser.currentPlan.slice(1)} Plan
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {userData.totalTokensUsed.toLocaleString()} / {formattedUser.planLimit.toLocaleString()}
                    </div>
                    <div className="text-gray-500">
                      {userData.totalImpressions} impressions • {formattedUser.usagePercentage.toFixed(1)}% used
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
                    <Select value={selectedPlan} onValueChange={(value) => handlePlanChange(userData.userId, value)}>
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
                        onClick={() => executeActivatePlan(userData.userId)}
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
                      onClick={() => executeBlockUser(userData.userId, userData.isBlocked ? "unblock" : "block")}
                      disabled={actionLoading === `${userData.isBlocked ? "unblock" : "block"}-${userData.userId}`}
                    >
                      {actionLoading === `${userData.isBlocked ? "unblock" : "block"}-${userData.userId}` ? (
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
                      onClick={() => executeResetUsage(userData.userId)}
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
  )
}
