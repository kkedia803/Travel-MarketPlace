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
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/auth-context"
import { supabase } from "@/app/lib/supabase"
import { Check, Eye, Package, User, Users, DollarSign, X, BarChart3 } from "lucide-react"

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
  seller: {
    email: string
    name?: string
  }
}

interface Seller {
  id: string
  email: string
  name?: string
  role: string
  created_at: string
  packages_count: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [pendingPackages, setPendingPackages] = useState<TravelPackage[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null)
  const [isPackageDetailsOpen, setIsPackageDetailsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      setLoading(true)

      try {
        // Fetch pending packages
        const { data: packagesData, error: packagesError } = await supabase
          .from("packages")
          .select(`
            *,
            seller:profiles (email, name)
          `)
          .eq("is_approved", false)
          .order("created_at", { ascending: false })

        if (packagesError) throw packagesError

        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "seller")
          .order("created_at", { ascending: false })

        if (sellersError) throw sellersError

        // Count packages for each seller
        const sellersWithCounts = await Promise.all(
          sellersData.map(async (seller) => {
            const { count } = await supabase
              .from("packages")
              .select("*", { count: "exact", head: true })
              .eq("seller_id", seller.id)

            return {
              ...seller,
              packages_count: count || 0,
            }
          }),
        )

        setPendingPackages(packagesData || [])
        setSellers(sellersWithCounts)
      } catch (error) {
        console.error("Error fetching data:", error)
        // For demo purposes, let's add mock data
        const mockPendingPackages = [
          {
            id: "1",
            title: "Swiss Alps Adventure",
            description: "Explore the majestic Swiss Alps with guided tours and luxury accommodations.",
            destination: "Switzerland",
            price: 1899,
            duration: 10,
            category: "Mountain Escapes",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller1",
            is_approved: false,
            created_at: "2023-05-15T14:45:00Z",
            seller: {
              email: "seller1@example.com",
              name: "Alpine Tours",
            },
          },
          {
            id: "2",
            title: "Tokyo Cultural Experience",
            description: "Immerse yourself in Japanese culture with this comprehensive Tokyo tour.",
            destination: "Japan",
            price: 2199,
            duration: 12,
            category: "Cultural Tours",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller2",
            is_approved: false,
            created_at: "2023-06-10T09:30:00Z",
            seller: {
              email: "seller2@example.com",
              name: "Asia Explorers",
            },
          },
        ] as TravelPackage[]

        const mockSellers = [
          {
            id: "seller1",
            email: "seller1@example.com",
            name: "Alpine Tours",
            role: "seller",
            created_at: "2023-03-10T08:30:00Z",
            packages_count: 5,
          },
          {
            id: "seller2",
            email: "seller2@example.com",
            name: "Asia Explorers",
            role: "seller",
            created_at: "2023-04-15T14:45:00Z",
            packages_count: 3,
          },
          {
            id: "seller3",
            email: "seller3@example.com",
            name: "Beach Getaways Inc.",
            role: "seller",
            created_at: "2023-05-20T11:15:00Z",
            packages_count: 7,
          },
        ] as Seller[]

        setPendingPackages(mockPendingPackages)
        setSellers(mockSellers)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const handleApprovePackage = async (packageId: string) => {
    try {
      const { error } = await supabase.from("packages").update({ is_approved: true }).eq("id", packageId)

      if (error) throw error

      setPendingPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))

      toast({
        title: "Package approved",
        description: "The package has been approved and is now visible to users.",
      })

      setIsPackageDetailsOpen(false)
    } catch (error) {
      console.error("Error approving package:", error)
      toast({
        title: "Failed to approve package",
        description: "There was an error approving the package. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectPackage = async (packageId: string) => {
    try {
      const { error } = await supabase.from("packages").delete().eq("id", packageId)

      if (error) throw error

      setPendingPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))

      toast({
        title: "Package rejected",
        description: "The package has been rejected and removed from the system.",
      })

      setIsPackageDetailsOpen(false)
    } catch (error) {
      console.error("Error rejecting package:", error)
      toast({
        title: "Failed to reject package",
        description: "There was an error rejecting the package. Please try again.",
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

  // Mock statistics for the dashboard
  const statistics = {
    totalUsers: 124,
    totalSellers: sellers.length,
    totalPackages: 45,
    totalBookings: 78,
    revenue: 89750,
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the travel marketplace platform</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{statistics.totalUsers}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sellers</p>
              <p className="text-3xl font-bold">{statistics.totalSellers}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
              <p className="text-3xl font-bold">{statistics.totalPackages}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">${statistics.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
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
          ) : pendingPackages.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No pending packages</CardTitle>
                <CardDescription>There are no packages waiting for approval at the moment.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingPackages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{pkg.title}</CardTitle>
                    <CardDescription>
                      Submitted by {pkg.seller.name || pkg.seller.email} on {formatDate(pkg.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Destination</p>
                        <p className="text-sm">{pkg.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-sm">${pkg.price}/person</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm">{pkg.duration} days</p>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2">{pkg.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setSelectedPackage(pkg)
                        setIsPackageDetailsOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleRejectPackage(pkg.id)}
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => handleApprovePackage(pkg.id)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sellers">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
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
          ) : sellers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No sellers registered</CardTitle>
                <CardDescription>There are no sellers registered on the platform yet.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {sellers.map((seller) => (
                <Card key={seller.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{seller.name || seller.email}</CardTitle>
                    <CardDescription>{seller.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Registered On</p>
                        <p className="text-sm">{formatDate(seller.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Packages</p>
                        <p className="text-sm">{seller.packages_count}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Packages
                    </Button>
                    <Button variant="secondary" size="sm">
                      Contact Seller
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Destinations</CardTitle>
                <CardDescription>Most booked destinations</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Bali, Indonesia</p>
                      <p className="text-sm font-medium">24%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Switzerland</p>
                      <p className="text-sm font-medium">18%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Japan</p>
                      <p className="text-sm font-medium">15%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Greece</p>
                      <p className="text-sm font-medium">12%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "12%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">France</p>
                      <p className="text-sm font-medium">10%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Revenue chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">User growth chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Package Details Dialog */}
      <Dialog open={isPackageDetailsOpen} onOpenChange={setIsPackageDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
            <DialogDescription>Review the package details before approving or rejecting.</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="grid gap-6 py-4">
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <img
                  src={selectedPackage.images[0] || "/placeholder.svg?height=400&width=600"}
                  alt={selectedPackage.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">{selectedPackage.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedPackage.destination}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm">${selectedPackage.price}/person</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm">{selectedPackage.duration} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm">{selectedPackage.category}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm">{selectedPackage.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Seller Information</p>
                <p className="text-sm">{selectedPackage.seller.name || "N/A"}</p>
                <p className="text-sm">{selectedPackage.seller.email}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => selectedPackage && handleRejectPackage(selectedPackage.id)}>
              <X className="mr-2 h-4 w-4" /> Reject Package
            </Button>
            <Button onClick={() => selectedPackage && handleApprovePackage(selectedPackage.id)}>
              <Check className="mr-2 h-4 w-4" /> Approve Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

