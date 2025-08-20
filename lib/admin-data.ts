import type { UserUsage, EarlyAccessUser } from "./admin-types"
import { filterRealUsers } from "./admin-utils"

export const fetchUsersData = async (userEmail: string): Promise<UserUsage[]> => {
  console.log("Fetching admin users data...")

  const response = await fetch("/api/admin/users", {
    headers: {
      "x-user-email": userEmail,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Users API error:", errorData)
    throw new Error(errorData.error || "Failed to fetch users")
  }

  const usersData = await response.json()
  console.log("Users data received:", usersData)

  // Filter out dummy users - only show real users who have actually used the system
  const realUsers = filterRealUsers(usersData.users || [], userEmail)
  return realUsers
}

export const fetchEarlyAccessData = async (): Promise<EarlyAccessUser[]> => {
  try {
    const response = await fetch("/api/early-access", {
      cache: "no-store",
    })

    if (response.ok) {
      const earlyAccessData = await response.json()
      return earlyAccessData.users || []
    }

    return []
  } catch (error) {
    console.log("Early access API not available, skipping...")
    return []
  }
}

export const refreshAllData = async (userEmail: string) => {
  const [users, earlyAccessUsers] = await Promise.all([fetchUsersData(userEmail), fetchEarlyAccessData()])

  return { users, earlyAccessUsers }
}
