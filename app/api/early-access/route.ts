import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingUser } = await supabase.from("early_access").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Insert new email
    const { error } = await supabase.from("early_access").insert({ email, created_at: new Date().toISOString() })

    if (error) {
      console.error("Error saving email:", error)
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in early-access API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
