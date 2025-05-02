"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ExplorebyCategory() {

const categories = [
    { name: "Beach Getaways", src: "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea_74190-6772.jpg?t=st=1743502150~exp=1743505750~hmac=254b72ee61c7a2793b77b7ea4aa418d21ba15acd979367fb166412f2010f2e4d&w=1380" },
    { name: "Mountain Escapes", src: "https://img.freepik.com/free-photo/traveling-with-off-road-car_23-2151473117.jpg?uid=R111481632&ga=GA1.1.648242056.1663832767&semt=ais_hybrid" },
    { name: "Cultural Tours", src: "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747354.jpg?t=st=1743502337~exp=1743505937~hmac=a30e95a0dc4ef06c7b5290b057e8adae7e0468497477cb3e25a5baf7a125bcb3&w=1380" },
    { name: "Adventure", src: "https://img.freepik.com/free-photo/horizontal-shot-group-people-hiking-mountains-covered-snow-cloudy-sky_181624-44954.jpg?t=st=1743503655~exp=1743507255~hmac=dcafc980cb35b8949f51aae739456e0a374dff14f4e8ab599d517c03591297b3&w=1380" },
  ]

return(
    <section className="py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:max-w-full mx-auto gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?category=${category.name}`}
                className="relative flex flex-col itemscenter shadow-neutral-300 text-[#000A26] shadow-sm hover:scale-105 ease-in-out duration-300"
              >
                <Image
                  className="rounded-md w-full h-full scale-105"
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