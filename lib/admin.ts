import { supabase } from "./supabase"

export async function isAdmin(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("admin_users").select("email").eq("email", email).single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error in isAdmin:", error)
    return false
  }
}

export function calculateCost(format: string): number {
  switch (format) {
    case "formal":
      return 2
    case "short":
      return 1
    default:
      return 1
  }
}

export async function getUserUsage(userId: string) {
  try {
    const { data, error } = await supabase.from("user_usage").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return data || { user_id: userId, tokens_used: 0, plan: "free" }
  } catch (error) {
    console.error("Error getting user usage:", error)
    return { user_id: userId, tokens_used: 0, plan: "free" }
  }
}

export async function updateUserUsage(userId: string, tokensUsed: number) {
  try {
    const { error } = await supabase.from("user_usage").upsert({
      user_id: userId,
      tokens_used: tokensUsed,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating user usage:", error)
    throw error
  }
}
