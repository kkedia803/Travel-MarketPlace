import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function POST(request: Request) {
  try {
    const { package_id } = await request.json()

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Approve the package
    const { data, error } = await supabase.from("packages").update({ is_approved: true }).eq("id", package_id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, package: data[0] })
  } catch (error) {
    console.error("Error approving package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

