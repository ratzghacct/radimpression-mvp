import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const tokenLimits = {
      free: 10000,
      basic: 50000,
      pro: 200000,
      "rad-plus": 1000000,
    }

    const { error } = await supabase
      .from("users")
      .update({
        plan,
        tokens_limit: tokenLimits[plan as keyof typeof tokenLimits] || 10000,
      })
      .eq("id", userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user plan:", error)
    return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
  }
}
