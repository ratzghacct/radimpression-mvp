import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Mock early access signup - replace with actual database insert
    console.log("Early access signup:", { email, name })

    return NextResponse.json({ success: true, message: "Successfully signed up for early access" })
  } catch (error) {
    console.error("Error signing up for early access:", error)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Mock early access users - replace with actual database query
    const mockUsers = [
      {
        id: 1,
        email: "user1@example.com",
        name: "John Doe",
        created_at: new Date().toISOString(),
        status: "pending",
      },
      {
        id: 2,
        email: "user2@example.com",
        name: "Jane Smith",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        status: "approved",
      },
    ]

    return NextResponse.json({ users: mockUsers })
  } catch (error) {
    console.error("Error fetching early access users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
