import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if environment variables exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not found, returning default plan")
      return NextResponse.json({ plan: "free" })
    }

    // Dynamically import and create Supabase client only when needed
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch user plan from database
    const { data: userData, error } = await supabase.from("user_usage").select("plan").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user plan:", error)
      return NextResponse.json({ plan: "free" })
    }

    return NextResponse.json({
      plan: userData?.plan || "free",
    })
  } catch (error) {
    console.error("Error in user-plan API:", error)
    return NextResponse.json({ plan: "free" })
  }
}
