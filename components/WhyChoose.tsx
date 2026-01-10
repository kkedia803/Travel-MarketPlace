"use client";

import { ShieldCheck, CalendarClock, Globe, Headphones } from 'lucide-react';

export default function WhyChoose() {
    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
            title: "Ultimate Flexibility",
            description: "You're in control, with free cancellation and payment options to satisfy any plan or budget."
        },
        {
            icon: <Globe className="w-8 h-8 text-blue-600" />,
            title: "Memorable Experiences",
            description: "Browse and book tours and activities so incredible, you'll want to tell your friends."
        },
        {
            icon: <CalendarClock className="w-8 h-8 text-amber-600" />,
            title: "Quality at Our Core",
            description: "High quality standards. Millions of reviews. A trip company you can trust."
        },
        {
            icon: <Headphones className="w-8 h-8 text-purple-600" />,
            title: "Award-Winning Support",
            description: "New price? New plan? No problem. We're here to help, 24/7."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Why plan with TracoIt?
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        We make it easy to find and book unforgettable travel experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
