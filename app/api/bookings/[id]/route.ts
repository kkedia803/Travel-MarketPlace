import { NextResponse } from "next/server"
import { getUserRole, jsonError, requireUser } from "@/app/api/_utils/auth"

const allowedStatuses = new Set(["pending", "confirmed", "cancelled"])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!allowedStatuses.has(status)) {
      return jsonError("Invalid booking status", 400)
    }

    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const role = await getUserRole(supabase, user.id)
    if (!role) return jsonError("Profile not found", 404)

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        status,
        packages!inner (
          seller_id
        )
      `)
      .eq("id", id)
      .single()

    if (bookingError || !booking) {
      return jsonError("Booking not found", 404)
    }

    const packageData = Array.isArray(booking.packages) ? booking.packages[0] : booking.packages
    const isOwner = booking.user_id === user.id
    const isSeller = role === "seller" && packageData?.seller_id === user.id
    const isAdmin = role === "admin"

    if (role === "user" && status !== "cancelled") {
      return jsonError("Users can only cancel bookings", 403)
    }

    if (!isOwner && !isSeller && !isAdmin) {
      return jsonError("Forbidden", 403)
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) return jsonError(error.message, 400)

    return NextResponse.json({ success: true, booking: data })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

