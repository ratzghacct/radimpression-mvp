import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/usage-tracker"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminEmail = searchParams.get("adminEmail")

    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = getAllUsers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
