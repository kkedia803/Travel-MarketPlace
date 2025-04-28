"use client";
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from "@/components/ui/button"

export function Footer() {
    const company = [
        {
            page: 'Explore',
            link: '/explore',
        },
        {
            page: 'About Us',
            link: '/about',
        },
        {
            page: 'Contact',
            link: '/contact',
        },
        {
            page: 'New Here?',
            link: '/auth/register',
        },
    ]
    return (
        <motion.div
            initial={{ y: '20%', opacity: 0 }}
            whileInView={{ y: '0', opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], }}
            viewport={{ once: true }}
            className='pt-4 overflow-hidden'
        >
            <motion.footer
                initial={{ y: '20%', opacity: 0 }}
                whileInView={{ y: '0', opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], }}
                viewport={{ once: true }}
                className="font-onest relative md:w-full md:px-10 px-5 mx-auto bg-gradient-to-br from-blue-950 via-sky-700 to-blue-950">
                <div className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            viewport={{ once: true }}
                            className='md:col-span-1 col-span-2'
                        >
                            <Link href='/' className="flex items-center" aria-label="Rapid AI">
                                {/* <Image
                                    src='/sitescriptwhitelogo.png'
                                    width={100}
                                    height={100}
                                    alt='SiteScriptLogo'
                                    className='w-10'
                                /> */}
                            </Link>
                            <motion.span
                                initial={{ y: 150 }}
                                whileInView={{ y: -20 }}
                                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                                viewport={{ once: true }}
                                className='font-bulgatti absolute z-0 md:text-[15rem] text-[0rem] opacity-20 tracking-wider bg-clip-text text-white bggradient-to-r from-white via-indigo-100 to-indigo-300 font-medium w-fit cursor-default'>
                                Traco It</motion.span>
                        </motion.div>
                        {/* End Col */}

                        <div className="md:col-span-1 col-span-2 relative z-10">
                            <h4 className="font-semibold text-gray-100 text-2xl">Contact</h4>

                            <div className="mt-3 grid space-y-3">
                                <p><a href="tel: +919599791185" target='_blank' className="inline-flex items-center gap-x-2 text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-200">
                                    <Phone className='size-4' /> +91 9999999999
                                </a></p>
                                <p><a href='mailto: example@gmail.com' target='_blank' className=" inline-flex items-center gap-x-2 text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-200">
                                    <Mail className='size-4' /> example@gmail.com
                                </a></p>
                            </div>
                        </div>
                        {/* End Col */}

                        <div className="md:col-span-1 col-span-2 relative z-10">
                            <h4 className="font-semibold text-gray-100 font-onest text-2xl">Company</h4>

                            <div className="mt-3 grid space-y-3">
                                {company.map((item, index) => {
                                    return (
                                        <p key={index}>
                                            <Link href={item.link} className="inline-flex gap-x-2 text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-200">
                                                {item.page}
                                            </Link>
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                        {/* End Col */}

                        <div className="col-span-2 relative z-10">
                            <h4 className="font-semibold text-gray-100 capitalize text-2xl">Stay up to date</h4>

                            <form>
                                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 p-2">
                                    <div className="w-full">
                                        <label htmlFor="hero-input" className="sr-only">Subscribe</label>
                                        <input type="text" id="hero-input" name="hero-input" className="p-2.5 px-4 block w-full border-transparent rounded-full sm:text-sm disabled:opacity-50 disabled:pointer-events-none bg-white" placeholder="Enter your email" />
                                    </div>
                                    <div
                                        className="flex justify-center">
                                        <Button className='rounded-full text-base font-light p-5 bg-gradient-to-tr from-black to-blue-800'>
                                            Subscribe
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-white">
                                    Get Best Offers. Never spam.
                                </p>
                            </form>
                        </div>
                        {/* End Col */}
                    </div>
                    {/* End Grid */}

                    <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center relative z-10">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            {/* <p className="text-sm text-gray-400">
                                © 2025 SiteScript
                            </p> */}
                        </div>
                        {/* End Col */}

                        {/* Social Brands */}
                        <div>
                            <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                </svg>
                            </a>
                            <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                </svg>
                            </a>
                            <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                </svg>
                            </a>
                            <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                            </a>
                            <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.88a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z" />
                                </svg>
                            </a>

                            {/* <a className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z" />
                                </svg>
                            </a> */}
                        </div>
                        {/* End Social Brands */}
                    </div>
                </div>
            </motion.footer>
            {/* ========== END FOOTER ========== */}
        </motion.div>
    )
}

// export default Footer