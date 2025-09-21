"use client";
import { ArrowRight, Award, Star } from "lucide-react";
import Link from "next/link"
import Image from "next/image"

export default function TopSellers() {

    const sellers = [
        {
            company_name: 'Capture a Trip',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1751470758/travel-packages/gq4l1ttzqunszk8xpfvw.jpg',
            id: 'ff6669f3-52c7-4e2b-964a-96a35eed4dac',
            rating: 4.8,
            trips: 150
        },
        {
            company_name: 'Trekyaari',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1758217738/travel-packages/fwpqu2qohq7gdxklofvv.webp',
            id: '63cc70a1-bc86-42fb-bc49-962d88e00f9c',
            rating: 4.9,
            trips: 200
        },
        {
            company_name: 'Backpackclan',
            avatar_url: 'https://res.cloudinary.com/dp647wpdp/image/upload/v1750737736/travel-packages/kamiyribyo49tgvpqg73.jpg',
            id: '19c71ebe-ba10-411d-8afa-c769e16b3661',
            rating: 4.7,
            trips: 120
        }
    ]

    return (
        <section className="py-16 bg-slate-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">
                            Top Performers
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-glitten text-slate-800 mb-3">
                        This Month's Top Sellers
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Meet our most trusted travel partners with excellent ratings
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((seller, index) => (
                        <Link
                            key={index}
                            href={`/seller/${seller.id}`}
                            className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] p-6"
                        >

                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100">
                                        <Image
                                            src={seller.avatar_url}
                                            alt={seller.company_name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Verified badge */}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                                        {seller.company_name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="font-medium">{seller.rating}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{seller.trips}+ trips</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visit button */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-sm text-slate-500">Verified Partner</span>
                                <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                                    View Profile
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}