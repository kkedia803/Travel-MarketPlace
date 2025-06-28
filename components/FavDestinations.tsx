"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function FavDestinations() {

const categories = [
    { name: "Ladakh", destination:"Leh, ladakh", src: "https://imgs.search.brave.com/fuuqt8gGGj-CTBGENYyjxvhTJ2Gthzfh3cyYP8maWOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzJmL0xlaXN1cmVf/TGVoX0xhZGFraC5q/cGc" },
    { name: "Manali", destination:"Manali, Himachal Pradesh",  src: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww" },
    { name: "Hampta Pass", destination:"Hampta Pass",  src: "https://imgs.search.brave.com/wAUdxlha9RFkMBSFP7AY3bbZysu0z2-JRVLi_OkDOms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZHlpZmZya3po/L2ltYWdlL3VwbG9h/ZC9jX2ZpbGwsZl9h/dXRvLGZsX3Byb2dy/ZXNzaXZlLnN0cmlw/X3Byb2ZpbGUsZ19j/ZW50ZXIsaF81MTgs/cV9hdXRvLHdfNjYw/L3YxNzAyNzA5MTk5/L2Jiai9kdnhxbTV0/cncweDRiZXZubnpq/ai5qcGc" },
    { name: "Spiti Valley", destination:"Spiti Valley",  src: "https://www.tripsavvy.com/thmb/QO0P0dHsKwdycgi14QxO0hq2Jvk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-519309190-7706d8f2e6f84dd0ad3b0ed1b164feff.jpg" },
  ]

return(
    <section className="py-16 bg-slate-200">
        <div className="container mx-auto">
          <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">Trending Grouptrips</h2>
          <div className="flex md:grid overflow-x-auto md:overflow-visible gap-8 scrollbar-hide md:grid-cols-2 lg:grid-cols-4 md:max-w-full mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?destination=${category.destination}`}
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