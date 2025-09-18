"use client"

import React, { useState } from "react";
import Image from 'next/Image'

export const TopBanner = ({ seller }) => {

    const [activeImage, setActiveImage] = useState(0);
    console.log(seller);

    const date = new Date(seller.created_at);
    const options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
    const trimmedDate = date.toLocaleDateString("en-US", options);

    return (
        <div className="relative w-full h-80 rounded-[3rem] overflow-hidden">
            {/* Background image */}
            <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" />
            {/* Text content */}
            <div className="relative z-10 flex flex-col p-10 h-full gap-6 text-white">
                <div className="flex items-center gap-5">
                    <div className="w-16 hidden sm:block sm:h-16 rounded-full border border-white  bg-white overflow-hidden">
                        <img
                            src={seller.avatar_url}
                            alt="Seller Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 font-sans">{seller.company_name}</h2>
                </div>
                <div className="flex flex-col font-onest gap-2">
                    {seller.bio?<span className="text-base">About Us : {seller.bio}</span>:''}
                    <span className="text-base">{seller.company_name} is with TracoIt from {trimmedDate} </span>
                    <span className="text-base">Total Packages : {seller.package_count} </span>
                </div>
            </div>
        </div>
    );
};