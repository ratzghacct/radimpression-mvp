import { supabase } from "./supabase"

export interface UserData {
  id: string
  email: string
  plan: "free" | "pro" | "premium"
  tokens_used: number
  tokens_limit: number
  is_blocked: boolean
  created_at: string
}

export async function isAdmin(email: string): Promise<boolean> {
  const adminEmails = ["admin@radimpression.com", "support@radimpression.com"]
  return adminEmails.includes(email.toLowerCase())
}

export function calculateCost(plan: string, tokens: number): number {
  const rates = {
    free: 0,
    pro: 0.01,
    premium: 0.005,
  }
  return (rates[plan as keyof typeof rates] || 0) * tokens
}

export async function getUserData(email: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching user data:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserData:", error)
    return null
  }
}

export async function updateUserTokens(email: string, tokensUsed: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").update({ tokens_used: tokensUsed }).eq("email", email)

    if (error) {
      console.error("Error updating user tokens:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateUserTokens:", error)
    return false
  }
}
