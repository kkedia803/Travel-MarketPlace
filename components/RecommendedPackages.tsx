"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import DestinationCard from "@/components/DestinationCard";

interface Package {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  final_price: number;
  discount: number;
  duration: number;
  category: string;
  images: string[];
  seller_id: string;
  is_approved: boolean;
}

interface RecommendedPackagesProps {
  currentPackageId: string;
  currentPrice: number;
  currentCategory?: string;
}

export default function RecommendedPackages({
  currentPackageId,
  currentPrice,
  currentCategory,
}: RecommendedPackagesProps) {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        // Define price range (e.g., +/- 30%)
        const minPrice = Math.round(currentPrice * 0.7);
        const maxPrice = Math.round(currentPrice * 1.3);

        let query = supabase
          .from("packages")
          .select("*")
          .eq("is_approved", true)
          .eq("status", "active")
          .neq("id", currentPackageId) // Exclude current package
          .gte("price", minPrice)
          .lte("price", maxPrice);
          
         // Optional: Prioritize same category if needed, but for now just price range as requested.
         // If we wanted to match category too, we could add .eq('category', currentCategory) 
         // or handle it with complex logic to fallback if no matches.
         // For now, let's stick to price range as primary filter.

        const { data, error } = await query.limit(4);

        if (error) throw error;
        
        // Ensure final_price exists as DestinationCard expects it
        const formattedData = (data || []).map((p: any) => ({
            ...p,
            discount: p.discount || 0,
            final_price: p.final_price !== undefined ? p.final_price : Math.round(p.price * (1 - (p.discount || 0) / 100))
        }));

        setPackages(formattedData);
      } catch (error) {
        console.error("Error fetching recommended packages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPrice) {
      fetchPackages();
    }
  }, [currentPackageId, currentPrice]);

  if (loading) {
    return (
      <section className="py-12 relative overflow-hidden">
        <div className="container px-0">
          <div className="animate-pulse space-y-4">
             <div className="h-8 bg-slate-200 rounded-lg w-64"></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-200 rounded-2xl h-80"></div>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no recommendations found, verify if we should hide the section or show generic top sellers. 
  // Let's hide it if empty to keep UI clean, or maybe show generic ones?
  // User asked for "recommendations... of same range". If none exist, better to show nothing than irrelevant ones.
  if (packages.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 bg-white relative">
      <div className="container px-0 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Recommended For You
                </h2>
                <p className="text-gray-500">
                    Similar packages within your budget.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => {
                 const isHovered = hoveredId !== null
                 const isThisHovered = hoveredId === pkg.id

                return (
                    <div key={pkg.id}>
                        <DestinationCard
                            destination={pkg}
                            isHovered={isHovered}
                            isThisHovered={isThisHovered}
                            setHoveredId={setHoveredId}
                        />
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
}
