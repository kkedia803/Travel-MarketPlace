import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = "user" | "seller" | "admin"

export interface UserDetails {
  id: string
  email: string
  role: UserRole
  name?: string
  avatar_url?: string
}

export async function getUserDetails(): Promise<UserDetails | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return data
    ? {
        id: user.id,
        email: user.email || "",
        role: data.role || "user",
        name: data.name,
        avatar_url: data.avatar_url,
      }
    : null
}

