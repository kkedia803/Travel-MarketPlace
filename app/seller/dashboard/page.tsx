"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/auth-context"
import { supabase } from "@/app/lib/supabase"
import { Edit, Plus, Trash, Package, Clock, DollarSign, MapPin } from "lucide-react"

interface TravelPackage {
  id: string
  title: string
  description: string
  destination: string
  price: number
  duration: number
  category: string
  images: string[]
  seller_id: string
  is_approved: boolean
  created_at: string
}

interface Booking {
  id: string
  package_id: string
  user_id: string
  travelers: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  user: {
    email: string
    name?: string
  }
  package: {
    title: string
  }
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    destination: "",
    price: 0,
    duration: 1,
    category: "",
    images: ["/placeholder.svg?height=400&width=600"],
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "seller") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      setLoading(true)

      try {
        // Fetch packages
        const { data: packagesData, error: packagesError } = await supabase
          .from("packages")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false })

        if (packagesError) throw packagesError

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            user:profiles (email, name),
            package:packages (title)
          `)
          .in("package_id", packagesData?.map((pkg) => pkg.id) || [])
          .order("created_at", { ascending: false })

        if (bookingsError) throw bookingsError

        setPackages(packagesData || [])
        setBookings(bookingsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        // For demo purposes, let's add mock data
        const mockPackages = [
          {
            id: "1",
            title: "Bali Paradise",
            description: "Experience the beauty of Bali with this all-inclusive package.",
            destination: "Bali, Indonesia",
            price: 1299,
            duration: 7,
            category: "Beach Getaways",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: user.id,
            is_approved: true,
            created_at: "2023-04-10T08:30:00Z",
          },
          {
            id: "2",
            title: "Swiss Alps Adventure",
            description: "Explore the majestic Swiss Alps with guided tours and luxury accommodations.",
            destination: "Switzerland",
            price: 1899,
            duration: 10,
            category: "Mountain Escapes",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: user.id,
            is_approved: false,
            created_at: "2023-05-15T14:45:00Z",
          },
        ] as TravelPackage[]

        const mockBookings = [
          {
            id: "1",
            package_id: "1",
            user_id: "user1",
            travelers: 2,
            status: "confirmed",
            created_at: "2023-05-20T10:30:00Z",
            user: {
              email: "john@example.com",
              name: "John Doe",
            },
            package: {
              title: "Bali Paradise",
            },
          },
          {
            id: "2",
            package_id: "1",
            user_id: "user2",
            travelers: 1,
            status: "pending",
            created_at: "2023-06-05T16:20:00Z",
            user: {
              email: "jane@example.com",
              name: "Jane Smith",
            },
            package: {
              title: "Bali Paradise",
            },
          },
        ] as Booking[]

        setPackages(mockPackages)
        setBookings(mockBookings)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const handleAddPackage = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .insert({
          ...newPackage,
          seller_id: user?.id,
          is_approved: false,
        })
        .select()

      if (error) throw error

      toast({
        title: "Package added successfully",
        description: "Your package has been submitted for approval.",
      })

      setPackages((prev) => [data[0], ...prev])
      setIsAddPackageOpen(false)
      setNewPackage({
        title: "",
        description: "",
        destination: "",
        price: 0,
        duration: 1,
        category: "",
        images: ["/placeholder.svg?height=400&width=600"],
      })
    } catch (error) {
      console.error("Error adding package:", error)
      toast({
        title: "Failed to add package",
        description: "There was an error adding your package. Please try again.",
        variant: "destructive",
      })
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

  const getApprovalStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your travel packages and bookings</p>
        </div>
        <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Travel Package</DialogTitle>
              <DialogDescription>
                Fill in the details for your new travel package. It will be submitted for admin approval.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Package Title</Label>
                  <Input
                    id="title"
                    value={newPackage.title}
                    onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                    placeholder="e.g. Bali Paradise Retreat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={newPackage.destination}
                    onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                    placeholder="e.g. Bali, Indonesia"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  placeholder="Describe your travel package..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPackage.price || ""}
                    onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                    placeholder="e.g. 1299"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newPackage.duration || ""}
                    onChange={(e) => setNewPackage({ ...newPackage, duration: Number(e.target.value) })}
                    placeholder="e.g. 7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPackage.category}
                    onValueChange={(value) => setNewPackage({ ...newPackage, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beach Getaways">Beach Getaways</SelectItem>
                      <SelectItem value="Mountain Escapes">Mountain Escapes</SelectItem>
                      <SelectItem value="Cultural Tours">Cultural Tours</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPackageOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPackage}>Add Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="packages">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="packages">My Packages</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
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
          ) : packages.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No packages yet</CardTitle>
                <CardDescription>
                  You haven't added any travel packages yet. Click the "Add New Package" button to get started.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setIsAddPackageOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Package
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 h-48 md:h-auto">
                      <img
                        src={pkg.images[0] || "/placeholder.svg?height=400&width=600"}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{pkg.title}</h3>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{pkg.destination}</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge className={getApprovalStatusColor(pkg.is_approved)}>
                            {pkg.is_approved ? "Approved" : "Pending Approval"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Price: {pkg.price}/person</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Duration: {pkg.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Category: {pkg.category}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Created on: {formatDate(pkg.created_at)}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1">
                            <Trash className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

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
                <CardDescription>
                  You haven't received any bookings yet. Make sure your packages are approved and visible to users.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <CardTitle>{booking.package.title}</CardTitle>
                        <CardDescription>Booking ID: {booking.id}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-sm">{booking.user.name || booking.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Travelers</p>
                        <p className="text-sm">{booking.travelers}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Booking Date</p>
                        <p className="text-sm">{formatDate(booking.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          Confirm
                        </Button>
                        <Button variant="destructive" size="sm">
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="secondary" size="sm">
                      Contact Customer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

