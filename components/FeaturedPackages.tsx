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
                const { data, error } = await supabase.from("packages").select("*").eq("is_approved", true).eq("status", "active").order('updated_at',{ascending:false}).limit(4)
                if (error) throw error
                setPackages((data || []).map((pkg) => ({
                    ...pkg,
                    discount: pkg.discount || 0,
                    final_price: pkg.final_price ?? Math.round(pkg.price * (1 - (pkg.discount || 0) / 100)),
                })))
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
        <>
        <section className="py-12 md:py-16 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-3 sm:gap-4">
                    <div className="space-y-1 md:space-y-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Featured Packages
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 max-w-2xl">
                            Our most popular travel experiences for you.
                        </p>
                    </div>

                    <Link href="/explore" className="hidden sm:block">
                        <Button 
                            variant="outline" 
                            className="rounded-full border-gray-300 hover:bg-gray-50 text-gray-900 font-medium px-6"
                        >
                            View All
                        </Button>
                    </Link>
                </div>

                {packages.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">No packages available</h3>
                        <p className="text-gray-500">Check back soon for amazing travel deals!</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 pl-4 pr-4 sm:pl-6 sm:pr-6 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 md:overflow-visible md:p-0 scrollbar-hide">
                        {packages.map((destination) => {
                            const isHovered = hoveredId !== null
                            const isThisHovered = hoveredId === destination.id

                            return (
                                <div key={destination.id} className="snap-start flex-shrink-0 w-80 md:w-auto">
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
                 
                 <div className="mt-6 sm:hidden w-full">
                    <Link href="/explore" className="block w-full">
                        <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold text-base transition-colors"
                        >
                            View All Packages
                        </Button>
                    </Link>
                 </div>
            </div>
        </section>
        <style jsx global>{`
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
        `}</style>
    </>
    )
}
