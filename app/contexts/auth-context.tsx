"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useUser, useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import type { UserDetails } from "@/app/lib/supabase"
import { toast } from "@/hooks/use-toast"

type AuthContextType = {
  user: UserDetails | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, role: string, company: string, phone: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  reAuthenticate: (email:string, password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient()
  const session = useSession()
  const rawUser = useUser()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserDetails = async () => {
      if (!rawUser) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", rawUser.id)
        .single()

      if (error) {
        console.error("Failed to fetch user profile:", error)
      }

      setUser(
        data
          ? {
            id: rawUser.id,
            email: rawUser.email || "",
            role: data.role || "user",
            name: data.name,
            avatar_url: data.avatar_url,
            length: 0,
          }
          : null
      )
      setLoading(false)
    }

    getUserDetails()
  }, [rawUser, supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    toast({
      title: error ? "Sign In Failed" : "Sign In Successful",
      description: error ? error.message : "Welcome back!",
      variant: error ? "destructive" : "success",
    })
    return { error }
  }

  const signUp = async (email: string, password: string, role: string, company_name: string, phone_number: string) => {
    const requestedRole = role === "seller" ? "seller" : "user"
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: requestedRole,
        company_name,
        phone_number,
      }),
    })
    const result = await response.json().catch(() => null)
    const error = response.ok ? null : { message: result?.error || "Sign up failed" }

    toast({
      title: error ? "Sign Up Failed" : "Successfull! Please Confirm Email",
      description: error ? error.message : "Please check your Email inbox for confirmation link.",
      variant: error ? "destructive" : "success",
    })

    return { error }
  }

  const reAuthenticate = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };


  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast({
      title: "Sign Out Successful",
      description: "You have been signed out.",
      variant: "success",
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut,reAuthenticate }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
