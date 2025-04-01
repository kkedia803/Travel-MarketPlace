import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    // Sign up the user and include the role in the metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role || "user", // Store the role in user metadata
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Create profile with role
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role: role || "user",
        name: email.split("@")[0],
      })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}