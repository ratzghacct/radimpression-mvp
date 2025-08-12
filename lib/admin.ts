import { supabase } from "./supabase"

const ADMIN_EMAILS = ["admin@radimpression.com", "support@radimpression.com"]

export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export interface UserData {
  id: string
  email: string
  plan: "free" | "pro" | "premium"
  tokens_used: number
  tokens_limit: number
  is_blocked: boolean
  created_at: string
}

export function calculateCost(tokens: number): number {
  return (tokens / 1000) * 0.045
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
