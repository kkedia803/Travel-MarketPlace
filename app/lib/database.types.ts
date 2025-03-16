export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          role: "user" | "seller" | "admin"
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          role?: "user" | "seller" | "admin"
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          role?: "user" | "seller" | "admin"
          avatar_url?: string | null
          created_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          title: string
          description: string
          destination: string
          price: number
          duration: number
          category: string
          seller_id: string
          images: string[]
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          destination: string
          price: number
          duration: number
          category: string
          seller_id: string
          images: string[]
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          destination?: string
          price?: number
          duration?: number
          category?: string
          seller_id?: string
          images?: string[]
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          package_id: string
          user_id: string
          travelers: number
          status: "pending" | "confirmed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_id: string
          travelers: number
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_id?: string
          travelers?: number
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
      }
    }
  }
}

