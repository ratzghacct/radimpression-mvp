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
      console.error("Error fetching user usage:", error)
      return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
    }

    return NextResponse.json({
      tokensUsed: data.tokens_used || 0,
      tokensLimit: data.tokens_limit || 10,
      plan: data.plan || "free",
    })
  } catch (error) {
    console.error("Error in user-usage API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, tokensUsed } = await request.json()

    if (!email || tokensUsed === undefined) {
      return NextResponse.json({ error: "Email and tokensUsed are required" }, { status: 400 })
    }

    const { error } = await supabase.from("users").update({ tokens_used: tokensUsed }).eq("email", email)

    if (error) {
      console.error("Error updating user usage:", error)
      return NextResponse.json({ error: "Failed to update usage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in user-usage POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
