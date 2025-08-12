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
      .from("users")
      .select("tokens_used, tokens_limit, plan")
      .eq("email", email)
      .single()

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, tokensUsed } = await request.json()

    if (!email || tokensUsed === undefined) {
      return NextResponse.json({ error: "Email and tokensUsed are required" }, { status: 400 })
    }

    const { error } = await supabase.from("users").upsert({
      email,
      tokens_used: tokensUsed,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
