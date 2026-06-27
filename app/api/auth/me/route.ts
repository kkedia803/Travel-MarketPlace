import { NextResponse } from "next/server"
import { jsonError, requireUser } from "@/app/api/_utils/auth"

export async function GET(request: Request) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      return jsonError(error.message, 400)
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: profile.role,
      name: profile.name,
      avatar_url: profile.avatar_url,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
