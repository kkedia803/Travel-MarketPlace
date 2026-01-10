"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Calendar, Search } from "lucide-react"
import { cities } from "@/app/lib/cities"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const HERO_SLIDES = [
  "/hero-slide-1.jpg",
  "/hero-slide-2.jpg",
  "/hero-slide-3.jpg",
  "/hero-slide-4.jpg",
  "/hero-slide-5.jpg",
]

export default function SearchHero() {
  const router = useRouter()
  const [dest, setDest] = useState("")
  const [date, setDate] = useState("")
  const [filteredCities, setFilteredCities] = useState<typeof cities>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDest(value)

    if (value.length > 0) {
      const filtered = cities.filter(
        ({ city, state }) =>
          city.toLowerCase().includes(value.toLowerCase()) ||
          state.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleSearch = () => {
    // Navigate to explore page with query params
    const queryParams = new URLSearchParams()
    if (dest) queryParams.append("destination", dest)
    if (date) queryParams.append("date", date)
    
    router.push(`/explore?${queryParams.toString()}`)
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              currentSlide === index ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide}
              alt={`Travel destination ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay for text readability */}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 flex flex-col items-center gap-6 md:gap-8 text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg leading-tight">
          Experience the World
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-medium max-w-2xl drop-shadow-md text-white/90 px-4">
          One site, thousands of travel experiences you'll remember.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-3xl bg-white rounded-2xl md:rounded-full p-3 md:p-2 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
          
          {/* Destination Input */}
          <div className="relative flex-1 w-full md:w-auto" ref={dropdownRef}>
            <div className="flex items-center px-4 min-h-[48px] md:h-14 md:border-r border-gray-200 rounded-xl md:rounded-none">
               <MapPin className="text-gray-500 w-5 h-5 mr-3 flex-shrink-0" />
               <input
                type="text"
                value={dest}
                onChange={handleDestinationChange}
                onFocus={() => dest.length > 0 && setShowDropdown(true)}
                placeholder="Where to?"
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 font-medium focus:outline-none text-base md:text-lg"
              />
            </div>

             {/* Dropdown */}
             {showDropdown && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden z-50 text-left">
                  {filteredCities.slice(0, 50).map((cityItem, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setDest(`${cityItem.city}, ${cityItem.state}`)
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 active:bg-gray-100"
                    >
                      <div className="font-medium text-gray-900">{cityItem.city}</div>
                      <div className="text-sm text-gray-500">{cityItem.state}</div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Date Input */}
          <div className="flex-1 w-full md:w-auto flex items-center px-4 min-h-[48px] md:h-14 rounded-xl md:rounded-none">
            <Calendar className="text-gray-500 w-5 h-5 mr-3 flex-shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="w-full bg-transparent text-gray-900 placeholder-gray-500 font-medium focus:outline-none text-base md:text-lg"
            />
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto min-h-[48px] md:h-14 px-8 rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base md:text-lg shadow-md transition-all active:scale-95 md:hover:scale-105"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
