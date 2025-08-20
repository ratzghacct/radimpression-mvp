import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Query the user_usage table to get the current plan
    const { data: userData, error } = await supabase.from("user_usage").select("plan").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user plan:", error)
      return NextResponse.json({ error: "Failed to fetch user plan" }, { status: 500 })
    }

    // If no record exists, user is on free plan
    const userPlan = userData?.plan || "free"

    return NextResponse.json({
      success: true,
      plan: userPlan.toLowerCase(),
    })
  } catch (error) {
    console.error("Error in user-plan API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
