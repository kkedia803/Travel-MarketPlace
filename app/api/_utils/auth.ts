import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export type AppRole = "user" | "seller" | "admin"

export async function createSupabaseRouteClient() {
  return createRouteHandlerClient({ cookies })
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function requireUser() {
  const supabase = await createSupabaseRouteClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null, response: jsonError("Unauthorized", 401) }
  }

  return { supabase, user, response: null }
}

export async function getUserRole(
  supabase: Awaited<ReturnType<typeof createSupabaseRouteClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (error || !data?.role) return null

  return data.role as AppRole
}

export async function requireRole(allowedRoles: AppRole[]) {
  const auth = await requireUser()

  if (auth.response || !auth.user) return { ...auth, role: null }

  const role = await getUserRole(auth.supabase, auth.user.id)

  if (!role || !allowedRoles.includes(role)) {
    return {
      ...auth,
      role,
      response: jsonError("Forbidden", 403),
    }
  }

  return { ...auth, role, response: null }
}
