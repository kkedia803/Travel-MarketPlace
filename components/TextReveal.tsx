'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export const TextReveal = () => {
    const container = useRef();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", 'end start']
    })
    const translateY = useTransform(scrollYProgress, [0, 1], ["80%", "-80%"]);
    const scale = useTransform(scrollYProgress, [0, 1], ['80%', '100%']);
    const word = "Explore curated travel packages from verified sellers around the world. Book with confidence and create memories that last a lifetime.";
    return (
        <div>
            <div ref={container} className='bg-cover bg-clip-text'
            >
                {
                    word.split("").map((letter, i) => {
                        return <motion.span
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.01 * i, ease: [0.33, 1, 0.68, 2] }}
                            threshold={0.9999999}
                            viewport={{ once: true }}

                            className=''
                            style={{ translateY, scale }}
                        >{letter}</motion.span>
                    })
                }
            </div>
        </div>
    )
}
