import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase.from("packages").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

