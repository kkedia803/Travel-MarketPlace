"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/contexts/auth-context"
import { supabase } from "@/app/lib/supabase"
import { Calendar, Clock, MapPin, User } from "lucide-react"

interface Booking {
  id: string
  package_id: string
  user_id: string
  travelers: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  package: {
    id: string
    title: string
    destination: string
    price: number
    duration: number
    images: string[]
  }
}

export default function UserDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchBookings = async () => {
      setLoading(true)

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            package:packages (
              id, title, destination, price, duration, images
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setBookings(data || [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
        // For demo purposes, let's add mock data
        const mockBookings = [
          {
            id: "1",
            package_id: "1",
            user_id: user.id,
            travelers: 2,
            status: "confirmed",
            created_at: "2023-05-15T10:30:00Z",
            package: {
              id: "1",
              title: "Bali Paradise",
              destination: "Bali, Indonesia",
              price: 1299,
              duration: 7,
              images: ["/placeholder.svg?height=400&width=600"],
            },
          },
          {
            id: "2",
            package_id: "2",
            user_id: user.id,
            travelers: 1,
            status: "pending",
            created_at: "2023-06-20T14:45:00Z",
            package: {
              id: "2",
              title: "Swiss Alps Adventure",
              destination: "Switzerland",
              price: 1899,
              duration: 10,
              images: ["/placeholder.svg?height=400&width=600"],
            },
          },
        ] as Booking[]

        setBookings(mockBookings)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookings and account</p>
        </div>
        <Button onClick={() => router.push("/explore")}>Browse Packages</Button>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded mb-2 w-full" />
                    <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No bookings yet</CardTitle>
                <CardDescription>You haven't made any bookings yet. Start exploring travel packages!</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => router.push("/explore")}>Browse Packages</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 h-48 md:h-auto">
                      <img
                        src={booking.package.images[0] || "/placeholder.svg?height=400&width=600"}
                        alt={booking.package.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{booking.package.title}</h3>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.package.destination}</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Booked on: {formatDate(booking.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Duration: {booking.package.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Travelers: {booking.travelers}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="font-semibold">Total: ₹{booking.package.price * booking.travelers}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/packages/${booking.package.id}`)}
                          >
                            View Package
                          </Button>
                          {booking.status === "pending" && (
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p>{user?.name || user?.email?.split("@")[0] || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="capitalize">{user?.role}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Edit Profile</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <p>••••••••</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Notifications</label>
                  <p>Enabled for bookings and promotions</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Notification Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

