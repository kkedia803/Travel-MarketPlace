"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Compass, Globe, Locate, LocateFixedIcon, LocateIcon, Map, Shield, Star } from "lucide-react"
import Image from "next/image"
import BusSearchUI from "@/components/SearchBar"
import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabase"
import HeroSlider from "@/components/HeroSlider"
import ParallaxFeatures from "@/components/ParallaxFeatures";
import FeaturedPackages from "@/components/FeaturedPackages";
import FavDestinations from "@/components/FavDestinations";
import ExploreByCat from "@/components/ExploreByCat"
import WhyChoose from "@/components/WhyChoose";

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
      <ExploreByCat />

      {/* Featured Packages */}
      <FeaturedPackages />
      
      {/* Favourite Destinations Section */}
      <FavDestinations />

    </div>
  )
}
