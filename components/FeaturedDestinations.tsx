"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LocateIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabase"
import DestinationCard from "@/components/DestinationCard"


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

export default function FeaturedDestination() {
    const [loading, setLoading] = useState(true)
    const [packages, setPackages] = useState<Package[]>([])
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase.from("packages").select("*").eq("is_approved", true)
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

    return (
        <section className="py-16">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">

                    <h2 className="text-4xl font-semibold font-glitten tracking-wider">Featured Destinations</h2>

                    <Link href="/explore">
                        <Button variant="ghost" className=" hidden sm:inline gap-2 text-xl font-semibold font-glitten">
                            View All <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:max-w-full mx-auto gap-5">
                    {packages.map((destination) => {
                        const isHovered = hoveredId !== null
                        const isThisHovered = hoveredId === destination.id


                        return (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                                isHovered={isHovered}
                                isThisHovered={isThisHovered}
                                setHoveredId={setHoveredId}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
