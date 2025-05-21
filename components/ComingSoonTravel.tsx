"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ComingSoonTravel() {

const categories = [
    { name: "Flight", src: "https://t4.ftcdn.net/jpg/04/30/34/01/360_F_430340104_Q7GFVt9iAXeWNgPLzbhB9bxLUfBaITaY.jpg" },
    { name: "Train", src: "https://thumbs.dreamstime.com/b/train-logo-concept-icon-illustration-design-170455146.jpg" },
    { name: "Bus", src: "https://i.pinimg.com/736x/7e/f2/4d/7ef24db3928b30fd17586d85d5c1e912.jpg" },
    { name: "Cab", src: "https://media.istockphoto.com/id/1003199434/vector/silhouette-of-a-taxi.jpg?s=612x612&w=0&k=20&c=lLUpDOkME6AsZAWHE8zV2xw76hQrVqkA4uhfgbYla8M=" },
    { name: "Hotel", src: "https://img.freepik.com/premium-vector/hotel-icon-line-art-logo-set_1223784-17559.jpg" },
    { name: "Offers", src: "https://thumbs.dreamstime.com/b/black-special-offer-flat-design-web-icon-logo-black-special-offer-flat-design-web-icon-logo-white-131849602.jpg" },
  ]

return(
    <section className="py-16 bg-slate-200">
        <div className="container mx-auto">
          <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">Coming Soon</h2>
          <div className="flex md:grid overflow-x-auto md:overflow-visible gap-8 scrollbar-hide md:grid-cols-2 lg:grid-cols-6 md:max-w-full mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={``}
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
                  <p className="overflow-y-hidden text-xl tracking-wider font-bold font-calsans text-black flex gap-1 items-center">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
)}