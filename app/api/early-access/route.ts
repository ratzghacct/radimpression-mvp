import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase.from("early_access").select("email").eq("email", email).single()

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Insert new email
    const { error } = await supabase.from("early_access").insert({ email, created_at: new Date().toISOString() })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: "Successfully registered for early access" })
  } catch (error) {
    console.error("Error registering for early access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
