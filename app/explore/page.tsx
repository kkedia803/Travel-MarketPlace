"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star, Search, Filter, MapPin } from "lucide-react"
import { supabase } from "@/app/lib/supabase"

interface Package {
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
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""

  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 25000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])

  const categories = ["Beach Getaways", "Mountain Escapes", "Cultural Tours", "Adventure", "Luxury", "Budget"]

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true)

      try {
        const { data, error } = await supabase.from("packages").select("*").eq("is_approved", true)

        if (error) throw error

        setPackages(data || [])
        setFilteredPackages(data || [])
        console.log(filteredPackages)
        // console.log('packages set - ',packages)
      } catch (error) {
        console.error("Error fetching packages:", error)
        // For demo purposes, let's add some mock data
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
            seller_id: "seller1",
            is_approved: true,
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
            seller_id: "seller2",
            is_approved: true,
          },
          {
            id: "3",
            title: "Santorini Getaway",
            description: "Relax in the beautiful island of Santorini with stunning views and beaches.",
            destination: "Greece",
            price: 1599,
            duration: 5,
            category: "Beach Getaways",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller3",
            is_approved: true,
          },
          {
            id: "4",
            title: "Tokyo Cultural Experience",
            description: "Immerse yourself in Japanese culture with this comprehensive Tokyo tour.",
            destination: "Japan",
            price: 2199,
            duration: 12,
            category: "Cultural Tours",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller1",
            is_approved: true,
          },
          {
            id: "5",
            title: "Amazon Rainforest Expedition",
            description: "Discover the wonders of the Amazon rainforest with expert guides.",
            destination: "Brazil",
            price: 2499,
            duration: 14,
            category: "Adventure",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller2",
            is_approved: true,
          },
          {
            id: "6",
            title: "Paris Luxury Weekend",
            description: "Experience the city of lights with this luxury weekend getaway.",
            destination: "France",
            price: 1299,
            duration: 3,
            category: "Luxury",
            images: ["/placeholder.svg?height=400&width=600"],
            seller_id: "seller3",
            is_approved: true,
          },
        ]

        setPackages(mockPackages)
        setFilteredPackages(mockPackages)
        console.log('mockpackages', filteredPackages)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  useEffect(() => {
    console.log("Updated packages:", packages);
  }, [packages]);

  useEffect(() => {
    // Apply filters
    let result = packages

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(term) ||
          pkg.destination.toLowerCase().includes(term) ||
          pkg.description.toLowerCase().includes(term),
      )
    }

    // Price range filter
    result = result.filter((pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1])

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((pkg) => selectedCategories.includes(pkg.category))
    }

    setFilteredPackages(result)
  }, [searchTerm, priceRange, selectedCategories, packages])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Travel Packages</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Filter className="mr-2 h-5 w-5" /> Filters
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search" className="text-sm font-medium">
                        Search
                      </Label>
                      <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search destinations..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Price Range</Label>
                      <div className="pt-4 px-2">
                        <Slider
                          defaultValue={[0, 25000]}
                          max={25000}
                          step={100}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Categories</Label>
                      <div className="space-y-2 mt-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={category} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setPriceRange([0, 5000])
                    setSelectedCategories([])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packages Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No packages found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.id}`}
                  className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={pkg.images[0] || "/placeholder.svg?height=400&width=600"}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-xl">{pkg.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{pkg.destination}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-semibold">
                        ₹{pkg.price}
                        <span className="text-sm font-normal text-muted-foreground"> /person</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{pkg.duration} days</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

