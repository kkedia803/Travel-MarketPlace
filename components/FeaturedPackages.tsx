"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabase"
import DestinationCard from "@/components/DestinationCard"

interface Package {
    id: string
    title: string
    description: string
    destination: string
    price: number
    final_price:number
    discount: number
    duration: number
    category: string
    images: string[]
    seller_id: string
    is_approved: boolean
}

export default function FeaturedPackages() {
    const [loading, setLoading] = useState(true)
    const [packages, setPackages] = useState<Package[]>([])
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase.from("packages").select("*").eq("is_approved", true).limit(5)
                if (error) throw error
                setPackages(data || [])
            } catch (error) {
                console.error("Error fetching packages:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages()
    }, [])

    if (loading) {
        return (
            <section className="py-14 md:py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="flex justify-between items-center mb-12 md:mb-16">
                            <div className="h-12 bg-slate-200 rounded-lg w-80"></div>
                            <div className="h-10 bg-slate-200 rounded-lg w-32 hidden sm:block"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-slate-200 rounded-2xl h-80"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-14 md:py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.06),transparent_50%)]" />
            
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse delay-1000" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 md:mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-purple-600 font-medium text-sm uppercase tracking-wider">
                                Handpicked for You
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold font-glitten tracking-wide bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Featured Packages
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Discover our most popular travel experiences, carefully curated for unforgettable adventures
                        </p>
                    </div>

                    <Link href="/explore" className="group">
                        <Button 
                            variant="ghost" 
                            className="bg-white/80 border border-white/40 hover:bg-white/90 hover:border-white/60 transition-all duration-300 gap-3 text-lg font-semibold font-glitten px-6 py-3 h-auto rounded-xl shadow-lg md:hover:shadow-xl md:group-hover:scale-105"
                        >
                            <TrendingUp className="w-5 h-5" />
                            View All Packages
                            <ArrowRight className="w-5 h-5 md:group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </Link>
                </div>

                {packages.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">No packages available</h3>
                        <p className="text-slate-500">Check back soon for amazing travel deals!</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 scroll-px-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:overflow-visible md:mx-0 md:px-0">
                        {packages.map((destination) => {
                            const isHovered = hoveredId !== null
                            const isThisHovered = hoveredId === destination.id

                            return (
                                <div key={destination.id} className="snap-start flex-shrink-0 w-64 md:w-auto">
                                    <DestinationCard
                                        destination={destination}
                                        isHovered={isHovered}
                                        isThisHovered={isThisHovered}
                                        setHoveredId={setHoveredId}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
