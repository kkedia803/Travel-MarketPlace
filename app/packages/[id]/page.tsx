"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/contexts/auth-context";
import { supabase } from "@/app/lib/supabase";
import {
  Clock, MapPin, Star, Check, X, Info, Package, User, ClipboardList, ArrowBigRight, ArrowRight, ArrowLeft, BedDouble,
  Utensils,
  BusFront,
  Users,
  ShieldCheck,
  Briefcase,
  Ticket,
  TentTree,
  MountainSnow,
  Building2,
  Phone
} from "lucide-react";
import { toast } from "@/hooks/use-toast"
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


const featureIcons: Record<string, JSX.Element> = {
  accommodation: <BedDouble className="w-7 h-7 text-black" />,
  meals: <Utensils className="w-7 h-7 text-black" />,
  transfers: <BusFront className="w-7 h-7 text-black" />,
  trip_captain: <Users className="w-7 h-7 text-black" />,
  first_aid: <ShieldCheck className="w-7 h-7 text-black" />,
  luggage_support: <Briefcase className="w-7 h-7 text-black" />,
  entry_tickets: <Ticket className="w-7 h-7 text-black" />,
  camping: <TentTree className="w-7 h-7 text-black" />,
  trek_lead: <MountainSnow className="w-7 h-7 text-black" />,
};


interface Package {
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
  discount?: number;
  itinerary?: Array<{ day: number; title: string, description: string; activity: string }>;
  inclusion?: string[];
  exclusion?: string[];
  cancellation_policy?: string[];
  start_dates?: string[];
  profiles?: {
    company_name: string;
    phone_number: string;
  }
}

interface Review {
  rating: number;
  review_text: string;
  created_at: string;
  profile_id: string;
  profiles?: {
    avatar_url: string;
    user_name: string;
  };
};

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Package | null;
  onSave: () => void;
}

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // const { toast } = useToast();
  const { user } = useAuth();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [packageFeatures, setPackageFeatures] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [userType, setUserType] = useState<string | null>(null) // Track user type
  const [reviews, setReviews] = useState<Review[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const availableDates = pkg?.start_dates?.map(d => new Date(d)) || [];

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");



  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);

      try {
        const { data: packageData, error: packageError } = await supabase
          .from("packages")
          .select(`*,
            profiles(phone_number, company_name)`)
          .eq("id", params.id)
          .single();

        if (packageError) throw packageError;

        setPkg(packageData);

        const { data: featureData, error: featureError } = await supabase
          .from("package_features")
          .select("*")
          .eq("package_id", params.id)
          .single();

        if (featureError) {
          console.warn("No feature data found or error:", featureError.message);
          setPackageFeatures(null); // Optional fallback
        } else {
          setPackageFeatures(featureData);
          console.log("Package features:", featureData);
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        // For demo purposes, let's add mock data that includes the package id.
        const packagesData: { [key: string]: Omit<Package, "id"> } = {
          "1": {
            title: "Bali Paradise Retreat",
            description:
              "Experience the beauty of Bali with this all-inclusive package. Enjoy pristine beaches, lush rice terraces, and ancient temples. Our package includes luxury accommodations, daily breakfast, airport transfers, and guided tours to Bali's most iconic attractions.",
            destination: "Bali, Indonesia",
            price: 22999,
            duration: 7,
            category: "Beach Getaways",
            images: ["/balicover.webp", "/bali4.webp", "/bali3.jpg"],
            seller_id: "seller1",
            is_approved: true,
          },
          "2": {
            title: "Manali Adventure Escape",
            description:
              "Discover the breathtaking landscapes of Manali with this adventure-packed package. Trek through snow-capped mountains, experience river rafting, and relax in cozy hilltop resorts. Includes accommodation, meals, and guided activities.",
            destination: "Manali, India",
            price: 5899,
            duration: 5,
            category: "Mountain Adventures",
            images: ["/manali1.jpg", "/manali2.jpg", "/manali3.jpg"],
            seller_id: "seller2",
            is_approved: true,
          },
          "3": {
            title: "Udaipur Royal Heritage Tour",
            description:
              "Explore the royal charm of Udaipur with a luxurious stay at heritage hotels. Visit grand palaces, cruise on Lake Pichola, and experience authentic Rajasthani culture. Includes guided tours, cultural performances, and exquisite dining experiences.",
            destination: "Udaipur, India",
            price: 9599,
            duration: 6,
            category: "Cultural Experiences",
            images: ["/udaipur1.jpg", "/udaipur2.jpg", "/udaipur3.jpg"],
            seller_id: "seller3",
            is_approved: true,
          },
        };

        // Normalize params.id to a string.
        const packageId = Array.isArray(params.id) ? params.id[0] : params.id;
        const mockPackage =
          packageId !== undefined ? { id: packageId, ...packagesData[packageId] } : null;
        setPkg(mockPackage);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  const handleReviewSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();


    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          profile_id: session?.user.email,
          rating,
          review_text: reviewText,
          package_id: pkg?.id || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review");
      }

      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback.",
        variant: "success",
      });
      fetchReviews();
      setRating(0);
      setReviewText("");

    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof Error) {
        toast({
          title: "Error submitting review",
          description: error.message,
          variant: "destructive",
        })
      } else {
        alert("Something went wrong while submitting the review.");
      }
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `rating,
        review_text,
        created_at,
        profile_id,
        profiles (
          avatar_url,
          user_name
        )`
        )
        .eq("package_id", pkg?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [pkg?.id]);

  useEffect(() => {
    if (pkg?.id) {
      fetchReviews();
    }
  }, [pkg?.id, fetchReviews]);

  useEffect(() => {
    const fetchUserType = async () => {
      setLoading(true);
      try {
        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Fetch user type from the "users" table
          const { data, error } = await supabase
            .from("profiles") // Replace with your actual table name
            .select("role") // Replace with your column name
            .eq("id", user.id) // Assuming "id" is the primary key
            .single();

          if (error) throw error;

          setUserType(data?.role || "user"); // Default to "user" if null
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, []);
  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this package",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date to book this package",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("bookings").insert({
        destination: pkg?.destination,
        package_id: pkg?.id,
        user_id: user.id,
        travelers: travelers,
        selected_date: selectedDate?.toISOString() || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking successful!",
        description: "Your booking has been confirmed.",
        variant: "success",
      });

      router.push("/user/dashboard");
    } catch (error) {
      console.error("Error booking package:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };




  if (loading) {
    return (
      <div className="container py-8">
        <div className="w-full h-[400px] bg-muted animate-pulse rounded-lg mb-8" />
        <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/2" />
        <div className="h-4 bg-muted animate-pulse rounded mb-2 w-1/4" />
        <div className="h-4 bg-muted animate-pulse rounded mb-8 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
          </div>
          <div>
            <div className="h-[200px] bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Finding your package...</h1>
        <p className="text-muted-foreground mb-8">
          Asking database people nicely. They said they’ll get back to us.
        </p>
        <Button onClick={() => router.push("/explore")}>Browse Packages</Button>
      </div>
    );
  }

  // const parsed = JSON.parse(pkg.itinerary);
  const parsed = pkg.itinerary;
  const itinerary = Array.isArray(parsed) ? parsed : [];
  const inclusions = pkg.inclusion;
  const exclusion = pkg.exclusion;
  const cancellationPolicy = pkg.cancellation_policy;
  return (
    <div className="container py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Left: Main Image + Thumbnails Below */}
        <div className="md:col-span-3">
          {/* Main Image with Arrows */}
          <div className="relative aspect-video overflow-hidden rounded-lg mb-4">

            {/* Left Arrow */}
            {activeImage > 0 && (
              <button
                onClick={() => setActiveImage((prev) => prev - 1)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
              >
                <ArrowLeft />
              </button>
            )}

            {/* Right Arrow */}
            {activeImage < pkg.images.length - 1 && (
              <button
                onClick={() => setActiveImage((prev) => prev + 1)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full z-10 text-white p-2"
              >
                <ArrowRight />
              </button>
            )}

            <img
              src={pkg.images[activeImage] || "/placeholder.svg?height=600&width=800"}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scrollable Thumbnail Row */}
          <div className="flex overflow-x-auto gap-2 justify-center">
            {pkg.images.map((image, index) => (
              <div
                key={index}
                className={`w-20 h-14 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? "border-primary" : "border-transparent"
                  }`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${pkg.title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

        </div>
        {/* Right: Key Points Section as Grid */}
        {packageFeatures && (
          <div className="md:col-span-1 px-5 py-5 hidden md:block">

            <h2 className="text-2xl font-semibold mb-1 text-gray-800 pt-2">
              What's Included
            </h2>
            <p className="text-md text-gray-500 mb-4">
              This package offers the following key features for your comfort and convenience:
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              {Object.entries(packageFeatures).map(([key, value]) => {
                if (value === true && key in featureIcons) {
                  return (
                    <li key={key} className="flex items-center gap-3">
                      <div className="text-black text-xl">{featureIcons[key]}</div>
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}


        {/* Key Points for mobile */}
        {packageFeatures && (
          <div className="block md:hidden mt-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Key Points</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {Object.entries(packageFeatures).map(([key, value]) => {
                  if (value === true && key in featureIcons) {
                    return (
                      <li key={key} className="flex items-center gap-2">
                        {featureIcons[key]}
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}

      </div>


      {/* Package Title and Basic Info */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
          {pkg.profiles?.company_name ? (
            <Badge className="flex items-center gap-2 flex-col mb-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-white" />
                <span>
                  <span className="font-medium text-white text-sm">Sold by:</span>{' '}
                  <span className="text-lg">{pkg.profiles?.company_name || "Unknown"}</span>
                </span>
              </div>

              {/* <div className="flex items-center gap-2 text-md ">
                <Phone className="w-4 h-4 text-white" />
                <span>
                  <span className="font-medium text-white text-sm">Contact:</span>{' '}
                  <span className="text-lg">{pkg.profiles?.phone_number || "Unknown"}</span>
                </span>
              </div> */}
            </Badge>
          ) : ''}

        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{pkg.destination}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{pkg.duration} days</span>
          </div>
          <div className="flex items-center">
            {/* <Star className="h-4 w-4 fill-primary text-primary mr-1" /> */}
            {/* <span className="font-medium">4.8</span> */}
            {/* <span className="text-muted-foreground ml-1">(24 reviews)</span> */}
          </div>
          <Badge variant="outline">{pkg.category}</Badge>
        </div>
        <p className="text-muted-foreground">{pkg.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="itinerary">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Policies</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="pt-4">
              <div className="space-y-6">
                {itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">D{day.day}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{day.title}</h3>
                      <p className="text-muted-foreground">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inclusions" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" /> Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {inclusions?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <X className="mr-2 h-5 w-5 text-red-500" /> Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {exclusion?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="mr-2 h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> Cancellation Policy
                  </h3>
                  <ul className="space-y-2">
                    {cancellationPolicy?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowBigRight className="mr-2 h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-6">
                {/* <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Star className="h-6 w-6 fill-primary text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">4.8 out of 5</h3>
                    <p className="text-muted-foreground">Based on 24 reviews</p>
                  </div>
                </div> */}

                <Separator />

                {/* Sample reviews */}
                <div className="space-y-6">
                  {/* Existing hardcoded reviews */}
                  {reviews.map((review, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.profiles?.avatar_url || ''} />
                          <AvatarFallback>
                            {review.profile_id.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.profiles?.user_name || review.profile_id}</p>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {/* Replace this with your date formatting logic */}
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm">
                        {review.review_text}
                      </p>
                    </div>
                  ))}

                  {/* Review submission form */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">Write a Review</h3>

                    {userType == "seller" && (
                      <div className="w-full" style={{ display: "flex", justifyContent: "center", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "5px" }}>
                        You are a seller. You cannot review packages.
                      </div>)}

                    {userType !== "seller" && (

                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onClick={() => setRating(star)}
                              className={`h-6 w-6 cursor-pointer transition ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                            />
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience..."
                          className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        // rows="3"
                        />
                        <Button type="submit">Submit Review</Button>
                      </form>)}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Card */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">₹{pkg.price}</span>
                  <span className="text-muted-foreground">per person</span>
                </div>

                <Separator />

                <div>
                  <label htmlFor="travelers" className="block text-sm font-medium mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 1))} disabled={travelers <= 1}>
                      -
                    </Button>
                    <span className="mx-4 font-medium">{travelers}</span>
                    <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)}>
                      +
                    </Button>
                  </div>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Check the available package dates
                  </label>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCalendarOpen(!calendarOpen)}
                    >
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Select a date"}
                    </Button>

                    {selectedDate && (
                      <span className="text-sm text-muted-foreground">
                        Selected: {selectedDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {calendarOpen && (
                    <div className="mt-4 border rounded-md p-4 w-fit shadow">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                        }}
                        modifiers={{
                          available: availableDates,
                        }}
                        modifiersClassNames={{
                          available: "bg-green-100 text-green-800 font-medium",
                        }}
                        disabled={(date) =>
                          !availableDates.some(
                            (d) =>
                              d.toISOString().split("T")[0] ===
                              date.toISOString().split("T")[0]
                          )
                        }
                      />
                    </div>
                  )}
                </div>


                <div className="bg-accent rounded-lg p-4">
                  {/* Original Price with Discount */}
                  <div className="flex justify-between mb-2">
                    <span>Original Price</span>
                    <div className="flex items-center">
                      <span className="line-through text-muted-foreground mr-2">
                        ₹{pkg.price} x {travelers}
                      </span>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        {pkg.discount}% OFF
                      </Badge>
                    </div>
                  </div>

                  {/* Discounted Price */}
                  <div className="flex justify-between mb-2">
                    <span>Discounted Price</span>
                    <span>
                      ₹{Math.round(pkg.price * (1 - (pkg.discount ?? 0) / 100))} x {travelers}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  {/* Final Total */}
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <div className="flex flex-col items-end">
                      <span className="line-through text-sm text-muted-foreground">
                        ₹{pkg.price * travelers}
                      </span>
                      <span className="text-green-600">
                        ₹{Math.round(pkg.price * (1 - (pkg.discount ?? 0) / 100) * travelers)}
                      </span>
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-green-600">
                      You save: ₹{Math.round(pkg.price * travelers) - Math.round(pkg.price * (1 - (pkg.discount ?? 0) / 100) * travelers)}
                    </span>
                  </div>
                </div>

                {userType !== "seller" && (
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>)}
                {userType == "seller" && (
                  <div className="w-full" style={{ display: "flex", justifyContent: "center", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "5px" }}>
                    You are a seller. You cannot book packages.
                  </div>)}


                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>No payment required now. You'll confirm your booking details in the next step.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
