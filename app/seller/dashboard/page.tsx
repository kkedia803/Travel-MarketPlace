"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/contexts/auth-context";
import { supabase } from "@/app/lib/supabase";
import {
  Eye,
  Check,
  X,
  AlertCircle,
  Edit,
  User,
  Users,
  Plus,
  Trash,
  Package,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
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
} from "recharts";
import { ImageUpload } from "@/components/ui/image-upload";

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  category: string;
  images: string[];
  seller_id: string;
  is_approved: boolean;
  created_at: string;
  max_people: number;
  boarding_point: string;
  discount: number;
  cancellation_policy: string | string[],
  itinerary: { day: number; title: string; description: string }[],
  inclusion: string[],
  exclusion: string[],
  final_price: number;
}

interface Booking {
  id: string;
  package_id: string;
  user_id: string;
  travelers: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  user: {
    email: string;
    name?: string;
  };
  package: {
    title: string;
  };
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [newPackage, setNewPackage] = useState<{
    id?: string;
    title: string;
    description: string;
    destination: string;
    price: number;
    duration: number;
    category: string;
    images: string[],
    max_people: number;
    boarding_point: string;
    discount: number;
    cancellation_policy: string | string[];
    itinerary: { day: number; title: string; description: string }[];
    inclusion: string[];
    exclusion: string[];
  }>({
    title: "",
    description: "",
    destination: "",
    price: 0,
    duration: 1,
    category: "",
    images: [],
    max_people: 1,
    boarding_point: "",
    discount: 0,
    cancellation_policy: "",
    itinerary: [{ day: 1, title: "", description: "" }],
    inclusion: [] as string[],
    exclusion: [] as string[],
  });

  // const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
  const [monthlyBooking, setMonthlyBooking] = useState<{ name: string; bookings: number }[]>([]);
  const [destinationData, setDestinationData] = useState<{ name: string; value: number }[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<{ name: string; users: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; revenue: number }[]>([]);
  // const [totalUsers, setTotalUsers] = useState(0);
  // const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserGrowthData(user.id);
      fetchPopularDestinationData(user.id);
      fetchBookingsData(user.id);
      fetchRevenueData(user.id);
    }
  }, [user]);
  
  const handleAddItineraryLine = () => {
    setNewPackage((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }],
    }));
  };

  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    setNewPackage((prev) => {
      const updatedItinerary = [...prev.itinerary];
      updatedItinerary[index][field] = value;
      return { ...prev, itinerary: updatedItinerary };
    });
  };

  const handleAddInclusionItem = () => {
    setNewPackage((prev) => ({
      ...prev,
      inclusion: [...prev.inclusion, ""],
    }));
  };

  const handleInclusionChange = (index: number, value: string) => {
    setNewPackage((prev) => {
      const updatedInclusion = [...prev.inclusion];
      updatedInclusion[index] = value;
      return { ...prev, inclusion: updatedInclusion };
    });
  };

  const handleAddExclusionItem = () => {
    setNewPackage((prev) => ({
      ...prev,
      exclusion: [...prev.exclusion, ""],
    }));
  };

  const handleExclusionChange = (index: number, value: string) => {
    setNewPackage((prev) => {
      const updatedExclusion = [...prev.exclusion];
      updatedExclusion[index] = value;
      return { ...prev, exclusion: updatedExclusion };
    });
  };

  const handleAddCancellationPolicyItem = () => {
    setNewPackage((prev) => ({
      ...prev,
      cancellation_policy: [...(Array.isArray(prev.cancellation_policy) ? prev.cancellation_policy : []), ""],
    }));
  };

  const handleCancellationPolicyChange = (index: number, value: string) => {
    setNewPackage((prev) => {
      const updatedPolicy = [...(Array.isArray(prev.cancellation_policy) ? prev.cancellation_policy : [])];
      updatedPolicy[index] = value;
      return { ...prev, cancellation_policy: updatedPolicy };
    });
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "seller") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: packagesData, error: packagesError } = await supabase
          .from("packages")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (packagesError) throw packagesError;

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(
            `
            *,
            package:packages (title)
          `
          )
          .in("package_id", packagesData?.map((pkg) => pkg.id) || [])
          .order("created_at", { ascending: false });

        if (bookingsError) throw bookingsError;

        setPackages(packagesData || []);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleAddPackage = async () => {
    try {
      console.log("Submitting package:", newPackage);
      const { data, error } = await supabase
        .from("packages")
        .insert({
          ...newPackage,
          seller_id: user?.id,
          is_approved: false,
        })
        .select();

      console.log("Supabase response:", { data, error });

      if (error) throw error;

      toast({
        title: "Package added successfully",
        description: "Your package has been submitted for approval.",
      });

      setPackages((prev) => [data[0], ...prev]);
      setIsAddPackageOpen(false);
      setNewPackage({
        title: "",
        description: "",
        destination: "",
        price: 0,
        duration: 1,
        category: "",
        images: ["/placeholder.svg?height=400&width=600"],
        max_people: 1,
        boarding_point: "",
        discount: 0,
        cancellation_policy: "",
        itinerary: [{ day: 1, title: "", description: "" }],
        inclusion: [] as string[],
        exclusion: [] as string[],
      });
    } catch (error) {
      console.error("Error adding package:", error);
      toast({
        title: "Failed to add package",
        description: "There was an error adding your package. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookingConfirm = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Booking Confirmed",
        description: "The booking has been successfully confirmed.",
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
        )
      );
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast({
        title: "Failed to Confirm Booking",
        description: "There was an error confirming the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePkgEdit = (pkgId: string) => {
    const pkgToEdit = packages.find((pkg) => pkg.id === pkgId);
    if (pkgToEdit) {
      const { final_price, ...editablePackage } = pkgToEdit;
      setNewPackage({
        ...editablePackage,
        itinerary: Array.isArray(editablePackage.itinerary)
          ? editablePackage.itinerary.map((item, index) => ({
            day: index + 1,
            title: item.title || "",
            description: item.description || "",
          }))
          : [{ day: 1, title: "", description: "" }],
        cancellation_policy: Array.isArray(editablePackage.cancellation_policy)
          ? editablePackage.cancellation_policy
          : [editablePackage.cancellation_policy || ""],
      });
      setFormStep(0);
      setIsAddPackageOpen(true);
    }
  };

  const handleUpdatePackage = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .update({
          ...newPackage,
          seller_id: user?.id,
        })
        .eq("id", newPackage.id)
        .select();

      if (error) throw error;

      toast({
        title: "Package updated successfully",
        description: "Your package details have been updated.",
      });

      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === newPackage.id ? data[0] : pkg))
      );
      setIsAddPackageOpen(false);
      setNewPackage({
        title: "",
        description: "",
        destination: "",
        price: 0,
        duration: 1,
        category: "",
        images: ["/placeholder.svg?height=400&width=600"],
        max_people: 1,
        boarding_point: "",
        discount: 0,
        cancellation_policy: "",
        itinerary: [{ day: 1, title: "", description: "" }],
        inclusion: [] as string[],
        exclusion: [] as string[],
      });
    } catch (error) {
      console.error("Error updating package:", error);
      toast({
        title: "Failed to update package",
        description: "There was an error updating your package. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePkgDelete = async (pkgId: string) => {
    const { error } = await supabase.from("packages").delete().eq("id", pkgId);

    if (error) {
      console.error("Error deleting package:", error);
      toast({
        title: "Failed to Delete Package",
        description: "There was an error deleting the package. Please try again.",
        variant: "destructive",
      });
    } else {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== pkgId));
      toast({
        title: "Package Deleted",
        description: "The package has been successfully deleted.",
      });
    }
  };

  const handleBookingCancelled = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getApprovalStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  };

  const nextFormStep = () => {
    setFormStep((prev) => Math.min(prev + 1, 3));
  };

  const prevFormStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 0));
  };

  const formSteps = ["Basic Info", "Details", "Policies", "Review"];

  async function fetchRevenueData(sellerId: string) {
    try {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
  
      const currentYear = new Date().getFullYear();
      
      const { data: sellerPackages, error: packagesError } = await supabase
        .from("packages")
        .select("id")
        .eq("seller_id", sellerId);
        
      if (packagesError) throw new Error(`Error fetching seller packages: ${packagesError.message}`);
      
      if (!sellerPackages || sellerPackages.length === 0) {
        console.log("No packages found for this seller");
        setRevenueData(months.map(name => ({ name, revenue: 0 })));
        // setTotalRevenue(0);
        return;
      }
      
      const packageIds = sellerPackages.map(pkg => pkg.id);
  
      const { data: bookingsData, error: revenueError } = await supabase
        .from("bookings")
        .select("package_id, travelers, created_at")
        .eq("status", "confirmed")
        .in("package_id", packageIds)
        .gte("created_at", `${currentYear}-01-01`)
        .lte("created_at", `${currentYear}-12-31`);
  
      if (revenueError) throw new Error(`Error fetching booking revenue data: ${revenueError.message}`);
  
      if (!bookingsData || bookingsData.length === 0) {
        console.log("No revenue data found for this seller");
        setRevenueData(months.map(name => ({ name, revenue: 0 })));
        // setTotalRevenue(0);
        return;
      }
  
      const { data: packagePrices, error: pricesError } = await supabase
        .from("packages")
        .select("id, price")
        .in("id", packageIds);
  
      if (pricesError) throw new Error(`Error fetching package prices: ${pricesError.message}`);
  
      const priceMap = new Map(packagePrices.map(pkg => [pkg.id, pkg.price]));
  
      const monthlyRevenue = Array(12).fill(0);
  
      bookingsData.forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        const month = bookingDate.getMonth();
        const price = priceMap.get(booking.package_id) || 0;
        monthlyRevenue[month] += price * booking.travelers;
      });
  
      const revenueChartData = months.map((month, index) => ({
        name: month,
        revenue: monthlyRevenue[index]
      }));

      const totalRevenue = monthlyRevenue.reduce((sum, count) => sum + count, 0);
  
      setRevenueData(revenueChartData);
      // setTotalRevenue(totalRevenue);
      console.log("Revenue Chart Data for seller:", revenueChartData);
  
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }
  

  async function fetchBookingsData(sellerId: string) {
    try {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const currentYear = new Date().getFullYear();
      
      const { data: sellerPackages, error: packagesError } = await supabase
        .from("packages")
        .select("id")
        .eq("seller_id", sellerId);
        
      if (packagesError) throw new Error(`Error fetching seller packages: ${packagesError.message}`);
      
      if (!sellerPackages || sellerPackages.length === 0) {
        console.log("No packages found for this seller");
        setMonthlyBooking(months.map(name => ({ name, bookings: 0 })));
        return;
      }
      
      const packageIds = sellerPackages.map(pkg => pkg.id);

      const { data, error } = await supabase
        .from('bookings')
        .select('created_at')
        .in('package_id', packageIds)
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;

      const monthlyData = Array(12).fill(0);

      if (data && data.length > 0) {
        data.forEach(booking => {
          const bookingDate = new Date(booking.created_at);
          const month = bookingDate.getMonth();
          monthlyData[month]++;
        });
      }

      const bookingGrowth = months.map((month, index) => ({
        name: month,
        users: monthlyData[index]
      }));

      setMonthlyBooking(bookingGrowth.map(({ name, users }) => ({ name, bookings: users })));
      console.log('Booking Growth Data for seller:', bookingGrowth);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  }

  async function fetchPopularDestinationData(sellerId: string) {
    try {
      const { data: sellerPackages, error: packagesError } = await supabase
        .from("packages")
        .select("id, destination")
        .eq("seller_id", sellerId);
        
      if (packagesError) throw new Error(`Error fetching seller packages: ${packagesError.message}`);
      
      if (!sellerPackages || sellerPackages.length === 0) {
        console.log("No packages found for this seller");
        setDestinationData([]);
        return;
      }
      
      const packageIds = sellerPackages.map(pkg => pkg.id);
      
      const destinationMap = new Map(sellerPackages.map(pkg => [pkg.id, pkg.destination]));

      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('package_id')
        .in('package_id', packageIds);

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        const destinations = [...new Set(sellerPackages.map(pkg => pkg.destination))];
        setDestinationData(destinations.map(name => ({ name, value: 1 })));
        return;
      }

      const destinationCount: Record<string, number> = {};
      
      bookingsData.forEach(booking => {
        const destination = destinationMap.get(booking.package_id);
        if (destination) {
          destinationCount[destination] = (destinationCount[destination] || 0) + 1;
        }
      });

      const popularDestinations = Object.entries(destinationCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      console.log('Popular Destinations for seller:', popularDestinations);
      setDestinationData(popularDestinations);
    } catch (error) {
      console.error('Error fetching popular destination data:', error);
    }
  }

  async function fetchUserGrowthData(sellerId: string) {
    try {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const currentYear = new Date().getFullYear();
      
      const { data: sellerPackages, error: packagesError } = await supabase
        .from("packages")
        .select("id")
        .eq("seller_id", sellerId);
        
      if (packagesError) throw new Error(`Error fetching seller packages: ${packagesError.message}`);
      
      if (!sellerPackages || sellerPackages.length === 0) {
        console.log("No packages found for this seller");
        setUserGrowthData(months.map(name => ({ name, users: 0 })));
        // setTotalUsers(0);
        return;
      }
      
      const packageIds = sellerPackages.map(pkg => pkg.id);

      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('user_id, created_at')
        .in('package_id', packageIds)
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        setUserGrowthData(months.map(name => ({ name, users: 0 })));
        // setTotalUsers(0);
        return;
      }

      const userFirstBooking: Record<string, Date> = {};
      
      bookingsData.forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        if (!userFirstBooking[booking.user_id] || bookingDate < userFirstBooking[booking.user_id]) {
          userFirstBooking[booking.user_id] = bookingDate;
        }
      });

      const monthlyData = Array(12).fill(0);
      
      Object.values(userFirstBooking).forEach(date => {
        const month = date.getMonth();
        monthlyData[month]++;
      });

      const userGrowth = months.map((month, index) => ({
        name: month,
        users: monthlyData[index]
      }));

      const totalUsers = Object.keys(userFirstBooking).length;

      setUserGrowthData(userGrowth);
      // setTotalUsers(totalUsers);
      console.log('Customer Growth Data for seller:', userGrowth);
    } catch (error) {
      console.error('Error fetching customer growth data:', error);
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your travel packages and bookings
          </p>
        </div>
        <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              setNewPackage({
                title: "",
                description: "",
                destination: "",
                price: 0,
                duration: 1,
                category: "",
                images: ["/placeholder.svg?height=400&width=600"],
                max_people: 1,
                boarding_point: "",
                discount: 0,
                cancellation_policy: "",
                itinerary: [{ day: 1, title: "", description: "" }],
                inclusion: [] as string[],
                exclusion: [] as string[],
              });
              setFormStep(0);
            }}
          >
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Travel Package</DialogTitle>
              <DialogDescription>
                Fill in the details for your new travel package. It will be
                submitted for admin approval.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 mb-6">
              <div className="flex justify-between">
                {formSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                        ${index <= formStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs ${index <= formStep
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                        }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${(formStep / (formSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {formStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">
                    Basic Package Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start with the essential details about your travel package.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Package Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={newPackage.title}
                      onChange={(e) =>
                        setNewPackage({ ...newPackage, title: e.target.value })
                      }
                      placeholder="e.g. Bali Paradise Retreat"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Choose a catchy, descriptive title that highlights your
                      package's unique appeal.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">
                      Destination <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="destination"
                      value={newPackage.destination}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          destination: e.target.value,
                        })
                      }
                      placeholder="e.g. Bali, Indonesia"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={newPackage.description}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your travel package in detail..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a compelling description that highlights the unique
                    experiences and benefits of your package.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (INR) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={newPackage.price || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 1299"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Duration (Days){" "}<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newPackage.duration || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          duration: Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 7"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={newPackage.category}
                      onValueChange={(value) =>
                        setNewPackage({ ...newPackage, category: value })
                      }
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beach Getaways">
                          Beach Getaways
                        </SelectItem>
                        <SelectItem value="Mountain Escapes">
                          Mountain Escapes
                        </SelectItem>
                        <SelectItem value="Cultural Tours">
                          Cultural Tours
                        </SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Budget">Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Package Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden border">
                      <img
                        src={newPackage.images[0]}
                        alt="Package preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ImageUpload 
                      currentImages={newPackage.images}
                      onUploadComplete={(urls) => {
                        setNewPackage(prev => ({
                          ...prev,
                          images: urls
                        }));
                      }}
                      maxImages={3}/>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a high-quality image that showcases your destination
                    (recommended size: 1200×800px).
                  </p>
                </div>
              </div>
            )}

            {formStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Package Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide more specific information about your travel package.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_people">Maximum Number of People</Label>
                    <Input
                      id="max_people"
                      type="number"
                      min="1"
                      value={newPackage.max_people || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          max_people: Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boarding_point">Boarding Point</Label>
                    <Input
                      id="boarding_point"
                      value={newPackage.boarding_point}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          boarding_point: e.target.value,
                        })
                      }
                      placeholder="e.g. Delhi International Airport"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itinerary">Itinerary</Label>
                  {newPackage.itinerary.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 mb-4 p-3 border rounded-md">
                      <p className="font-medium text-sm">Day {item.day}</p>
                      <div className="space-y-2">
                        <Label htmlFor={`itinerary-title-${index}`} className="text-sm">Title</Label>
                        <Input
                          id={`itinerary-title-${index}`}
                          value={item.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          placeholder={`Day ${item.day}: Activity title`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`itinerary-desc-${index}`} className="text-sm">Description</Label>
                        <Textarea
                          id={`itinerary-desc-${index}`}
                          value={item.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          placeholder="Describe the activities and experiences for this day"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleAddItineraryLine}
                    className="mt-2"
                  >
                    Add Itinerary Day
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Provide a day-by-day breakdown of activities and experiences included in your package.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inclusion">Inclusion</Label>
                  {newPackage.inclusion.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-2">
                      <Input
                        id={`inclusion-${index}`}
                        value={item}
                        onChange={(e) => handleInclusionChange(index, e.target.value)}
                        placeholder={`Inclusion item ${index + 1}`}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleAddInclusionItem}
                    className="mt-2"
                  >
                    Add Inclusion Item
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    List all services and amenities included in the package price.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exclusion">Exclusion</Label>
                  {newPackage.exclusion.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-2">
                      <Input
                        id={`exclusion-${index}`}
                        value={item}
                        onChange={(e) => handleExclusionChange(index, e.target.value)}
                        placeholder={`Exclusion item ${index + 1}`}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleAddExclusionItem}
                    className="mt-2"
                  >
                    Add Exclusion Item
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Clearly specify what is not included in the package price.
                  </p>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Pricing & Policies</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your pricing strategy and cancellation policies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={newPackage.discount || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          discount: Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Offer a percentage discount on the base price.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finalPrice">Final Price (INR)</Label>
                    <Input
                      id="finalPrice"
                      type="number"
                      value={
                        newPackage.discount
                          ? Math.round(
                            newPackage.price * (1 - newPackage.discount / 100)
                          )
                          : newPackage.price
                      }
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Final price per person after applying discount.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                  {Array.isArray(newPackage.cancellation_policy) &&
                    newPackage.cancellation_policy.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 mb-2">
                        <Input
                          id={`cancellation-policy-${index}`}
                          value={item}
                          onChange={(e) => handleCancellationPolicyChange(index, e.target.value)}
                          placeholder={`Policy item ${index + 1}`}
                        />
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleAddCancellationPolicyItem}
                    className="mt-2"
                  >
                    Add Policy Item
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Clearly outline your cancellation and refund policies.
                  </p>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Review Your Package</h3>
                  <p className="text-sm text-muted-foreground">
                    Review all details before submitting your package for
                    approval.
                  </p>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={newPackage.images[0]}
                        alt={newPackage.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {newPackage.title || "Package Title"}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{" "}
                        {newPackage.destination || "Destination"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />{" "}
                          {newPackage.discount ? (
                            <span>
                              <span className="line-through text-muted-foreground">
                                {newPackage.price}
                              </span>{" "}
                              {Math.round(
                                newPackage.price *
                                (1 - newPackage.discount / 100)
                              )}
                            </span>
                          ) : (
                            newPackage.price
                          )}{" "}
                          INR
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {newPackage.duration}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-1">Category</h5>
                      <p>{newPackage.category || "Not specified"}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Max People</h5>
                      <p>{newPackage.max_people || "Not specified"}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Boarding Point</h5>
                      <p>{newPackage.boarding_point || "Not specified"}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Discount</h5>
                      <p>
                        {newPackage.discount
                          ? `${newPackage.discount}%`
                          : "No discount"}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <h5 className="font-medium mb-1">Description</h5>
                    <p className="text-muted-foreground">
                      {newPackage.description || "No description provided."}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>
                      Note: Your package will be reviewed by our team before
                      being published on the platform.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between items-center mt-6 pt-4 border-t">
              <div>
                {formStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevFormStep}
                    type="button"
                  >
                    Back
                  </Button>
                )}
              </div>
              <div>
                {formStep < 3 ? (
                  <Button onClick={nextFormStep} type="button">
                    Continue
                  </Button>
                ) : newPackage.id ? (
                  <Button onClick={handleUpdatePackage}>Update Package</Button>
                ) : (
                  <Button onClick={handleAddPackage}>Submit Package</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="packages">
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="packages">My Packages</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                  You haven't added any travel packages yet. Click the "Add New
                  Package" button to get started.
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
                        src={
                          pkg.images[0] ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{pkg.destination}</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge
                            className={getApprovalStatusColor(pkg.is_approved)}
                          >
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
                        <div className="text-sm text-muted-foreground">
                          Created on: {formatDate(pkg.created_at)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handlePkgEdit(pkg.id)}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1"
                            onClick={() => handlePkgDelete(pkg.id)}
                          >
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
                  You haven't received any bookings yet. Make sure your packages
                  are approved and visible to users.
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
                        <CardDescription>
                          Booking ID: {booking.id}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-sm">
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Travelers</p>
                        <p className="text-sm">{booking.travelers}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Booking Date</p>
                        <p className="text-sm">
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookingConfirm(booking.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBookingCancelled(booking.id)}
                        >
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

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Monthly Bookings</CardTitle>
                <CardDescription>Booking trends for your packages over the past year</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Your Popular Destinations</CardTitle>
                <CardDescription>Most booked destinations from your packages</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {destinationData.length > 0 ? (
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
                        formatter={(value) => [`${value} bookings`, 'Bookings']}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No destination data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue from your packages</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Your Customer Growth</CardTitle>
                <CardDescription>New customers booking your packages over time</CardDescription>
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
                      formatter={(value) => [`${value} customers`, 'New Customers']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                      name="New Customers"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
