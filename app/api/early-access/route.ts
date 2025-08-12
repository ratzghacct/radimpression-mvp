import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, organization, message } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Here you would typically save to database
    console.log("Early access request:", { name, email, organization, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing early access request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
