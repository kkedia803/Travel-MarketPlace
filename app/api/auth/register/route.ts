import { NextResponse } from "next/server"
import { createSupabaseRouteClient, jsonError } from "@/app/api/_utils/auth"

const allowedPublicRoles = new Set(["user", "seller"])

export async function POST(request: Request) {
  try {
    const { email, password, role, company_name, phone_number } = await request.json()
    const requestedRole = allowedPublicRoles.has(role) ? role : "user"

    if (!email || !password) {
      return jsonError("Email and password are required", 400)
    }

    const supabase = await createSupabaseRouteClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: requestedRole,
        },
      },
    })

    if (error) {
      return jsonError(error.message, 400)
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role: requestedRole,
        user_name: email.split("@")[0],
        name: email,
        company_name: requestedRole === "seller" ? company_name : null,
        phone_number,
      })

      if (profileError) {
        return jsonError(profileError.message, 400)
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
