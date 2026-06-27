import { NextResponse } from "next/server"
import { jsonError, requireRole } from "@/app/api/_utils/auth"

export async function POST(request: Request) {
  try {
    const { package_id } = await request.json()

    if (!package_id || typeof package_id !== "string") {
      return jsonError("package_id is required", 400)
    }

    const { supabase, response } = await requireRole(["admin"])
    if (response) return response

    const { data, error } = await supabase.from("packages").update({ is_approved: true }).eq("id", package_id).select()

    if (error) {
      return jsonError(error.message, 400)
    }

    if (!data?.length) {
      return jsonError("Package not found", 404)
    }

    return NextResponse.json({ success: true, package: data[0] })
  } catch (error) {
    console.error("Error approving package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
