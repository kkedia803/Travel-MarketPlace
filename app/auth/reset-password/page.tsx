"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from '@/hooks/use-toast'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const supabase = createClientComponentClient()

    useEffect(() => {
        // Automatically check if user is coming from reset link
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                // Not logged in, but token present means it's a password reset session
                // Supabase auto-logs user in when they click reset link
                router.push("/auth/login")
            }
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const { error } = await supabase.auth.updateUser({ password })


        if (error) {
            if (error?.code == "same_password") {
                toast({
                    title: "Error",
                    description: "New password cannot be the same as the old one.",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update password. Please try again.",
                    variant: "destructive",
                })
            }
        } else {
            toast({
                title: "Success",
                description: "Password updated successfully!",
                variant: "success",
            })
            setTimeout(() => {
                router.push("/")
            }, 2000)
        }

        setIsLoading(false)
    }

    return (
        <div className="container flex h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-semibold text-center">Set a new password</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 pt-6">
                            <Input
                                id="password"
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
