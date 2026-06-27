// components/DestinationCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Heart, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Package {
  id: string
  title: string
  description: string
  destination: string
  discount: number
  price: number
  final_price?: number
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
  const displayPrice = destination.final_price ?? Math.round(destination.price * (1 - (destination.discount || 0) / 100))

  useEffect(() => {
    const isFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches
    if (isFinePointer && isThisHovered && destination.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % destination.images.length)
      }, 1200)
    } else {
        if(intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current)
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
      className="group relative flex flex-col h-full bg-transparent"
    >
      <Link href={`/packages/${destination.id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
          <Image
            src={destination.images[currentImageIndex] || "/placeholder.svg"}
            fill
            alt={destination.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
          
          {/* Heart Icon (Top Right) */}
          <button
            onClick={handleLikeClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-white stroke-[2px]'
              }`} 
            />
          </button>

          {/* Discount Badge (Top Left) */}
          {destination.discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-white text-black font-bold px-2 py-0.5 text-xs rounded-md shadow-sm hover:bg-white">
                Save {destination.discount}%
              </Badge>
            </div>
          )}

          {/* Carousel Dots (Bottom Center) - Only show on hover */}
          {destination.images.length > 1 && isThisHovered && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {destination.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          {/* Destination & Duration */}
          <div className="flex items-center text-xs text-gray-500 font-medium uppercase tracking-wide">
            <span>{destination.destination.split(",")[0]}</span>
            <span className="mx-1">•</span>
            <span>{destination.duration} days</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 md:text-lg group-hover:underline decoration-1 underline-offset-2">
            {destination.title}
          </h3>

          {/* Rating (Dummy for now as it's not in props) */}
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs text-gray-500 font-medium">124</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-gray-500">from</span>
            <span className="text-lg font-bold text-gray-900">
                ₹{displayPrice.toLocaleString()}
            </span>
            {destination.discount > 0 && (
                <span className="text-xs text-gray-400 line-through">
                    ₹{destination.price.toLocaleString()}
                </span>
            )}
            <span className="text-xs text-gray-500">per adult</span>
          </div>

          {/* Free Cancellation Badge text */}
          <div className="mt-1">
             <span className="text-xs font-medium text-blue-700">Free Cancellation</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
