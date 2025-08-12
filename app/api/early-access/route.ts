import { NextResponse } from "next/server"

// Mock early access data for demo (replace with Supabase later)
const earlyAccessUsers = [
  {
    id: 1,
    email: "dr.smith@hospital.com",
    name: "Dr. Sarah Smith",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending"
  },
  {
    id: 2,
    email: "dr.johnson@clinic.org", 
    name: "Dr. Michael Johnson",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved"
  },
  {
    id: 3,
    email: "dr.wilson@medical.edu",
    name: "Dr. Emily Wilson", 
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending"
  }
]

export async function GET() {
  try {
    return NextResponse.json({ 
      users: earlyAccessUsers,
      count: earlyAccessUsers.length 
    })
  } catch (error) {
    console.error("Error fetching early access users:", error)
    return NextResponse.json(
      { error: "Failed to fetch early access users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // For now, just return success (replace with real database later)
    return NextResponse.json({ 
      success: true, 
      message: "Thank you! We'll contact you soon." 
    })
  } catch (error) {
    console.error("Error saving early access email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
