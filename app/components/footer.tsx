"use client";
import { Mail, Phone, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export function Footer() {
    const links = [
        { page: 'Explore', link: '/explore' },
        { page: 'About', link: '/about' },
        { page: 'Contact', link: '/contact' },
        { page: 'Privacy', link: '/policy' },
        { page: 'Terms', link: '/tnc' },
    ]

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(147,51,234,0.03),transparent_50%)]" />
            
            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold font-glitten mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Traco It
                        </h2>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                            Your trusted travel companion for unforgettable journeys.
                        </p>
                        <div className="space-y-2">
                            <a href="tel:+918743809060" className="group flex items-center gap-3 text-slate-400 hover:text-blue-300 text-sm transition-all duration-200">
                                <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-200">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                +91 87438 09060
                            </a>
                            <a href="mailto:deepaktraco.in@gmail.com" className="group flex items-center gap-3 text-slate-400 hover:text-blue-300 text-sm transition-all duration-200">
                                <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-200">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                deepaktraco.in@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {links.map((item, index) => (
                                <Link key={index} href={item.link} className="group flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-1">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    <span className="group-hover:ml-1 transition-all duration-200">{item.page}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Stay Updated</h3>
                        <form className="space-y-3">
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder="Your email"
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                                />
                            </div>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-slate-500 mt-2">No spam, unsubscribe anytime</p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2025 Traco It. All rights reserved.</p>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xs mr-1">Follow us:</span>
                        <a href="#" className="group w-9 h-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Facebook className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
                        </a>
                        <a href="#" className="group w-9 h-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:border-pink-400 flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
                        </a>
                        <a href="#" className="group w-9 h-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-blue-400 hover:border-blue-300 flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Twitter className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// export default Footer