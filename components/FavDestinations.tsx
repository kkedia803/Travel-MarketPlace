"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function FavDestinations() {

const categories = [
    { name: "Agra", src: "https://s3.india.com/wp-content/uploads/2024/09/Mehtab-Bagh-1.jpg?impolicy=Medium_Widthonly&w=350&h=263" },
    { name: "Vrindavan", src: "https://www.pilgrimagetour.in/blog/wp-content/uploads/2024/09/Prem-Mandir-Vrindavan.jpg" },
    { name: "Mussoorie", src: "https://s3.india.com/wp-content/uploads/2024/05/Feature-Image_-Mussoorie-5.jpg?impolicy=Medium_Widthonly&w=350&h=263" },
    { name: "Jim Corbett", src: "https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fimage.jpg%2Fimage-1725447883008.jpg&w=2048&q=75" },
  ]

return(
    <section className="py-16 bg-slate-200">
        <div className="container mx-auto">
          <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">Your Favourite Grouptrips</h2>
          <div className="flex md:grid overflow-x-auto md:overflow-visible gap-8 scrollbar-hide md:grid-cols-2 lg:grid-cols-4 md:max-w-full mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore`}
                className="min-w-[80%] relative flex flex-col itemscenter shadow-neutral-300 text-[#000A26] shadow-sm hover:scale-105 ease-in-out duration-300"
              >
                <Image
                  className="rounded-md w-full h-full"
                  src={category.src}
                  width={100}
                  height={100}
                  alt='idnex'
                />
                <div className="absolute inset-0" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="overflow-y-hidden text-3xl tracking-wider font-extrabold font-calsans text-white flex gap-1 items-center">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
)}