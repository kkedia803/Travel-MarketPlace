import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(request: Request) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
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

