'use client';

import { useState } from 'react';
import { Calendar, Bus } from 'lucide-react';

export default function BusSearchUI() {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState('');

    const handleSwapLocations = () => {
        const temp = fromLocation;
        setFromLocation(toLocation);
        setToLocation(temp);
    };

    return (
        <div className="w-fit h-fit mx-auto text-black">
            <div className="w-full max-w-8xl px-4">
                <div className="relative">

                    {/* Search form */}
                    <div className="bg-[#D6E6F2] rounded-xl shadow-lg overflow-hidden relative z-10 py-1">
                        <div className="flex flex-col md:flex-row">
                            {/* From field */}
                            <div className="flex-1 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="">
                                        <Bus size={20} />
                                    </div>
                                    <div>
                                        <label className="block  text-sm mb-1">From</label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={fromLocation}
                                    onChange={(e) => setFromLocation(e.target.value)}
                                    className="w-full focus:outline-none text-white text-sm bg-transparent border border-white rounded-lg
                                    p-1 text-center"
                                    placeholder="Enter city or station"
                                />
                            </div>

                            {/* Swap button */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                                <button
                                    onClick={handleSwapLocations}
                                    className=" rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    {/* <SwapHorizontal size={20} className="" /> */}
                                </button>
                            </div>

                            {/* To field */}
                            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="">
                                        <Bus size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block  text-sm mb-1">To</label>
                                        <input
                                            type="text"
                                            value={toLocation}
                                            onChange={(e) => setToLocation(e.target.value)}
                                            className="w-full focus:outline-none text-white text-sm bg-transparent border border-white rounded-lg p-1 text-center"
                                            placeholder="Enter city or station"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date field */}
                            <div className="flex-1 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block  text-sm mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full focus:outline-none text-white text-sm bg-transparent border border-white rounded-lg
                                    p-1 text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Search button */}
                            <div className="bg-[#000A26] p-4 flex items-center justify-center cursor-pointer">
                                <button className="text-white font-medium text-base uppercase">
                                    Search Trip In Your City
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}