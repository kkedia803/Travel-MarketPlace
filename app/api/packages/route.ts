import { NextResponse } from "next/server"
import { createSupabaseRouteClient, jsonError } from "@/app/api/_utils/auth"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const destination = url.searchParams.get("destination")
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")

    const supabase = await createSupabaseRouteClient()
    let query = supabase.from("packages").select("*").eq("is_approved", true).eq("status", "active")

    if (category) {
      query = query.eq("category", category)
    }

    if (destination) {
      query = query.ilike("destination", `%${destination}%`)
    }

    if (minPrice) {
      const parsed = Number.parseInt(minPrice)
      if (!Number.isNaN(parsed)) query = query.gte("price", parsed)
    }

    if (maxPrice) {
      const parsed = Number.parseInt(maxPrice)
      if (!Number.isNaN(parsed)) query = query.lte("price", parsed)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return jsonError(error.message, 400)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
