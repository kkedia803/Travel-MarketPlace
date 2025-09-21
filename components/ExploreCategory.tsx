"use client";

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function ExploreCategory() {

const categories = [
  {
    name: "Beach Getaways",
    blurColor: "from-blue-400/35 to-blue-600/35",
    icon: "🏖️",
    description: "Sun, sand & serenity"
  },
  {
    name: "Mountain Escapes",
    blurColor: "from-purple-400/25 to-purple-600/35",
    icon: "🏔️",
    description: "Peaks & panoramas"
  },
  {
    name: "Desert Adventures",
    blurColor: "from-yellow-400/25 to-yellow-700/35",
    icon: "🏜️",
    description: "Dunes & discoveries"
  },
  {
    name: "Forest & Wildlife",
    blurColor: "from-green-400/25 to-green-700/35",
    icon: "🌲",
    description: "Nature & wildlife"
  },
  {
    name: "Island Holidays",
    blurColor: "from-cyan-400/25 to-cyan-600/35",
    icon: "🏝️",
    description: "Tropical paradise"
  },
  {
    name: "Hill Stations",
    blurColor: "from-indigo-400/25 to-indigo-600/35",
    icon: "⛰️",
    description: "Cool & refreshing"
  },
  {
    name: "Adventure & Trekking",
    blurColor: "from-green-400/25 to-green-600/35",
    icon: "🥾",
    description: "Thrills & trails"
  },
  {
    name: "Cultural Tours",
    blurColor: "from-amber-400/25 to-amber-600/35",
    icon: "🏛️",
    description: "Heritage & history"
  },
  {
    name: "Pilgrimage & Spiritual",
    blurColor: "from-purple-400/25 to-purple-700/35",
    icon: "🕉️",
    description: "Peace & spirituality"
  },
  {
    name: "Wellness & Yoga Retreats",
    blurColor: "from-pink-400/25 to-pink-600/35",
    icon: "🧘",
    description: "Mind & body harmony"
  },
  {
    name: "Luxury Escapes",
    blurColor: "from-rose-400/25 to-rose-700/35",
    icon: "✨",
    description: "Premium experiences"
  },
  {
    name: "Budget Travel",
    blurColor: "from-slate-400/25 to-slate-600/35",
    icon: "💰",
    description: "Smart & affordable"
  },
  {
    name: "Family Friendly",
    blurColor: "from-orange-400/25 to-orange-600/35",
    icon: "👨‍👩‍👧‍👦",
    description: "Fun for everyone"
  },
  {
    name: "Solo Travel",
    blurColor: "from-sky-400/25 to-sky-600/35",
    icon: "🎒",
    description: "Independent journeys"
  },
  {
    name: "Weekend Getaways",
    blurColor: "from-lime-400/25 to-lime-600/35",
    icon: "🚗",
    description: "Quick escapes"
  }
]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/50 relative">
      {/* Simplified background - removed heavy gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-purple-600 font-medium text-sm uppercase tracking-wider">Discover</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-glitten tracking-wide bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Explore by Category
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Find your perfect adventure from our curated collection
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/explore?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] min-h-[160px] will-change-transform"
            >
              {/* Simplified gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.blurColor} opacity-50 group-hover:opacity-70 transition-opacity duration-200`} />
              
              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-105 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1 leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-600 opacity-75">
                    {category.description}
                  </p>
                </div>
                
                {/* Simplified arrow indicator */}
                <div className="flex justify-center mt-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-colors duration-200">
                    <ArrowRight className="w-3 h-3 text-slate-700" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}