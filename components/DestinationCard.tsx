// components/DestinationCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Clock, IndianRupeeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
// import { Package } from "@/types"

interface Package {
  id: string
  title: string
  description: string
  destination: string
  discount: number
  price: number
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isThisHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % destination.images.length)
      }, 1000)
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout)
      setCurrentImageIndex(currentImageIndex)
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }
  }, [isThisHovered, destination.images.length])

  return (
    <div
      onMouseEnter={() => setHoveredId(destination.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`min-w-72 sm:min-w-0 transform will-change-transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered ? (isThisHovered ? "scale-105 md:scale-125 z-20" : "scale-75 opacity-80") : "scale-100"
        }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/packages/${destination.id}`}
              className="block relative rounded-md overflow-hidden shadow-md group"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={destination.images[currentImageIndex] || "/placeholder.svg"}
                  fill
                  alt={destination.title}
                  className="object-cover transition-transform duration-500"
                />
                {destination.discount > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge 
                      className="bg-teal text-white font-onest font-medium px-3 py-1 text-xs shadow-md"
                    >
                      {destination.discount}% OFF
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="overflow-y-hidden text-4xl tracking-wider font-extrabold font-calsans text-white flex gap-1 items-center">
                    {destination.destination.split(",")[0]}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="bg-white dark:bg-card rounded-sm p-4 space-y-3 font-onest">
                  <h3 className="text-lg font-bold text-navy">{destination.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IndianRupeeIcon className="h-4 w-4 text-teal" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">Price:</span> ₹{destination.price.toLocaleString()}<span>/person</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">Duration:</span> {destination.duration} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
