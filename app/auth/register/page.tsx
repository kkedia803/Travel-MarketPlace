"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Compass, Eye, EyeClosed } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FcGoogle } from "react-icons/fc";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "user"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<string>(defaultRole)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`, // dynamically handles localhost or prod
        },
      })

      if (error) {
        console.error("Google sign-in error:", error.message)
      }
    } catch (err) {
      console.error("Unexpected Google sign-in error:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate seller terms acceptance
    if (role === "seller" && !acceptedTerms) {
      setError("You must accept the Travel Partner Terms of Service to register as a seller")
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(email, password, role, company, phone)

      if ("error" in result && result.error) {
        setError(result.error.message)
        return
      }

      router.push("/")
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen justify-center">
      <div className="w-full md:w-1/2 flex items-center justify-center overflow-y-auto">
        <div className="flex w-full max-w-lg flex-col justify-center space-y-6 mb-10 ">
          {/* <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center">
              <Compass className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Create an Account!</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div> */}

          {/* Google Sign-In */}
          <div className="flex items-center justify-center">
            <div
              onClick={handleGoogleSignIn}
              className="flex items-center max-w-xl text-white justify-center gap-3 px-3 py-2 bg-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-600 text-md font-medium"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </div>
          </div>


          {/* Horizontal Separator with "or" */}
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-muted-foreground/40"></div>
            <span className="px-4 text-sm bg-background font-medium">
              OR
            </span>
            <div className="flex-grow border-t border-muted-foreground/40"></div>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {role === "seller" && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Your Travel Agency/Company Name"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3 text-muted-foreground"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeClosed className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <RadioGroup
                      defaultValue={role}
                      onValueChange={setRole}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user" className="font-normal">
                          Traveler - I want to book trips
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller" className="font-normal">
                          Seller - I want to list travel packages
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {role === "seller" && (
                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      />
                      <Label 
                        htmlFor="terms" 
                        className="font-normal text-sm leading-relaxed cursor-pointer"
                      >
                        I accept the{" "}
                        <Link 
                          href="/tnc/seller" 
                          target="_blank"
                          className="text-primary hover:underline font-medium"
                        >
                          Travel Partner Terms of Service
                        </Link>
                        {" "}and understand that I am fully responsible for trip safety, itinerary fulfillment, and customer satisfaction.
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (role === "seller" && !acceptedTerms)}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
