"use client";

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, MapPin } from "lucide-react"

export default function FavDestinations() {

const categories = [
    { 
      name: "Ladakh", 
      destination: "Leh, Ladakh", 
      src: "https://imgs.search.brave.com/fuuqt8gGGj-CTBGENYyjxvhTJ2Gthzfh3cyYP8maWOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzJmL0xlaXN1cmVf/TGVoX0xhZGFraC5q/cGc",
      type: "Adventure"
    },
    { 
      name: "Manali", 
      destination: "Manali, Himachal Pradesh", 
      src: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww",
      type: "Hill Station"
    },
    { 
      name: "Hampta Pass", 
      destination: "Hampta Pass", 
      src: "https://imgs.search.brave.com/wAUdxlha9RFkMBSFP7AY3bbZysu0z2-JRVLi_OkDOms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZHlpZmZya3po/L2ltYWdlL3VwbG9h/ZC9jX2ZpbGwsZl9h/dXRvLGZsX3Byb2dy/ZXNzaXZlLnN0cmlw/X3Byb2ZpbGUsZ19j/ZW50ZXIsaF81MTgs/cV9hdXRvLHdfNjYw/L3YxNzAyNzA5MTk5/L2Jiai9kdnhxbTV0/cncweDRiZXZubnpq/ai5qcGc",
      type: "Trekking"
    },
    { 
      name: "Spiti Valley", 
      destination: "Spiti Valley", 
      src: "https://www.tripsavvy.com/thmb/QO0P0dHsKwdycgi14QxO0hq2Jvk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-519309190-7706d8f2e6f84dd0ad3b0ed1b164feff.jpg",
      type: "Remote"
    },
  ]

return(
    <section className="py-16 bg-slate-100/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium text-sm uppercase tracking-wider">
                Popular Choices
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-glitten text-slate-800 mb-3">
              Trending Group Trips
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Join fellow travelers on these most popular group adventures
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?destination=${category.destination}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] aspect-[4/5]"
              >
                <div className="absolute inset-0">
                  <Image
                    className="w-full h-full object-cover"
                    src={category.src}
                    fill
                    alt={category.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-white text-xs font-medium">
                    {category.type}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-white/80" />
                    <span className="text-white/80 text-xs font-medium">
                      {category.destination.split(",")[1]?.trim() || "India"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-calsans text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
)}