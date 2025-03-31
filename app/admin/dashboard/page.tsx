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
import { Check, Eye, Package, User, Users, DollarSign, X, AlertCircle } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

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

interface Statistics {
  totalSellers: number
  totalPackages: number
  totalBookings: number
}

interface MonthlyData {
  name: string
  bookings: number
  revenue: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [pendingPackages, setPendingPackages] = useState<TravelPackage[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null)
  const [isPackageDetailsOpen, setIsPackageDetailsOpen] = useState(false)
  const [statistics, setStatistics] = useState<Statistics>({
    totalSellers: 0,
    totalPackages: 0,
    totalBookings: 0,
  })

  // Analytics data states
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [monthlyBooking, setMonthlyBooking] = useState<{ name: string; bookings: number }[]>([])
  const [destinationData, setDestinationData] = useState<{ name: string; value: number }[]>([])
  const [userGrowthData, setUserGrowthData] = useState<{ name: string; users: number }[]>([])
  const [revenueData, setRevenueData] = useState<{ name: string; revenue: number }[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    fetchUserGrowthData();
    fetchPopularDestinationData();
    fetchBookingsData();
    fetchRevenueData();
  }, []);

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
      setError(null)

      try {
        // Fetch pending packages
        const { data: packagesData, error: packagesError } = await supabase
          .from("packages")
          .select(`
            *,
            seller:profiles (id, name)
          `)
          .eq("is_approved", false)
          .order("created_at", { ascending: false })

        if (packagesError) throw new Error(`Error fetching pending packages: ${packagesError.message}`)

        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "seller")
          .order("created_at", { ascending: false })

        if (sellersError) throw new Error(`Error fetching sellers: ${sellersError.message}`)

        // Count packages for each seller
        const sellersWithCounts = await Promise.all(
          sellersData.map(async (seller) => {
            const { count, error: countError } = await supabase
              .from("packages")
              .select("*", { count: "exact", head: true })
              .eq("seller_id", seller.id)

            if (countError) {
              console.error(`Error counting packages for seller ${seller.id}:`, countError)
              return {
                ...seller,
                packages_count: 0,
              }
            }

            return {
              ...seller,
              packages_count: count || 0,
            }
          }),
        )

        // 2. Total packages
        const { count: packagesCount, error: totalPackagesError } = await supabase
          .from("packages")
          .select("*", { count: "exact", head: true })

        if (totalPackagesError) throw new Error(`Error counting packages: ${totalPackagesError.message}`)

        // 3. Total bookings
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })

        if (bookingsError) throw new Error(`Error counting bookings: ${bookingsError.message}`)

        setPendingPackages(packagesData || [])
        setSellers(sellersWithCounts)
        setStatistics({
          totalSellers: sellersData?.length || 0,
          totalPackages: packagesCount || 0,
          totalBookings: bookingsCount || 0,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")

        toast({
          title: "Error loading dashboard data",
          description: error instanceof Error ? error.message : "Failed to load dashboard data",
          variant: "destructive",
        })

        // Initialize with empty data
        setPendingPackages([])
        setSellers([])
        setStatistics({
          totalSellers: 0,
          totalPackages: 0,
          totalBookings: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router, toast])

  async function fetchRevenueData() {
    try {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
  
      const currentYear = new Date().getFullYear();
  
      // Fetch confirmed bookings
      const { data: bookingsData, error: revenueError } = await supabase
        .from("bookings")
        .select("package_id, travelers, created_at")
        .eq("status", "confirmed")
        .gte("created_at", `${currentYear}-01-01`) // Filter for the current year
        .lte("created_at", `${currentYear}-12-31`);
  
      if (revenueError) throw new Error(`Error fetching booking revenue data: ${revenueError.message}`);
  
      if (!bookingsData || bookingsData.length === 0) {
        console.log("No revenue data found");
        return;
      }
  
      // Get unique package IDs
      const packageIds = [...new Set(bookingsData.map(booking => booking.package_id))];
  
      // Fetch package prices
      const { data: packagePrices, error: pricesError } = await supabase
        .from("packages")
        .select("id, price")
        .in("id", packageIds);
  
      if (pricesError) throw new Error(`Error fetching package prices: ${pricesError.message}`);
  
      // Create a price map for quick lookup
      const priceMap = new Map(packagePrices.map(pkg => [pkg.id, pkg.price]));
  
      // Initialize an array to store revenue for each month
      const monthlyRevenue = Array(12).fill(0);
  
      // Calculate revenue per month
      bookingsData.forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        const month = bookingDate.getMonth(); // 0-11
        const price = priceMap.get(booking.package_id) || 0;
        monthlyRevenue[month] += price * booking.travelers;
      });
  
      // Format data for charts
      const revenueChartData = months.map((month, index) => ({
        name: month,
        revenue: monthlyRevenue[index]
      }));

      const totalRevenue = monthlyRevenue.reduce((sum, count) => sum + count, 0);
  
      setRevenueData(revenueChartData);
      setTotalRevenue(totalRevenue)
      console.log("Revenue Chart Data:", revenueChartData);
  
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }
  

  async function fetchBookingsData() {
    try {
      // Define months array
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      // Get the current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      // Fetch user registration data grouped by month
      const { data, error } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', `${currentYear}-01-01`) // Filter for current year
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;

      // Process the data to group by month
      const monthlyData = Array(12).fill(0);

      data.forEach(user => {
        const userDate = new Date(user.created_at);
        const month = userDate.getMonth(); // 0-11
        monthlyData[month]++;
      });

      const bookingGrowth = months.map((month, index) => ({
        name: month,
        users: monthlyData[index]
      }));

      setMonthlyBooking(bookingGrowth.map(({ name, users }) => ({ name, bookings: users })));
      console.log('Booking Growth Data:', bookingGrowth);
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  }

  async function fetchPopularDestinationData() {
    try {
      // Fetch distinct destinations and their count
      const { data, error } = await supabase
        .from('bookings')
        .select('destination')
        .order('destination', { ascending: true });

      if (error) throw error;

      // Process data to count occurrences of each destination
      const destinationCount = data.reduce<Record<string, number>>((acc, { destination }) => {
        acc[destination] = (acc[destination] || 0) + 1;
        return acc;
      }, {});

      // Convert to an array sorted by popularity
      const popularDestinations = Object.entries(destinationCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      console.log('Popular Destinations:', popularDestinations);
      setDestinationData(popularDestinations);
    } catch (error) {
      console.error('Error fetching popular destination data:', error);
    }
  }


  // Function to fetch user growth data from Supabase
  async function fetchUserGrowthData() {
    try {
      // Define months array
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      // Get the current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      // Fetch user registration data grouped by month
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', `${currentYear}-01-01`) // Filter for current year
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;

      // Process the data to group by month
      const monthlyData = Array(12).fill(0);

      data.forEach(user => {
        const userDate = new Date(user.created_at);
        const month = userDate.getMonth(); // 0-11
        monthlyData[month]++;
      });

      const userGrowth = months.map((month, index) => ({
        name: month,
        users: monthlyData[index]
      }));

      const totalUsers = monthlyData.reduce((sum, count) => sum + count, 0);

      setUserGrowthData(userGrowth);
      setTotalUsers(totalUsers);
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  }

  const handleApprovePackage = async (packageId: string) => {
    try {
      const { error } = await supabase.from("packages").update({ is_approved: true }).eq("id", packageId)

      if (error) throw error

      setPendingPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))

      // Update total packages count in statistics
      setStatistics(prev => ({
        ...prev,
        totalPackages: prev.totalPackages // Count remains the same as the package still exists
      }))

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

      // Update total packages count in statistics
      setStatistics(prev => ({
        ...prev,
        totalPackages: Math.max(0, prev.totalPackages - 1)
      }))

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

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  const ErrorDisplay = ({ message }: { message: string }) => (
    <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
      <CardContent className="p-6 flex items-center gap-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <h3 className="font-medium">Error loading data</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the travel marketplace platform</p>
        </div>
      </div>

      {error && <ErrorDisplay message={error} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="text-3xl font-bold"></p>
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
              <p className="text-3xl font-bold">₹{totalRevenue}</p>
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
                        <p className="text-sm">₹{pkg.price}/person</p>
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
            {/* Monthly Bookings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyBooking}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} bookings`, 'Bookings']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="bookings" fill="#8884d8" name="Bookings" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Destinations Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Destinations</CardTitle>
                <CardDescription>Most booked destinations</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={destinationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {destinationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} users`, 'New Users']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                      name="New Users"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
                  <p className="text-sm">₹{selectedPackage.price}/person</p>
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