// "use client"

import { FiMapPin, FiDollarSign, FiSearch } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "../ui/button";
import { Typewriter } from 'react-simple-typewriter';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import cities from "@/app/lib/cities";
import { MapPin } from 'lucide-react'
import { Input } from "../ui/input";

const SearchBox = () => {

    const router = useRouter();

    const [dest, setDest] = useState('');
    const [budget, setBudget] = useState(50000);
    const [filteredCities, setFilteredCities] = useState<typeof cities>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDest(value)

        if (value.length > 0) {
            const filtered = cities.filter(
                ({ city, state }) =>
                    city.toLowerCase().includes(value.toLowerCase()) ||
                    state.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };


    const handleSearch = async () => {
        console.log(dest)
        console.log(budget)

        router.push(`/explore?destination=${dest}&budget=${budget}`)
    }

    return (
        <div className="absolute flex flex-col justify-center items-center gap-4 md:gap-8 px-4 w-full max-w-4xl">
            {/* Typewriter Text */}
            <div className="text-center">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-onest uppercase font-bold text-[hsla(0,0%,100%,.7)] leading-tight">
                    <Typewriter
                        words={[
                            'Finding your next trip is just this easy...',
                            'Your next adventure starts here...',
                            'Discover places youve only dreamed of...',
                            // 'One search away from your perfect getaway...',
                            // "Turning travel dreams into real journeys...",
                            "Because the world is waiting for you...",
                            "Escape. Explore. Experience...",
                            "The easiest way to plan your next escape...",
                            "Your passport to endless destinations...",
                            "Travel made simple - just for you...",
                        ]}
                        loop={true}
                        cursor
                        cursorStyle="|"
                        typeSpeed={70}
                        deleteSpeed={40}
                        delaySpeed={1500}
                    />
                </span>
            </div>

            {/* Search Input Area - Responsive Layout */}
            <div className="w-full max-w-3xl bg-white/20 border border-black backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg">
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                    {/* Destination Input - Mobile */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-black/20">
                        <FiMapPin className="text-white text-lg flex-shrink-0" />
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-bold text-black/70 uppercase tracking-wide">
                                Destination
                            </label>
                            {/* <input
                                type="text"
                                placeholder="Where do you want to go?"
                                className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-base font-medium w-full"
                            /> */}
                            <input
                                    autoComplete="off"
                                    id="destination"
                                    value={dest}
                                    onChange={handleDestinationChange}
                                    onFocus={() => {
                                        if (dest.length > 0) {
                                            const filtered = cities.filter(
                                                ({ city, state }) =>
                                                    city.toLowerCase().includes(dest.toLowerCase()) ||
                                                    state.toLowerCase().includes(dest.toLowerCase())
                                            );
                                            setFilteredCities(filtered);
                                            setShowDropdown(true);
                                        }
                                    }}
                                    placeholder="Start typing city or state..."
                                    required
                                    className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-lg font-medium"
                                />
                        </div>
                    </div>

                    {/* Price Filter Input - Mobile */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-black/20">
                        <FaRupeeSign className="text-white text-lg flex-shrink-0" />
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-bold text-black/70 uppercase tracking-wide">
                                Max Budget
                            </label>
                            <input
                                type="number"
                                step={500}
                                min={0}
                                placeholder="Enter your budget"
                                className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-base font-medium w-full"
                            />
                            {showDropdown && filteredCities.length > 0 && (
                                    <div className="absolute z-10 w-[80%] top-20 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto ">
                                        {filteredCities.slice(0, 10).map(({ city, state }, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {setDest(`${city}, ${state}`); setShowDropdown(false)}}
                                                className="px-4 py-3 hover:bg-rose-500 cursor-pointer flex items-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                <span className="text-black">{city}, <span className="text-gray-700">{state}</span></span>
                                            </div>
                                        ))}
                                        {filteredCities.length > 10 && (
                                            <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                                                ... and {filteredCities.length - 10} more cities
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Search Button - Mobile */}
                    <div className="p-4" onClick={handleSearch}>
                        <button className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-black/80 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2">
                            <FiSearch className="text-lg" />
                            <span className="font-medium">Search</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Layout - Original Horizontal Design */}
                <div className="hidden md:flex items-center divide-black-200">
                    <div className="flex items-center divide-x divide-black/90 flex-1">
                        {/* Destination Input - Desktop */}
                        <div className="flex items-center gap-3 px-6 py-4 flex-[2]">
                            <FiMapPin className="text-white text-lg flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-black/70 uppercase tracking-wide">
                                    Destination
                                </label>
                                {/* <input
                                    onChange={(e) => { setDest(e.target.value) }}
                                    type="text"
                                    placeholder="Where do you want to go?"
                                    className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-lg font-medium w-full min-w-[200px]"
                                /> */}
                                <input
                                    autoComplete="off"
                                    id="destination"
                                    value={dest}
                                    onChange={handleDestinationChange}
                                    onFocus={() => {
                                        if (dest.length > 0) {
                                            const filtered = cities.filter(
                                                ({ city, state }) =>
                                                    city.toLowerCase().includes(dest.toLowerCase()) ||
                                                    state.toLowerCase().includes(dest.toLowerCase())
                                            );
                                            setFilteredCities(filtered);
                                            setShowDropdown(true);
                                        }
                                    }}
                                    placeholder="Start typing city or state..."
                                    required
                                    className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-lg font-medium"
                                />
                                {showDropdown && filteredCities.length > 0 && (
                                    <div className="absolute z-10 w-[50%] top-20 mt-1 bg-black/40 rounded-lg shadow-lg max-h-60 overflow-y-auto ">
                                        {filteredCities.slice(0, 10).map(({ city, state }, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {setDest(`${city}, ${state}`); setShowDropdown(false)}}
                                                className="px-4 py-3 hover:bg-rose-500 cursor-pointer flex items-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                <span className="text-white/90">{city}, <span className="text-white/70">{state}</span></span>
                                            </div>
                                        ))}
                                        {filteredCities.length > 10 && (
                                            <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                                                ... and {filteredCities.length - 10} more cities
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Filter Input - Desktop */}
                        <div className="flex items-center gap-3 px-4 py-4 flex-1">
                            <FaRupeeSign className="text-white text-lg flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-black/70 uppercase tracking-wide">
                                    Max Budget
                                </label>
                                <input
                                    onChange={(e) => { setBudget(Number(e.target.value)) }}
                                    type="number"
                                    step={500}
                                    min={0}
                                    placeholder="Enter your budget"
                                    className="font-sans text-white placeholder:text-white/80 bg-transparent border-none outline-none text-lg font-medium w-full min-w-[150px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Button - Desktop */}
                    <div className="px-4 py-5 bg-black rounded-r-3xl cursor-pointer" onClick={handleSearch}>
                        <button className="bg-black text-white p-3 rounded-xl hover:bg-black/80 transition-colors duration-200 shadow-sm">
                            <FiSearch className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
                <Link href={'/explore'} className="flex-1 sm:flex-none">
                    <Button className="w-fit md:w-full hover:bg-black/65 bg-black/65  px-6 py-2">
                        Explore More
                    </Button>
                </Link>
                <Link href={'/auth/register?role=seller'} className="flex-1 sm:flex-none">
                    <Button className="w-fit md:w-full hover:bg-black/65 bg-black/65 px-6 py-2">
                        Become a Seller
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default SearchBox;