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
import FeaturedDestination from "@/components/FeaturedDestinations";

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

  const categories = [
    { name: "Beach Getaways", src: "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea_74190-6772.jpg?t=st=1743502150~exp=1743505750~hmac=254b72ee61c7a2793b77b7ea4aa418d21ba15acd979367fb166412f2010f2e4d&w=1380" },
    { name: "Mountain Escapes", src: "https://img.freepik.com/free-photo/traveling-with-off-road-car_23-2151473117.jpg?uid=R111481632&ga=GA1.1.648242056.1663832767&semt=ais_hybrid" },
    { name: "Cultural Tours", src: "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747354.jpg?t=st=1743502337~exp=1743505937~hmac=a30e95a0dc4ef06c7b5290b057e8adae7e0468497477cb3e25a5baf7a125bcb3&w=1380" },
    { name: "Adventure", src: "https://img.freepik.com/free-photo/horizontal-shot-group-people-hiking-mountains-covered-snow-cloudy-sky_181624-44954.jpg?t=st=1743503655~exp=1743507255~hmac=dcafc980cb35b8949f51aae739456e0a374dff14f4e8ab599d517c03591297b3&w=1380" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-neutral-900 capitalize">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col itemscenter shadow-neutral-300 text-[#000A26] rounded-xl shadow-sm hover:shadow-md hover:shadow-[#0F52BA] transition-shadow bg-neutral-100 hover:scale-105 hover:transition-all hover:duration-300 hover:ease-in-out"
              >
                {/* <div className="p-4 rounded-full mb-4 bg-[#D6E6F2] text-[#000A26]">{category.icon}</div> */}
                <Image
                  className="rounded-xl mb-4 w-full h-full scale-105"
                  src={category.src}
                  width={100}
                  height={100}
                  alt='idnex'
                />
                <div className=" itemscenter p-4">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="hover:bg-[#000A26] bg-[#A6C6D8] text-[#000A26] hover:text-white transition-colors"
                  >
                    <Link
                      href={`/explore?category=${encodeURIComponent(category.name)}`}
                    >
                      Explore Now
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {/* Features */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="relative p-6 md:p-16">
          {/* Grid */}
          <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
            <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
              <h2 className="text-2xl text-gray-800 font-bold sm:text-3xl">
                Fully customizable rules to match your unique needs
              </h2>

              {/* Tab Navs */}
              <nav className="grid gap-4 mt-5 md:mt-10" aria-label="Tabs" role="tablist" aria-orientation="vertical">
                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 p-4 md:p-5 rounded-xl active" id="tabs-with-card-item-1" aria-selected="true" data-hs-tab="#tabs-with-card-1" aria-controls="tabs-with-card-1" role="tab">
                  <span className="flex gap-x-6">
                    <svg className="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" /><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" /><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" /><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" /><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" /></svg>
                    <span className="grow">
                      <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">Advanced tools</span>
                      <span className="block mt-1 text-gray-800">Use Preline thoroughly thought and automated libraries to manage your businesses.</span>
                    </span>
                  </span>
                </button>

                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 p-4 md:p-5 rounded-xl" id="tabs-with-card-item-2" aria-selected="false" data-hs-tab="#tabs-with-card-2" aria-controls="tabs-with-card-2" role="tab">
                  <span className="flex gap-x-6">
                    <svg className="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                    <span className="grow">
                      <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">Smart dashboards</span>
                      <span className="block mt-1 text-gray-800">Quickly Preline sample components, copy-paste codes, and start right off.</span>
                    </span>
                  </span>
                </button>

                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 p-4 md:p-5 rounded-xl" id="tabs-with-card-item-3" aria-selected="false" data-hs-tab="#tabs-with-card-3" aria-controls="tabs-with-card-3" role="tab">
                  <span className="flex gap-x-6">
                    <svg className="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
                    <span className="grow">
                      <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">Powerful features</span>
                      <span className="block mt-1 text-gray-800">Reduce time and effort on building modern look design with Preline only.</span>
                    </span>
                  </span>
                </button>
              </nav>
              {/* End Tab Navs */}
            </div>
            {/* End Col */}

            <div className="lg:col-span-6">
              <div className="relative">
                {/* Tab Content */}
                <div>
                  <div role="tabpanel" aria-labelledby="tabs-with-card-item-1">
                    <img className="rounded-[10%] object-center " src="https://img.freepik.com/free-photo/beautiful-shot-mountains-cloudy-sky-from-inside-plane-windows_181624-11441.jpg?t=st=1743444147~exp=1743447747~hmac=3051db386fb93cd1732f10a834eada04b2646f7c77fa4804c4d358fe5aee9e20&w=740" alt="Features Image" />
                  </div>

                  <div id="tabs-with-card-2" className="hidden" role="tabpanel" aria-labelledby="tabs-with-card-item-2">
                    <img className="shadow-xl shadow-gray-200 rounded-xl" src="https://img.freepik.com/free-photo/airplane-wing_209303-54.jpg?uid=R111481632&ga=GA1.1.648242056.1663832767&semt=ais_hybrid" alt="Features Image" />
                  </div>

                  <div id="tabs-with-card-3" className="hidden" role="tabpanel" aria-labelledby="tabs-with-card-item-3">
                    <img className="shadow-xl shadow-gray-200 rounded-xl" src="https://images.unsplash.com/photo-1598929213452-52d72f63e307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80" alt="Features Image" />
                  </div>
                </div>
                {/* End Tab Content */}

              </div>
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}

          {/* Background Color */}
          <div className="absolute inset-0 grid grid-cols-12 size-full">
            <div className="col-span-full lg:col-span-7 lg:col-start-6 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full"></div>
          </div>
          {/* End Background Color */}
        </div>
      </div>
      {/* End Features */}


      {/* Featured Destinations */}
      <FeaturedDestination />

      {/* Trust Badges */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TracoIt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Sellers</h3>
              <p className="text-muted-foreground">
                All our travel packages come from verified and trusted travel agencies.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Experiences</h3>
              <p className="text-muted-foreground">
                Curated travel experiences with high standards and excellent reviews.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-muted-foreground">
                Discover amazing destinations across the globe with our diverse packages.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      {/* <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of travelers who have found their perfect getaway through TracoIt.
          </p>
          <Link href="/explore">
            <Button size="lg" variant="secondary" className="gap-2">
              Explore Packages <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section> */}
    </div>
  )
}
