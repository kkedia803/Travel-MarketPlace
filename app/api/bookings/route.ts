import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function POST(request: Request) {
  try {
    const { package_id, travelers } = await request.json()

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Create the booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        package_id,
        user_id: user.id,
        travelers,
        status: "pending",
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, booking: data[0] })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    let query = supabase.from("bookings").select(`
        *,
        package:packages (
          id, title, destination, price, duration, images
        )
      `)

    // If user is a regular user, only show their bookings
    if (profile.role === "user") {
      query = query.eq("user_id", user.id)
    }
    // If user is a seller, show bookings for their packages
    else if (profile.role === "seller") {
      const { data: sellerPackages } = await supabase.from("packages").select("id").eq("seller_id", user.id)

      const packageIds = sellerPackages?.map((pkg) => pkg.id) || []

      if (packageIds.length === 0) {
        return NextResponse.json([])
      }

      query = query.in("package_id", packageIds)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

