import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(request: Request) {
  try {
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

    // Get total users count
    const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    // Get total sellers count
    const { count: sellersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "seller")

    // Get total packages count
    const { count: packagesCount } = await supabase.from("packages").select("*", { count: "exact", head: true })

    // Get total bookings count
    const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true })

    return NextResponse.json({
      users: usersCount || 0,
      sellers: sellersCount || 0,
      packages: packagesCount || 0,
      bookings: bookingsCount || 0,
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

