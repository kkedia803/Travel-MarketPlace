"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link"

export default function TopSellers() {

    const sellers = [
        {
            company_name: 'Capture a Trip',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1751470758/travel-packages/gq4l1ttzqunszk8xpfvw.jpg',
            id: 'ff6669f3-52c7-4e2b-964a-96a35eed4dac'
        },
        {
            company_name: 'Trekyaari',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1758217738/travel-packages/fwpqu2qohq7gdxklofvv.webp',
            id: '63cc70a1-bc86-42fb-bc49-962d88e00f9c'
        },
        {
            company_name: 'Backpackclan',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1750737736/travel-packages/kamiyribyo49tgvpqg73.jpg',
            id: '19c71ebe-ba10-411d-8afa-c769e16b3661'
        }
    ]

    return (
        <section className="py-16">
            <div className="container mx-auto ">
                <h2 className="mb-12 text-neutral-900 text-4xl font-semibold font-glitten tracking-wider">This Month Top Sellers</h2>
                <div className="flex flex-col md:grid md:overflow-visible gap-8 md:grid-cols-2 lg:grid-cols-3 md:max-w-full mx-auto">
                    {sellers.map((seller, index) => (
                        <Link
                            key={index}
                            href={`/seller/${seller.id}`}
                            className="rounded-2xl min-w-[80%] flex flex-col itemscenter shadow-neutral-300 text-[#000A26] shadow-sm hover:scale-105 ease-in-out duration-300  bg-neutral-400/20 backdrop-blur-[1px] border border-neutral-400/90 "
                        >
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-5 p-3">
                                    <div className="w-16 h-16 rounded-full border border-white  bg-white overflow-hidden">
                                        <img
                                            src={seller.avatar_url}
                                            alt="Seller Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 font-sans">{seller.company_name}</h2>
                                </div>
                                <div className="mr-8 bg-slate-600 text-white px-2 py-1 w-16 justify-center items-center rounded-xl hidden sm:flex">
                                    Visit <ArrowRight className="h-4"/>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}