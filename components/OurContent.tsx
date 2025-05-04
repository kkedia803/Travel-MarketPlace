"use client";

import Link from "next/link"
import Image from "next/image"

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
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">Have a look at Travel Content!</h2>
        <div className="flex md:grid overflow-x-auto md:overflow-visible scrollbar-hide md:grid-cols-2 lg:grid-cols-6 md:max-w-full mx-auto gap-8">
          {categories.map((category, index) => (
            <Link
              target="_blank"
              key={index}
              href={`${category.url}`}
              className="min-w-52 group h-auto w-auto relative flex flex-col itemscenter shadow-neutral-300 text-[#000A26] shadow-sm hover:scale-105 ease-in-out duration-300"
            >
              {category.type === "reel" ? (
                <Image
                  className="w-full h-full object-cover rounded-md"
                  src={category.src}
                  width={300}
                  height={300}
                  alt={`Instagram reel ${index}`}
                />
              ) : (
                <div className="flex rounded-md items-center justify-center bg-gradient-to-r from-stone-600 to-stone-600 text-white text-center p-4 h-full min-h-[200px]">
                  <span className="text-lg font-semibold font-onest text-blue-ice">{category.title}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 rounded-md">
                <Image src={`${category.coverImage}`} alt="Instagram" width={100} height={100} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}