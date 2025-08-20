import { toast } from "@/hooks/use-toast"

export const handleBlockUser = async (
  userId: string,
  action: "block" | "unblock",
  adminEmail: string,
  onSuccess: () => void,
) => {
  const response = await fetch("/api/admin/block-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      action,
      adminEmail,
    }),
  })

  if (response.ok) {
    toast({
      title: "Success",
      description: `User ${action}ed successfully`,
    })
    onSuccess()
  } else {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to ${action} user`)
  }
}

export const handleResetUsage = async (userId: string, adminEmail: string, onSuccess: () => void) => {
  const response = await fetch("/api/admin/reset-usage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      adminEmail,
    }),
  })

  if (response.ok) {
    toast({
      title: "Success",
      description: "User usage reset successfully",
    })
    onSuccess()
  } else {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to reset usage")
  }
}

export const handleActivatePlan = async (userId: string, plan: string, adminEmail: string, onSuccess: () => void) => {
  if (!plan) {
    throw new Error("Please select a plan first")
  }

  const response = await fetch("/api/admin/update-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      plan,
      adminEmail,
    }),
  })

  if (response.ok) {
    toast({
      title: "Success",
      description: `User plan updated to ${plan} and usage reset`,
    })
    onSuccess()
  } else {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update plan")
  }
}
