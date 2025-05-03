"use client";

import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabase"
import HeroSlider from "@/components/HeroSlider"
import FeaturedPackages from "@/components/FeaturedPackages";
import FavDestinations from "@/components/FavDestinations";
import ExploreCategory from "@/components/ExploreCategory";
import WhyChoose from "@/components/WhyChoose";
import OurContent from "@/components/OurContent";

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

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [packages, setPackages] = useState<Package[]>([])

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
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Why Choose Us Section */}
      <WhyChoose />

      {/* Explore by Category */}
      <ExploreCategory />
      
      {/* Featured Packages */}
      <FeaturedPackages />

      {/* Favourite Destinations Section */}
      <FavDestinations />

      {/* Our Content Section */}
      <OurContent/>

    </div>
  )
}
