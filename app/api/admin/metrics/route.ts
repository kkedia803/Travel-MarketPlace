import { NextResponse } from "next/server"
import { requireRole } from "@/app/api/_utils/auth"

export async function GET(request: Request) {
  try {
    const { supabase, response } = await requireRole(["admin"])
    if (response) return response

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
