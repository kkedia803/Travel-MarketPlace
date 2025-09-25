// components/DestinationCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Clock, IndianRupeeIcon, MapPin, Calendar, Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Package {
  id: string
  title: string
  description: string
  destination: string
  discount: number
  price: number
  final_price: number
  duration: number
  category: string
  images: string[]
  seller_id: string
  is_approved: boolean
}

interface Props {
  destination: Package
  isHovered: boolean
  isThisHovered: boolean
  setHoveredId: (id: string | null) => void
}

export default function DestinationCard({ destination, isHovered, isThisHovered, setHoveredId }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isThisHovered && destination.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % destination.images.length)
      }, 1200)
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }
  }, [isThisHovered, destination.images.length])

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <div
      onMouseEnter={() => setHoveredId(destination.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`transform will-change-transform transition-all duration-300 ease-out ${
        isHovered 
          ? (isThisHovered ? "scale-105 z-20" : "scale-95 opacity-70") 
          : "scale-100"
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/packages/${destination.id}`}
              className="block relative rounded-2xl overflow-hidden bg-white/90 border border-white/40 shadow-lg hover:shadow-2xl group transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={destination.images[currentImageIndex] || "/placeholder.svg"}
                  fill
                  alt={destination.title}
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Discount badge */}
                {destination.discount > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-xs shadow-lg border-0 rounded-full">
                      {destination.discount}% OFF
                    </Badge>
                  </div>
                )}

                {/* Like button */}
                <button
                  onClick={handleLikeClick}
                  className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/25 border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <Heart 
                    className={`w-4 h-4 transition-all duration-200 ${
                      isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                    }`} 
                  />
                </button>

                {/* Image indicators */}
                {destination.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {destination.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Destination overlay */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm font-medium">
                      {destination.destination.split(",")[1]?.trim() || "India"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-calsans text-white leading-tight">
                    {destination.destination.split(",")[0]}
                  </h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                    {destination.title}
                  </h4>
                  
                  {/* Category badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                      {destination.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <IndianRupeeIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Starting from</p>
                        <div className="flex items-center gap-2">
                          {destination.discount > 0 && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{destination.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-lg font-bold text-slate-800">
                            ₹{destination.final_price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Duration</p>
                      <p className="font-semibold text-slate-700">{destination.duration} days</p>
                    </div>
                  </div>
                </div>

                {/* Rating placeholder */}
                {/* <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 ml-1">4.8 (124 reviews)</span>
                </div> */}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500 pointer-events-none" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
            <p className="font-medium">{destination.title}</p>
            <p className="text-sm text-slate-300">Click to view details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
