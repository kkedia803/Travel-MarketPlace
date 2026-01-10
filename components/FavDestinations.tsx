"use client";

import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, Calendar, Star } from "lucide-react"

export default function FavDestinations() {

const categories = [
    {
      name: "Ladakh Expedition",
      destination: "Leh, Ladakh",
      src: "https://imgs.search.brave.com/fuuqt8gGGj-CTBGENYyjxvhTJ2Gthzfh3cyYP8maWOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzJmL0xlaXN1cmVf/TGVoX0xhZGFraC5q/cGc",
      type: "Adventure",
      duration: "7 Days",
      groupSize: "12-15",
      rating: 4.8
    },
    {
      name: "Manali Getaway",
      destination: "Manali, Himachal Pradesh",
      src: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww",
      type: "Hill Station",
      duration: "5 Days",
      groupSize: "8-12",
      rating: 4.6
    },
    {
      name: "Hampta Pass Trek",
      destination: "Hampta Pass",
      src: "https://imgs.search.brave.com/wAUdxlha9RFkMBSFP7AY3bbZysu0z2-JRVLi_OkDOms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZHlpZmZya3po/L2ltYWdlL3VwbG9h/ZC9jX2ZpbGwsZl9h/dXRvLGZsX3Byb2dy/ZXNzaXZlLnN0cmlw/X3Byb2ZpbGUsZ19j/ZW50ZXIsaF81MTgs/cV9hdXRvLHdfNjYw/L3YxNzAyNzA5MTk5/L2Jiai9kdnhxbTV0/cncweDRiZXZubnpq/ai5qcGc",
      type: "Trekking",
      duration: "4 Days",
      groupSize: "6-10",
      rating: 4.9
    },
    {
      name: "Spiti Valley Roadtrip",
      destination: "Spiti Valley",
      src: "https://www.tripsavvy.com/thmb/QO0P0dHsKwdycgi14QxO0hq2Jvk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-519309190-7706d8f2e6f84dd0ad3b0ed1b164feff.jpg",
      type: "Remote",
      duration: "8 Days",
      groupSize: "10-14",
      rating: 4.7
    },
  ]

return(
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
             <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Popular Destinations
                </h2>
                <p className="text-lg text-gray-500">
                Explore our most loved group trips
                </p>
             </div>
             {/* <Link href="/explore" className="text-blue-600 font-semibold hover:underline hidden sm:block">
                View all destinations
             </Link> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?destination=${category.destination}`}
                className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    src={category.src}
                    fill
                    alt={category.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                         <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                           {category.type}
                         </span>
                         <div className="flex items-center gap-1 text-white bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">{category.rating}</span>
                         </div>
                    </div>

                    <div className="text-white">
                        <h3 className="text-2xl font-bold mb-1 leading-tight">{category.name}</h3>
                        <div className="flex items-center gap-1.5 text-white/90 text-sm mb-3">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{category.destination.split(",")[0]}</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs md:text-sm text-white/80">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{category.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                <span>{category.groupSize}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
)}