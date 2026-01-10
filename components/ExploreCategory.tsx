"use client";

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function ExploreCategory() {

const categories = [
  {
    name: "Beach Getaways",
    icon: "🏖️",
    count: "45+ Tours"
  },
  {
    name: "Mountain Escapes",
    icon: "🏔️",
    count: "32+ Tours"
  },
  {
    name: "Desert Adventures",
    icon: "🏜️",
    count: "15+ Tours"
  },
  {
    name: "Forest & Wildlife",
    icon: "🌲",
    count: "28+ Tours"
  },
  {
    name: "Hill Stations",
    icon: "⛰️",
    count: "30+ Tours"
  },
  {
    name: "Adventure & Trekking",
    icon: "🥾",
    count: "50+ Tours"
  },
  {
    name: "Cultural Tours",
    icon: "🏛️",
    count: "20+ Tours"
  },
  {
    name: "Pilgrimage",
    icon: "🕉️",
    count: "12+ Tours"
  },
  {
    name: "Luxury Escapes",
    icon: "✨",
    count: "10+ Tours"
  }
]

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Explore by Category
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find the perfect trip for your travel style
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/explore?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-md font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {category.count}
              </p>
            </Link>
          ))}
          
           <Link
              href={`/explore`}
              className="group flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-all duration-300 text-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-200 transition-colors">
                 <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-md font-semibold text-blue-900">
                View All
              </h3>
            </Link>
        </div>
      </div>
    </section>
  )
}