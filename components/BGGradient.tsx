"use client"
import { useEffect, useRef } from 'react'
import { Gradient } from 'whatamesh'

export default function BGGradient() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        try {
            const gradient = new Gradient();
            gradient.initGradient("#gradient-canvas");
        } catch (error) {
            console.error('Gradient initialization failed:', error);
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id='gradient-canvas'
            className='z-[-10] w-screen'
        />
    )
}