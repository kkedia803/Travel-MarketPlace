"use client";
import { ArrowRight, Award, Star, ShieldCheck } from "lucide-react";
import Link from "next/link"
import Image from "next/image"

export default function TopSellers() {

    const sellers = [
        {
            company_name: 'Capture a Trip',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1751470758/travel-packages/gq4l1ttzqunszk8xpfvw.jpg',
            id: 'ff6669f3-52c7-4e2b-964a-96a35eed4dac',
            rating: 4.8,
            trips: 150,
            description: "Specializing in group trips for young travelers."
        },
        {
            company_name: 'Trekyaari',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1758217738/travel-packages/fwpqu2qohq7gdxklofvv.webp',
            id: '63cc70a1-bc86-42fb-bc49-962d88e00f9c',
            rating: 4.9,
            trips: 200,
            description: "Your go-to partner for Himalayan trekking adventures."
        },
        {
            company_name: 'Backpackclan',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1750737736/travel-packages/kamiyribyo49tgvpqg73.jpg',
            id: '19c71ebe-ba10-411d-8afa-c769e16b3661',
            rating: 4.7,
            trips: 120,
            description: "Budget-friendly backpacking trips across India."
        }
    ]

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                        Top Rated Hosts
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Book with confidence from our most trusted and verified travel partners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sellers.map((seller, index) => (
                        <Link
                            key={index}
                            href={`/seller/${seller.id}`}
                            className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-6"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                                        <Image
                                            src={seller.avatar_url}
                                            alt={seller.company_name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm ring-2 ring-white">
                                        <ShieldCheck className="w-3 h-3" />
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {seller.company_name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm mt-1">
                                        <div className="flex items-center gap-1 font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                                            <Star className="w-3.5 h-3.5 text-black fill-black" />
                                            <span>{seller.rating}</span>
                                        </div>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-600">{seller.trips} trips hosted</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                                {seller.description}
                            </p>

                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:underline underline-offset-4">
                                View Profile
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}