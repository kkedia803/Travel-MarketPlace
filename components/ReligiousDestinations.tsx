"use client";

import Link from "next/link"
import Image from "next/image"
import { MapPin, Sparkles, Heart } from "lucide-react"

export default function ReligiousDestinations() {

const categories = [
    { 
      name: "Varanasi", 
      destination: "Varanasi", 
      src: "https://www.visitkashi.in/backend/admin/product_images/172448788939.jpg",
      description: "Ancient spiritual city",
      significance: "Oldest living city"
    },
    { 
      name: "Vaishno Devi", 
      destination: "Katra", 
      src: "https://www.indiantempletour.com/wp-content/uploads/2016/06/Vaishno-Devi-Yatra.webp",
      description: "Sacred pilgrimage site",
      significance: "Divine mother's abode"
    },
    { 
      name: "Vrindavan", 
      destination: "Vrindavan", 
      src: "https://experiencemyindia.com/wp-content/uploads/2024/10/iskcon.jpg.webp",
      description: "Krishna's holy land",
      significance: "Land of divine love"
    },
    { 
      name: "Haridwar", 
      destination: "Haridwar", 
      src: "https://s7ap1.scene7.com/is/image/incredibleindia/ganga-ghat-haridwar1-attr-hero?qlt=82&ts=1726645870499",
      description: "Gateway to the gods",
      significance: "Sacred Ganga aarti"
    },
  ]

return(
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,119,6,0.06),transparent_50%)]" />
        
        {/* Floating spiritual elements */}
        <div className="absolute top-10 right-20 w-16 h-16 bg-gradient-to-br from-orange-300/20 to-amber-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-orange-600 font-medium text-sm uppercase tracking-wider">
                Sacred Journeys
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold font-glitten tracking-wide bg-gradient-to-r from-orange-800 via-amber-800 to-yellow-800 bg-clip-text text-transparent mb-4">
              Religious Destinations
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Embark on spiritual journeys to India's most sacred and revered destinations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?destination=${category.destination}`}
                className="group relative overflow-hidden rounded-2xl bg-white/80 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 aspect-[3/4] will-change-transform"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={category.src}
                    fill
                    alt={category.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300" />

                {/* Spiritual glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top section with location */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 border border-white/30">
                      <MapPin className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">{category.destination}</span>
                    </div>
                    
                    {/* Sacred symbol */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-white/30 flex items-center justify-center">
                      <span className="text-white text-sm">🕉️</span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-white/80 text-sm font-medium">{category.description}</p>
                      <h3 className="text-2xl md:text-3xl font-bold font-calsans text-white leading-tight">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Significance badge */}
                    <div className="inline-block">
                      <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-300/30 rounded-full px-3 py-1">
                        <span className="text-orange-100 text-xs font-medium">{category.significance}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/0 via-amber-400/0 to-yellow-400/0 group-hover:from-orange-400/10 group-hover:via-amber-400/10 group-hover:to-yellow-400/10 transition-all duration-500 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>
)}