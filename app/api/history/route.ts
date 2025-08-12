import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("impressions")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching history:", error)
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }

    return NextResponse.json({ history: data || [] })
  } catch (error) {
    console.error("Error in history API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, findings, impression, format } = await request.json()

    if (!email || !findings || !impression) {
      return NextResponse.json({ error: "Email, findings, and impression are required" }, { status: 400 })
    }

    const { error } = await supabase.from("impressions").insert({
      user_email: email,
      findings,
      impression,
      format: format || "standard",
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving to history:", error)
      return NextResponse.json({ error: "Failed to save to history" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in history POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
