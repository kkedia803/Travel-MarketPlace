"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, TrendingUp, Calendar, Users, Filter as FilterIcon, ChevronDown, Heart, Clock, CheckCircle2 } from "lucide-react"
import { supabase } from "@/app/lib/supabase"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { FilterChip } from "@/components/FilterChip"
import { FiltersModal } from "@/components/FiltersModal"
import { Breadcrumb } from "@/components/Breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Package {
  id: string
  title: string
  description: string
  destination: string
  price: number
  final_price?: number
  duration: number
  nights: number
  category: string
  images: string[]
  seller_id: string
  is_approved: boolean
  avg_rating: number
  total_bookings_last_month: number
  seller_logo: string
  start_dates?: string[]
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = searchParams.get("category") || ""
  const initialDestination = searchParams.get("destination") || ""
  const initialBudget = Number(searchParams.get('budget')) || 100000

  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, initialBudget])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [selectedDestination, setSelectedDestination] = useState(initialDestination)
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [numberOfMonths, setNumberOfMonths] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 768 ? 1 : 2)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  // Filter modal state
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  
  // Availability states
  const [guests, setGuests] = useState(2)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  
  // Sort state
  const [sortBy, setSortBy] = useState("featured")
  
  // Wishlist state (would connect to backend in production)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  const categories = [
    "Beach Getaways",
    "Mountain Escapes",
    "Desert Adventures",
    "Forest & Wildlife",
    "Hill Stations",
    "Adventure & Trekking",
    "Cultural Tours",
    "Pilgrimage & Spiritual",
    "Luxury Escapes",
  ]

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("is_approved", true)
          .order('updated_at', {ascending:false})

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }
        
        // Transform the data to ensure compatibility
        const transformedData = (data || []).map((pkg: any) => ({
          ...pkg,
          avg_rating: pkg.avg_rating || 0,
          total_bookings_last_month: pkg.total_bookings_last_month || 0,
          seller_logo: pkg.seller_logo || ""
        }))
        
        setPackages(transformedData)
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  useEffect(() => {
    let result = packages

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(term) ||
          pkg.destination.toLowerCase().includes(term) ||
          pkg.description.toLowerCase().includes(term),
      )
    }

    result = result.filter((pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1])

    if (selectedCategories.length > 0) {
      result = result.filter((pkg) => selectedCategories.includes(pkg.category))
    }

    if (selectedDestination) {
      result = result.filter(
        (pkg) => pkg.destination.toLowerCase() === selectedDestination.toLowerCase()
      )
      setSearchTerm(selectedDestination)
    }

    // Filter by availability if check was performed
    if (availabilityChecked && dateRange?.from) {
      result = result.filter((pkg) => {
        if (!pkg.start_dates || pkg.start_dates.length === 0) return false
        
        return pkg.start_dates.some((dateStr) => {
          const startDate = new Date(dateStr)
          const fromDate = dateRange.from!
          const toDate = dateRange.to || fromDate
          
          return startDate >= fromDate && startDate <= toDate
        })
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => (a.final_price || a.price) - (b.final_price || b.price))
        break
      case "price_high":
        result.sort((a, b) => (b.final_price || b.price) - (a.final_price || a.price))
        break
      case "rating":
        result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
        break
      case "popular":
        result.sort((a, b) => (b.total_bookings_last_month || 0) - (a.total_bookings_last_month || 0))
        break
      default: // featured
        // Keep the default order from database
        break
    }

    setFilteredPackages(result)
  }, [searchTerm, priceRange, selectedCategories, selectedDestination, packages, availabilityChecked, dateRange, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setPriceRange([0, 100000])
    setSelectedCategories([])
    setSelectedDestination("")
    setGuests(2)
    setDateRange(undefined)
    setAvailabilityChecked(false)
  }

  const handleBookNow = (packageId: string) => {
    const params = new URLSearchParams({
      guests: guests.toString(),
      ...(dateRange?.from && { fromDate: dateRange.from.toISOString() }),
      ...(dateRange?.to && { toDate: dateRange.to.toISOString() }),
    })
    router.push(`/packages/${packageId}?${params.toString()}`)
  }

  const toggleWishlist = (packageId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      if (newSet.has(packageId)) {
        newSet.delete(packageId)
      } else {
        newSet.add(packageId)
      }
      return newSet
    })
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Explore Packages" }
  ]

  const getBadge = (pkg: Package) => {
    if (pkg.total_bookings_last_month > 10) {
      return { label: "Best Seller", color: "bg-orange-500" }
    }
    if (pkg.total_bookings_last_month > 5) {
      return { label: "Likely to Sell Out", color: "bg-pink-500" }
    }
    return null
  }

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Explore Travel Packages</h1>
      
      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-full border-2 border-gray-200 shadow-sm p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
        {/* Destination Search */}
        <div className="flex-1 flex items-center px-3 sm:px-4 h-12 sm:border-r border-gray-200">
          <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destinations..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Date Selector Button */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center px-3 sm:px-4 h-12 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors w-full sm:w-auto justify-between sm:justify-start"
          >
            <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {dateRange?.from ? 
                (dateRange.to ? 
                  `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
                  : dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
                : "Select Dates"}
            </span>
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-xl p-4 z-50">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={numberOfMonths}
                disabled={{ before: new Date() }}
              />
              <div className="flex gap-2 mt-2 border-t pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setDateRange(undefined)
                    setShowDatePicker(false)
                    setAvailabilityChecked(false)
                  }}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowDatePicker(false)
                    if (dateRange?.from) {
                      setAvailabilityChecked(true)
                    }
                  }}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Guests Selector */}
        <div className="relative">
          <FilterChip
            label={`${guests} Adult${guests > 1 ? 's' : ''}`}
            icon={<Users className="h-4 w-4" />}
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
          />
          
          {showGuestsDropdown && (
            <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-xl p-4 w-64">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Adults</span>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    -
                  </Button>
                  <span className="font-semibold w-8 text-center">{guests}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setGuests(guests + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => setShowGuestsDropdown(false)}
              >
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Filters Button */}
        <FilterChip
          label="Filters"
          icon={<FilterIcon className="h-4 w-4" />}
          onClick={() => setShowFiltersModal(true)}
        />

        {/* Active Category Filters */}
        {selectedCategories.map((category) => (
          <FilterChip
            key={category}
            label={category}
            active
            removable
            onRemove={() => handleCategoryChange(category)}
          />
        ))}
      </div>

      {/* Results count and Sort */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredPackages.length}+ results
        </p>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort by: {sortBy === "featured" ? "Featured" : 
                        sortBy === "price_low" ? "Price: Low to High" :
                        sortBy === "price_high" ? "Price: High to Low" :
                        sortBy === "rating" ? "Rating" : "Popular"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("featured")}>
              Featured
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price_low")}>
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price_high")}>
              Price: High to Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("rating")}>
              Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("popular")}>
              Most Popular
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:space-y-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-row md:flex-col">
              <div className="w-32 sm:w-40 md:w-full md:aspect-[4/3] bg-muted animate-pulse flex-shrink-0" />
              <CardContent className="p-3 sm:p-4 flex-1">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No packages found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:space-y-0">
          {filteredPackages.map((pkg) => {
            const badge = getBadge(pkg)
            const isWishlisted = wishlist.has(pkg.id)
            
            return (
              <Card
                key={pkg.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 border flex flex-row md:flex-col h-auto md:h-full"
              >
                {/* Image Container */}
                <div className="relative w-32 sm:w-40 md:w-full flex-shrink-0 md:aspect-[4/3] overflow-hidden bg-gray-100">
                  <Link href={`/packages/${pkg.id}`} className="block h-full">
                    <Image
                      src={pkg.images[0] || "/placeholder.svg?height=300&width=400"}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                  
                  {/* Badge */}
                  {badge && (
                    <div className={`absolute top-2 left-2 ${badge.color} text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full`}>
                      {badge.label}
                    </div>
                  )}
                  
                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(pkg.id)}
                    className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                    />
                  </button>
                </div>

                {/* Content */}
                <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    {pkg.avg_rating > 0 && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <Star className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                        <span className="text-sm font-semibold">
                          {pkg.avg_rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({pkg.total_bookings_last_month || 0})
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <Link href={`/packages/${pkg.id}`}>
                      <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1.5 sm:mb-2 line-clamp-2 hover:underline">
                        {pkg.title}
                      </h3>
                    </Link>

                    {/* Features */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{pkg.duration} to {pkg.duration + (pkg.nights > 0 ? 1 : 0)} days</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" />
                        <span>Free Cancellation</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end md:items-start mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-muted-foreground">from</span>
                      <span className="text-lg sm:text-xl font-bold">
                        ₹{(pkg.final_price || pkg.price).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground text-right md:text-left">
                      Price varies by group size
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Filters Modal */}
      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        onReset={handleResetFilters}
        onApply={() => {}}
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
