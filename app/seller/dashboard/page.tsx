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
  Edit,
  Plus,
  Trash,
  Package,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";

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
  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    destination: "",
    price: 0,
    duration: 1,
    category: "",
    images: ["/placeholder.svg?height=400&width=600"],
    maxPeople: 1,
    boardingPoint: "",
    discount: 0,
    cancellationCharges: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
  });
  

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
        // Fetch packages
        const { data: packagesData, error: packagesError } = await supabase
          .from("packages")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (packagesError) throw packagesError;

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(
            `
            *,
            user:profiles (email, name),
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
        // For demo purposes, let's add mock data
        const mockPackages = [
          {
            id: "1",
            title: "Bali Paradise",
            description:
              "Experience the beauty of Bali with this all-inclusive package.",
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
            description:
              "Explore the majestic Swiss Alps with guided tours and luxury accommodations.",
            destination: "Switzerland",
            price: 1899,
            duration: 10,
            category: "Mountain Escapes",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: user.id,
            is_approved: false,
            created_at: "2023-05-15T14:45:00Z",
          },
        ] as TravelPackage[];

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
        ] as Booking[];

        setPackages(mockPackages);
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleAddPackage = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .insert({
          ...newPackage,
          seller_id: user?.id,
          is_approved: false,
        })
        .select();

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
        maxPeople: 1,
        boardingPoint: "",
        discount: 0,
        cancellationCharges: "",
        itinerary: "",
        inclusions: "",
        exclusions: "",
      });
    } catch (error) {
      console.error("Error adding package:", error);
      toast({
        title: "Failed to add package",
        description:
          "There was an error adding your package. Please try again.",
        variant: "destructive",
      });
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
          <DialogTrigger asChild>
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
                        ${
                          index <= formStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs ${
                        index <= formStep
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
                      Duration (Days){" "}
                      <span className="text-destructive">*</span>
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
                    <Button variant="outline" type="button" className="h-10">
                      Upload Image
                    </Button>
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
                    <Label htmlFor="maxPeople">Maximum Number of People</Label>
                    <Input
                      id="maxPeople"
                      type="number"
                      min="1"
                      value={newPackage.maxPeople || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          maxPeople: Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boardingPoint">Boarding Point</Label>
                    <Input
                      id="boardingPoint"
                      value={newPackage.boardingPoint}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          boardingPoint: e.target.value,
                        })
                      }
                      placeholder="e.g. Delhi International Airport"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itinerary">Itinerary</Label>
                  <Textarea
                    id="itinerary"
                    value={newPackage.itinerary}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        itinerary: e.target.value,
                      })
                    }
                    placeholder="Day 1: Arrival and welcome dinner
                    Day 2: City tour and local experiences
                    ..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a day-by-day breakdown of activities and experiences
                    included in your package.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inclusions">Inclusions</Label>
                    <Textarea
                      id="inclusions"
                      value={newPackage.inclusions}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          inclusions: e.target.value,
                        })
                      }
                      placeholder="- Airport transfers
                      - Accommodation
                      - Daily breakfast
                      ..."
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      List all services and amenities included in the package
                      price.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exclusions">Exclusions</Label>
                    <Textarea
                      id="exclusions"
                      value={newPackage.exclusions}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          exclusions: e.target.value,
                        })
                      }
                      placeholder="- International flights
                      - Travel insurance
                      - Personal expenses
                      ..."
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Clearly specify what is not included in the package price.
                    </p>
                  </div>
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
                  <Label htmlFor="cancellationCharges">
                    Cancellation Policy
                  </Label>
                  <Textarea
                    id="cancellationCharges"
                    value={newPackage.cancellationCharges}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        cancellationCharges: e.target.value,
                      })
                    }
                    placeholder="e.g. 
                    - Full refund if cancelled 30+ days before departure
                    - 50% refund if cancelled 15-29 days before departure
                    - No refund if cancelled less than 15 days before departure"
                    rows={5}
                  />
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
                      <p>{newPackage.maxPeople || "Not specified"}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Boarding Point</h5>
                      <p>{newPackage.boardingPoint || "Not specified"}</p>
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
                ) : (
                  <Button onClick={handleAddPackage}>Submit Package</Button>
                )}
              </div>
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
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1"
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
                          {booking.user.name || booking.user.email}
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
  );
}
