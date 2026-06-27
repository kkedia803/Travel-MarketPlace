import { NextResponse } from "next/server"
import { createSupabaseRouteClient, jsonError } from "@/app/api/_utils/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createSupabaseRouteClient()
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .eq("is_approved", true)
      .eq("status", "active")
      .single()

    if (error) {
      return jsonError(error.message, 400)
    }

    if (!data) {
      return jsonError("Package not found", 404)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
