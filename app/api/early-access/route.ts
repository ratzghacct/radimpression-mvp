import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Mock early access signup - in production this would save to your database
    console.log("Early access signup:", email)

    return NextResponse.json({
      success: true,
      message: "Successfully signed up for early access",
    })
  } catch (error) {
    console.error("Error signing up for early access:", error)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}
