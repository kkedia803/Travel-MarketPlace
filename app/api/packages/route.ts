import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const destination = url.searchParams.get("destination")
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")

    let query = supabase.from("packages").select("*").eq("is_approved", true)

    if (category) {
      query = query.eq("category", category)
    }

    if (destination) {
      query = query.ilike("destination", `%${destination}%`)
    }

    if (minPrice) {
      query = query.gte("price", Number.parseInt(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseInt(maxPrice))
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

