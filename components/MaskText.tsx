'use client'
import { motion } from 'framer-motion';

export function MaskText() {
    const text = 'ADVENTURE'
    return (
        <div>
            <div className='overflow-'>
                <motion.p
                    initial={{ y: '100%' }}
                    whileInView={{ y: '0', }}
                    transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                    threshold={0.9999999}
                    viewport={{ once: true }}
                >{text}</motion.p>
            </div>
        </div>
    )
}
