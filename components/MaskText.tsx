'use client'
import { motion } from 'framer-motion';

export function MaskText({text}: {text: string}) {
    // const text = 'ADVENTURE'
    return (
        <div>
            <div className='overflow-hidden'>
                <motion.p
                    className='text-3xl md:text-5xl lg:text-[5rem] font-bold text-white font-boruna'
                    initial={{ y: '100%' }}
                    whileInView={{ y: '0', }}
                    transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                    viewport={{ once: true }}
                >{text}</motion.p>
            </div>
        </div>
    )
}

