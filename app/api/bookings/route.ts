import { NextResponse } from "next/server"
import { getUserRole, jsonError, requireUser } from "@/app/api/_utils/auth"

export async function POST(request: Request) {
  try {
    const { package_id, travelers, selected_date } = await request.json()

    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    if (!package_id || typeof package_id !== "string") {
      return jsonError("package_id is required", 400)
    }

    const travelerCount = Number(travelers)
    if (!Number.isInteger(travelerCount) || travelerCount < 1) {
      return jsonError("travelers must be a positive integer", 400)
    }

    const role = await getUserRole(supabase, user.id)
    if (role === "seller") {
      return jsonError("Sellers cannot book packages", 403)
    }

    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("id, destination, is_approved, status, max_people, start_dates")
      .eq("id", package_id)
      .single()

    if (packageError || !packageData) {
      return jsonError("Package not found", 404)
    }

    if (!packageData.is_approved || packageData.status !== "active") {
      return jsonError("Package is not available for booking", 400)
    }

    if (packageData.max_people && travelerCount > packageData.max_people) {
      return jsonError(`Maximum ${packageData.max_people} travelers are allowed`, 400)
    }

    let normalizedDate: string | null = null
    if (selected_date) {
      const requestedDate = new Date(selected_date)
      if (Number.isNaN(requestedDate.getTime())) {
        return jsonError("selected_date is invalid", 400)
      }

      normalizedDate = requestedDate.toISOString()
      const requestedDay = normalizedDate.split("T")[0]
      const startDates = Array.isArray(packageData.start_dates) ? packageData.start_dates : []
      if (startDates.length > 0 && !startDates.some((date: string) => date === requestedDay)) {
        return jsonError("Selected date is not available for this package", 400)
      }
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        package_id,
        destination: packageData.destination,
        user_id: user.id,
        travelers: travelerCount,
        selected_date: normalizedDate,
        status: "pending",
      })
      .select()

    if (error) {
      return jsonError(error.message, 400)
    }

    return NextResponse.json({ success: true, booking: data[0] })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const role = await getUserRole(supabase, user.id)
    if (!role) return jsonError("Profile not found", 404)

    let query = supabase.from("bookings").select(`
        *,
        package:packages (
          id, title, destination, price, duration, images
        )
      `)

    // If user is a regular user, only show their bookings
    if (role === "user") {
      query = query.eq("user_id", user.id)
    }
    // If user is a seller, show bookings for their packages
    else if (role === "seller") {
      const { data: sellerPackages } = await supabase.from("packages").select("id").eq("seller_id", user.id)

      const packageIds = sellerPackages?.map((pkg) => pkg.id) || []

      if (packageIds.length === 0) {
        return NextResponse.json([])
      }

      query = query.in("package_id", packageIds)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return jsonError(error.message, 400)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
