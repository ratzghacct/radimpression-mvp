import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("impression_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({ history: data || [] })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, findings, impression, format } = await request.json()

    if (!userId || !findings || !impression) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("impression_history")
      .insert({
        user_id: userId,
        findings,
        impression,
        format: format || "standard",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error saving to history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
