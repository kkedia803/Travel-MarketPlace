"use client";

import Link from "next/link"
import Image from "next/image"
import { Play, ExternalLink, Eye } from "lucide-react"

export default function OurContent() {

  const categories = [
    { type: "reel", url: "https://www.instagram.com/reel/DJCTfZAP9j6/", src: "/Instagram/pic2.jpg", views: "5K", coverImage: "/Instagram/insta-logo.png" },
    { type: "reel", url: "https://www.instagram.com/reel/DIVleIovOUP/", src: "/Instagram/pic1.jpg", views: "10K", coverImage: "/Instagram/insta-logo.png" },
    { type: "reel", url: "https://www.instagram.com/reel/DICEQuvPwb8/", src: "/Instagram/pic3.jpg", views: "2K", coverImage: "/Instagram/insta-logo.png" },
    { type: "reel", url: "https://www.instagram.com/reel/DIHhaRETyKV/", src: "/Instagram/pic4.jpg", views: "3K", coverImage: "/Instagram/insta-logo.png" },
    { type: "blog", url: "https://traveltriangle.com/blog/backpacking-in-india/", src: "/Instagram/pic4.jpg", title: "21 Enthralling Trails For Trekkers In India That Will Instantly Get You Going In 2025 !", coverImage: "/Instagram/blog.png" },
    { type: "blog", url: "https://www.rei.com/learn/expert-advice/backpacking-beginners.html", src: "/Instagram/pic4.jpg", title: "Backpacking for Beginners", coverImage: "/Instagram/blog.png" },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold font-glitten tracking-wide bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Travel Content
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover amazing travel stories, reels, and guides from our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Link
              target="_blank"
              key={index}
              href={category.url}
              className="group relative overflow-hidden rounded-2xl bg-white/20 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
            >
              {/* Content Container */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {category.type === "reel" ? (
                  <>
                    <Image
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={category.src}
                      width={400}
                      height={500}
                      alt={`Travel reel ${index + 1}`}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16.66vw"
                    />
                    
                    {/* Glass overlay with play button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/25 border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>

                    {/* Views counter */}
                    <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-medium">{category.views}</span>
                    </div>

                    {/* Instagram logo */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-8 h-8 rounded-lg bg-white/25 border border-white/30 flex items-center justify-center">
                        <Image 
                          src={category.coverImage} 
                          alt="Instagram" 
                          width={20} 
                          height={20}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse" />
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 rounded-full bg-white/25 border border-white/30 flex items-center justify-center">
                            <Image 
                              src={category.coverImage} 
                              alt="Blog" 
                              width={24} 
                              height={24}
                              className="rounded"
                            />
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-tight line-clamp-4">
                          {category.title}
                        </h3>
                      </div>

                      {/* External link icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-white/25 border border-white/30 flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}