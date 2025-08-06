import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('early_access')
      .insert({
        email,
        name: name || '',
        created_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Thank you! We'll contact you soon." })
  } catch (error) {
    console.error("Error saving early access email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: earlyAccessUsers, error } = await supabase
      .from('early_access')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch early access users" }, { status: 500 })
    }

    return NextResponse.json({ users: earlyAccessUsers || [] })
  } catch (error) {
    console.error("Error fetching early access users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
