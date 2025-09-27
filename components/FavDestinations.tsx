"use client";

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, MapPin, Users, Calendar, Star } from "lucide-react"

export default function FavDestinations() {

const categories = [
    { 
      name: "Ladakh", 
      destination: "Leh, Ladakh", 
      src: "https://imgs.search.brave.com/fuuqt8gGGj-CTBGENYyjxvhTJ2Gthzfh3cyYP8maWOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzJmL0xlaXN1cmVf/TGVoX0xhZGFraC5q/cGc",
      type: "Adventure",
      duration: "7 Days",
      groupSize: "12-15",
      rating: 4.8
    },
    { 
      name: "Manali", 
      destination: "Manali, Himachal Pradesh", 
      src: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww",
      type: "Hill Station",
      duration: "5 Days",
      groupSize: "8-12",
      rating: 4.6
    },
    { 
      name: "Hampta Pass", 
      destination: "Hampta Pass", 
      src: "https://imgs.search.brave.com/wAUdxlha9RFkMBSFP7AY3bbZysu0z2-JRVLi_OkDOms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZHlpZmZya3po/L2ltYWdlL3VwbG9h/ZC9jX2ZpbGwsZl9h/dXRvLGZsX3Byb2dy/ZXNzaXZlLnN0cmlw/X3Byb2ZpbGUsZ19j/ZW50ZXIsaF81MTgs/cV9hdXRvLHdfNjYw/L3YxNzAyNzA5MTk5/L2Jiai9kdnhxbTV0/cncweDRiZXZubnpq/ai5qcGc",
      type: "Trekking",
      duration: "4 Days",
      groupSize: "6-10",
      rating: 4.9
    },
    { 
      name: "Spiti Valley", 
      destination: "Spiti Valley", 
      src: "https://www.tripsavvy.com/thmb/QO0P0dHsKwdycgi14QxO0hq2Jvk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-519309190-7706d8f2e6f84dd0ad3b0ed1b164feff.jpg",
      type: "Remote",
      duration: "8 Days",
      groupSize: "10-14",
      rating: 4.7
    },
  ]

return(
    <section className="py-10 md:py-12 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/40 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(20,184,166,0.04),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-600 font-medium text-sm uppercase tracking-wider">
                Popular Group Adventures
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold font-glitten bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
              Trending Group Trips
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join fellow travelers on these most popular group adventures
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-5 scroll-px-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?destination=${category.destination}`}
                className="group relative overflow-hidden rounded-2xl bg-white/90 border border-white/40 shadow-lg md:hover:shadow-xl transition-all duration-300 md:hover:scale-[1.02] md:hover:-translate-y-1 aspect-[4/5] snap-start flex-shrink-0 w-64 md:w-auto"
              >
                <div className="absolute inset-0">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
                    src={category.src}
                    fill
                    alt={category.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:group-hover:from-black/60 transition-all duration-300" />

                {/* Top section with type and rating */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  <span className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 border border-white/30 rounded-full px-3 py-1 text-white text-xs font-medium">
                    {category.type}
                  </span>
                  <div className="flex items-center gap-1 bg-white/20 border border-white/30 rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">{category.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-white/80" />
                      <span className="text-white/80 text-xs font-medium">
                        {category.destination.split(",")[1]?.trim() || "India"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-calsans text-white leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Trip details */}
                  <div className="flex items-center justify-between text-white/90 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{category.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{category.groupSize} people</span>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-emerald-400/0 to-teal-400/0 md:group-hover:from-green-400/10 md:group-hover:via-emerald-400/10 md:group-hover:to-teal-400/10 transition-all duration-500 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>
)}