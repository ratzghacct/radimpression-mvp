import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, adminEmail } = await request.json()

    if (!isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const { error } = await supabase.from("users").update({ tokens_used: 0 }).eq("id", userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resetting user usage:", error)
    return NextResponse.json({ error: "Failed to reset user usage" }, { status: 500 })
  }
}
