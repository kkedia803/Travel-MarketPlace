import { NextResponse } from "next/server"
import { jsonError, requireRole } from "@/app/api/_utils/auth"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { supabase, response } = await requireRole(["admin"])
    if (response) return response

    const { error } = await supabase.from("packages").delete().eq("id", id)
    if (error) return jsonError(error.message, 400)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

