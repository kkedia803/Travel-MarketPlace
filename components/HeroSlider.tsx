"use client";

import { useState, useEffect } from "react";
import { MaskText } from "@/components/MaskText";
import { TextReveal } from "@/components/TextReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

interface SlideProps {
    imageUrl: string;
    interval?: number;
    text?: string;
    subtext?: string;
}

const slides: SlideProps[] = [
    {
        imageUrl: "/utt.gif",
        interval: 15000,
        text: "UTTARAKHAND",
        subtext:"Explore the majestic beauty of the Himalayas, serene rivers, and ancient temples. Uttarakhand offers a perfect escape for nature lovers and adventure seekers."
    },
    {
        imageUrl: "/manal.gif",
        interval: 10000000,
        text: "MANALI",
        subtext:"Nestled in the heart of Himachal, Manali charms with its snow-capped peaks and vibrant local culture. An ideal destination for trekking, skiing, and romantic getaways."
    },
    {
        imageUrl: "/lakshwa.gif",
        interval: 100000000,
        text: "LAKSHADWEEP",
        subtext:"Discover the untouched paradise of Lakshadweep, with crystal-clear waters and exotic marine life. Perfect for snorkeling, beach hopping, and peaceful island retreats."
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [api, setApi] = useState<any>();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHeroSection, setIsHeroSection] = useState(true);
    // Auto-advance slides
    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                api.scrollNext();
            }, 300);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }, slides[currentSlide]?.interval || 5000);

        return () => clearInterval(interval);
    }, [api, currentSlide]);

    // Update current slide when carousel changes
    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrentSlide(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    // Handle navigation
    const handlePrevious = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            api?.scrollPrev();
        }, 300);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            api?.scrollNext();
        }, 300);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!api) return;

            if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [api]);

    // Scroll event to toggle hero section visibility
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setIsHeroSection(true); // Within hero section
            } else {
                setIsHeroSection(false); // Past hero section
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <Carousel
                setApi={setApi}
                className="h-full w-full"
                opts={{
                    loop: true,
                    align: "start",
                }}
            >
                <CarouselContent className="h-full">
                    {slides.map((slide, index) => (
                        <CarouselItem key={index} className="h-full">
                            <div className="relative h-[100vh] w-full">
                                {/* Background Image with Next.js Image for better performance */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={slide.imageUrl}
                                        alt={`Scenic landscape ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        className="object-cover object-center transition-transform duration-500"
                                        sizes="100vw"
                                        quality={90}
                                    />
                                </div>

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/20" />

                                {/* Content */}
                                <div className="relative z-10 flex h-full items-center justify-center">
                                    <div
                                        className={`container mx-auto px-4 transition-all duration-700 ${isTransitioning
                                            ? "opacity-0 translate-y-4"
                                            : "opacity-100 translate-y-0"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-6">
                                            <h1 className="text-4xl md:text-7xl lg:text-9xl font-semibold tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-white from-[20%] to-white/0 to-[80%] uppercase">
                                                <MaskText text={slide.text || ""}/>
                                            </h1>
                                            <p className="text-xs md:text-xl max-w-full w-full text-balance text-blue-ice">
                                                <TextReveal text={slide.subtext || ""} />
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                                <Link href="/explore">
                                                    <Button className="font-onest md:w-fit w-40 gap-2 backdrop-blur-sm bg-transparent border border-white/70 md:text-sm text-xs hover:bg-white/10 transition-colors">
                                                        Explore Packages <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href="/auth/register?role=seller">
                                                    <Button variant="outline" className="font-onest md:w-fit w-40 bg-white/90 md:text-sm text-xs hover:bg-white/100">
                                                        Become a Seller
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Modern Navigation Arrows */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 p-3 md:p-4 transition-all duration-300 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 p-3 md:p-4 transition-all duration-300 group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Custom Navigation Indicators */}
                <div className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center gap-2 ${isHeroSection ? '' : 'hidden'}`}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setTimeout(() => {
                                    api?.scrollTo(index);
                                }, 300);
                                setTimeout(() => {
                                    setIsTransitioning(false);
                                }, 600);
                            }}
                            className={`h-1.5 rounded transition-all duration-300 ${currentSlide === index ? "w-16 bg-white" : "w-6 bg-white/40 hover:bg-white/60"}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

            </Carousel>
        </section>
    );
}
