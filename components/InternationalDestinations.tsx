"use client";

import Link from "next/link"
import Image from "next/image"
import { Plane, Globe, MapPin, Star } from "lucide-react"

export default function InternationalDestinations() {

    const categories = [
        { 
          name: "Hong Kong", 
          destination: "Hong Kong", 
          src: "https://www.mydays.ch/images/https%3A%2F%2Fmain.static.jsmd-group.com%2Fassets%2Fnew_default_upload_bucket%2Fdisneyland-paris-mit-uebernachtung-60438-2_1.jpg?w=735&h=483&fit=max&auto=format%2Ccompress&cs=srgb&dpr=2&q=50&s=9129336a3e238f70b2d6372fd7879af5",
          description: "Urban adventures",
          continent: "Asia",
          highlight: "Skyline & Culture"
        },
        { 
          name: "Thailand", 
          destination: "Thailand", 
          src: "https://www.travelandleisure.com/thmb/nDDNqO2EctQhiIfZrxeXTF47zhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-koh-phi-phi-PLACESTHAILAND1023-09b9d347b3cd4844b4ae19e4e06a9a6d.jpg",
          description: "Tropical paradise",
          continent: "Asia",
          highlight: "Beaches & Temples"
        },
        { 
          name: "Dubai", 
          destination: "Dubai", 
          src: "https://wallpapers.com/images/featured/dubai-pictures-8h5etmigpwhcbg5s.jpg",
          description: "Luxury destination",
          continent: "Middle East",
          highlight: "Modern Marvels"
        },
        { 
          name: "Maldives", 
          destination: "Maldives", 
          src: "https://media.cnn.com/api/v1/images/stellar/prod/230516112548-01-crossroads-maldives-aerial.jpg?c=original",
          description: "Island getaway",
          continent: "Indian Ocean",
          highlight: "Overwater Villas"
        },
    ]

    return (
        <section className="py-14 md:py-20 bg-gradient-to-br from-blue-50 via-cyan-50/50 to-teal-50/30 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.06),transparent_50%)]" />
            
            {/* Floating travel elements */}
            <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-16 right-16 w-28 h-28 bg-gradient-to-br from-cyan-300/20 to-teal-400/20 rounded-full blur-xl animate-pulse delay-1000" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
                            Global Adventures
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold font-glitten tracking-wide bg-gradient-to-r from-blue-800 via-cyan-800 to-teal-800 bg-clip-text text-transparent mb-4">
                        International Destinations
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore breathtaking destinations around the world with our curated international packages
                    </p>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 scroll-px-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/explore?destination=${category.destination}`}
                            className="group relative overflow-hidden rounded-2xl bg-white/80 border border-white/40 shadow-lg md:hover:shadow-2xl transition-all duration-300 md:hover:scale-[1.02] md:hover:-translate-y-1 aspect-[3/4] will-change-transform snap-start flex-shrink-0 w-64 md:w-auto"
                        >
                            {/* Image */}
                            <div className="absolute inset-0">
                                <Image
                                    className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                                    src={category.src}
                                    fill
                                    alt={category.name}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    loading="lazy"
                                />
                            </div>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:group-hover:from-black/60 transition-all duration-300" />

                            {/* Travel glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Content overlay */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Top section with continent */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 border border-white/30">
                                        <Globe className="w-3 h-3 text-white" />
                                        <span className="text-white text-xs font-medium">{category.continent}</span>
                                    </div>
                                    
                                    {/* Rating stars */}
                                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 border border-white/30">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white text-xs font-medium">4.8</span>
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
                                    
                                    {/* Highlight badge */}
                                    <div className="inline-block">
                                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/30 rounded-full px-3 py-1">
                                            <span className="text-blue-100 text-xs font-medium">{category.highlight}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-cyan-400/0 to-teal-400/0 md:group-hover:from-blue-400/10 md:group-hover:via-cyan-400/10 md:group-hover:to-teal-400/10 transition-all duration-500 pointer-events-none" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}