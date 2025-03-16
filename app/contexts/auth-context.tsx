"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type UserDetails } from "@/app/lib/supabase"

type AuthContextType = {
  user: UserDetails | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const userDetails = await getUserDetails()
          setUser(userDetails)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const userDetails = await getUserDetails()
        setUser(userDetails)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, role: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password })

    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: role as "user" | "seller" | "admin",
        name: email.split("@")[0],
      })
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

async function getUserDetails(): Promise<UserDetails | null> {
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

