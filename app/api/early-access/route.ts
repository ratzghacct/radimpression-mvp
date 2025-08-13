import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // For demo purposes, just return success
    // In production, you would save to Supabase
    console.log(`Early access request from: ${email}`)

    return NextResponse.json({
      message: "Thank you for your interest! We'll be in touch soon.",
      success: true,
    })
  } catch (error) {
    console.error("Error processing early access request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
