"use client";

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import React, { useRef } from 'react';
import Image from 'next/image';

export default function WhyChoose() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="relative h-[600vh] bg-white">
            <motion.div className="sticky top-0 h-screen overflow-hidden pointer-events-none">
                <div className="h-full w-full relative">
                    <Section1 scrollYProgress={scrollYProgress} />
                    <Section2 scrollYProgress={scrollYProgress} />
                    <Section3 scrollYProgress={scrollYProgress} />
                </div>
            </motion.div>
        </div>
    );
}

type SectionProps = {
    scrollYProgress: MotionValue<number>;
};

// Section 1
const Section1: React.FC<SectionProps> = ({ scrollYProgress }) => {
    const visible = useTransform(scrollYProgress, [0, 0.32, 0.33], [1, 1, 0]);
    const translateY = useTransform(scrollYProgress, [0, 0.33], [0, -100]);

    return (
        <motion.div
            style={{ opacity: visible, translateY }}
            className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-white"
        >
            <div className="flex gap-4 items-center">
                <div className="relative md:w-[25vw] md:h-[25vw]">
                    <Image src='/aboutus.jpg' alt="img" fill className="object-cover rounded-md" />
                </div>
                <motion.p className='gap-3 flex flex-col'>
                    <div className='text-6xl md:text-8xl font-bold text-blue-700'>Explore.</div>
                    <div className='max-w-xs sm:max-w-xl font-onest text-stone-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam quos maxime nesciunt nisi sint repellendus! Aspernatur blanditiis sequi assumenda cum dolorum at inventore, cumque eos quasi adipisci ad natus? Aliquam?</div>
                </motion.p>
            </div>
        </motion.div>
    );
};

// Section 2
const Section2: React.FC<SectionProps> = ({ scrollYProgress }) => {
    const visible = useTransform(scrollYProgress, [0.32, 0.49, 0.66], [0, 1, 0]);
    const translateY = useTransform(scrollYProgress, [0.33, 0.66], [100, 0]);

    return (
        <motion.div
            style={{ opacity: visible, translateY }}
            className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-white"
        >
            <div className="flex gap-4 items-center">
                <motion.p className='gap-3 flex flex-col'>
                    <div className='text-6xl md:text-8xl font-bold text-blue-700'>Dream.</div>
                    <div className='max-w-xs sm:max-w-xl font-onest text-stone-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam quos maxime nesciunt nisi sint repellendus! Aspernatur blanditiis sequi assumenda cum dolorum at inventore, cumque eos quasi adipisci ad natus? Aliquam?</div>
                </motion.p>
                <div className="relative md:w-[25vw] md:h-[25vw]">
                    <Image src='/bali1.jpg' alt="img" fill className="object-cover rounded-md" />
                </div>
            </div>
        </motion.div>
    );
};

// Section 3
const Section3: React.FC<SectionProps> = ({ scrollYProgress }) => {
    const visible = useTransform(scrollYProgress, [0.66, 0.85, 1], [0, 1, 1]);
    const translateY = useTransform(scrollYProgress, [0.66, 1], [100, 0]);

    return (
        <motion.div
            style={{ opacity: visible, translateY }}
            className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-white"
        >
            <div className="flex gap-4 items-center">
                <div className="relative md:w-[25vw] md:h-[25vw]">
                    <Image src='/bali2.jpg' alt="img" fill className="object-cover rounded-md" />
                </div>
                <motion.p className='gap-3 flex flex-col'>
                    <div className='text-6xl md:text-8xl font-bold text-blue-700'>Discover.</div>
                    <div className='max-w-xs sm:max-w-xl font-onest text-stone-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam quos maxime nesciunt nisi sint repellendus! Aspernatur blanditiis sequi assumenda cum dolorum at inventore, cumque eos quasi adipisci ad natus? Aliquam?</div>
                </motion.p>
            </div>
        </motion.div>
    );
};
