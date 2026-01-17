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
  Phone,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast"
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import RecommendedPackages from "@/components/RecommendedPackages";


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
  contact_number?: string;
  itinerary?: Array<{ day: number; title: string, description: string; activity: string }>;
  inclusion?: string[];
  exclusion?: string[];
  document?: string;
  cancellation_policy?: string[];
  start_dates?: string[];
  company_name?: string;
  company_logo?: string;
  profiles?: {
    company_name: string;
    phone_number: string;
    avatar_url: string;
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
  } | {
    avatar_url: string;
    user_name: string;
  }[];
};

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Package | null;
  onSave: () => void;
}

// Contact Number Component
function ContactNumber({ number }: { number: string }) {
  const handleCall = () => {
    window.location.href = `tel:${number}`;
  };

  const handleWhatsApp = () => {
    // WhatsApp URL format: https://wa.me/<number>
    // Convert to string and remove ALL non-numeric characters
    let cleanNumber = String(number).replace(/\D/g, '');
    
    // Remove leading zeros
    cleanNumber = cleanNumber.replace(/^0+/, '');
    
    // If it's exactly 10 digits (typical Indian mobile), add 91 country code
    if (cleanNumber.length === 10 && /^[6-9]/.test(cleanNumber)) {
      cleanNumber = `91${cleanNumber}`;
    }
    // If it doesn't have country code but is valid mobile length, add 91
    else if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }
    // If already has country code (starts with 91 and has 12 digits), use as-is
    else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
      // Already formatted correctly
    }
    // For any other length, try to use as-is (might be international)
    
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCall}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors border border-blue-200 dark:border-blue-800"
        title="Call Seller"
      >
        <Phone className="h-4 w-4" />
        <span className="text-sm font-semibold">Call</span>
      </button>

      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors border border-blue-200 dark:border-blue-800"
        title="Chat on WhatsApp"
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="text-sm font-semibold">WhatsApp</span>
      </button>
    </div>
  );
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

  // Read query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const guestsParam = searchParams.get('guests');
      const fromDateParam = searchParams.get('fromDate');
      
      if (guestsParam) {
        setTravelers(parseInt(guestsParam));
      }
      
      if (fromDateParam) {
        setSelectedDate(new Date(fromDateParam));
      }
    }
  }, []);



  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);

      try {
        const { data: packageData, error: packageError } = await supabase
          .from("packages")
          .select(`*,
            profiles(phone_number, company_name, avatar_url)`)
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
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pkg.title}</h1>
          {/* Seller name and icon */}
          {/* Seller name and icon */}
          {/* Prioritize package-specific details, fallback to profile details */}
          {(pkg.company_name || pkg.profiles?.company_name) ? (
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-14 w-14">
                  <AvatarImage 
                    src={pkg.company_logo || pkg.profiles?.avatar_url} 
                    alt="company_avatar" 
                  />
                  <AvatarFallback>{(pkg.company_name || pkg.profiles?.company_name || "C").charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xl md:text-2xl font-medium">
                  {pkg.company_name || pkg.profiles?.company_name || "Unknown"}
                </span>
              </div>
              {/* Contact Number */}
              {(pkg.contact_number || pkg.profiles?.phone_number) && (
                <ContactNumber number={pkg.contact_number || pkg.profiles?.phone_number || ''} />
              )}
            </div>
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
            
            {pkg.document && (
                <div className="mt-6 mb-4">
                  <a 
                    href={pkg.document} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download PDF Itinerary</span>
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
            )}

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
                    <Check className="mr-2 h-5 w-5 text-blue-500" /> Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {inclusions?.map((item, index) => (
                      <li key={index} className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
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
                          <AvatarImage src={(Array.isArray(review.profiles) ? review.profiles[0]?.avatar_url : review.profiles?.avatar_url) || ''} />
                          <AvatarFallback>
                            {review.profile_id.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{(Array.isArray(review.profiles) ? review.profiles[0]?.user_name : review.profiles?.user_name) || review.profile_id}</p>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3  w-3 ${star <= review.rating ? " text-yellow-500 fill-yellow-500" : "text-muted"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(review.created_at).toISOString().split('T')[0].split('-').reverse().join('/')}
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
                              className={`h-6 w-6 cursor-pointer transition ${star <= rating ? " text-yellow-500 fill-yellow-500" : "text-muted-foreground"
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
                  <span className="text-xl md:text-2xl font-bold">₹{pkg.price}</span>
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

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
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
                    <div className="mt-4 border rounded-md p-2 sm:p-4 w-full sm:w-fit shadow overflow-x-auto">
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
                          available: "bg-blue-100 text-blue-800 font-medium",
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
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
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
                      <span className="text-blue-600">
                        ₹{Math.round(pkg.price * (1 - (pkg.discount ?? 0) / 100) * travelers)}
                      </span>
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-blue-600">
                      You save: ₹{Math.round(pkg.price * travelers) - Math.round(pkg.price * (1 - (pkg.discount ?? 0) / 100) * travelers)}
                    </span>
                  </div>
                </div>

                {userType !== "seller" && (
                  <div className="flex flex-col gap-3 items-center">
                    <Button className="w-full" size="lg" onClick={handleBookNow}>
                      Book Now
                    </Button>
                    <span className="text-center text-sm sm:text-base">Contact <span className="font-bold tracking-tight text-base sm:text-xl whitespace-nowrap">+91 87438 09060</span> for any inquiry.</span>
                  </div>
                )}
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
      
      {/* Recommended Packages Section */}
      <div className="mt-8">
        <RecommendedPackages 
          currentPackageId={pkg!.id} 
          currentPrice={pkg!.price} 
          currentCategory={pkg!.category} 
        />
      </div>
    </div>
  );
}
