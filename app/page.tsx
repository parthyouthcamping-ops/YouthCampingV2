"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, ArrowRight, Star, Instagram, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    const { brand } = useBrandSettings();
    const router = useRouter();
    const [slug, setSlug] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (slug.trim()) {
            router.push(`/quote/${slug.trim()}`);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-white font-montserrat text-gray-900">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
                        className="w-full h-full object-cover" 
                        alt="Travel Hero" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-8"
                    >
                        {brand?.companyLogo ? (
                            <img src={brand.companyLogo} className="h-24 w-auto object-contain brightness-0 invert" alt="Company Logo" />
                        ) : (
                            <h1 className="text-6xl font-black tracking-tighter uppercase italic">
                                YouthCamping
                            </h1>
                        )}

                        <div className="space-y-4 max-w-3xl">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight">
                                Luxury Travel <br /><span className="text-primary italic">Personified</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-medium text-white/80 uppercase tracking-[0.3em]">
                                One Trip at a Time
                            </p>
                        </div>

                        {/* View Quotation Search */}
                        <div className="w-full max-w-xl mt-12">
                            <form onSubmit={handleSearch} className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                                    <Search size={24} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Your Quotation ID / Slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full pl-16 pr-40 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-[2rem] text-white placeholder:text-white/50 font-bold focus:bg-white focus:text-gray-900 focus:border-white transition-all outline-none shadow-2xl"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-deep transition-all transform hover:-translate-x-1"
                                >
                                    View Quote
                                </button>
                            </form>
                            <p className="mt-4 text-xs font-bold text-white/60 uppercase tracking-widest">
                                Don't have an ID? Contact your travel expert.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features/Why Us */}
            <section className="py-32 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto md:mx-0">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Curated Destinations</h3>
                        <p className="text-gray-500 leading-relaxed font-medium italic">
                            Handpicked locations that offer the perfect blend of adventure and luxury.
                        </p>
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto md:mx-0">
                            <Star size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Elite Experiences</h3>
                        <p className="text-gray-500 leading-relaxed font-medium italic">
                            Exclusive access to the most premium activities and hidden gems globally.
                        </p>
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto md:mx-0">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Seamless Planning</h3>
                        <p className="text-gray-500 leading-relaxed font-medium italic">
                            Leave the details to us. We craft every second of your journey for perfection.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-20 bg-gray-950 text-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-16">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">YouthCamping</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">One Trip at a Time</p>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-primary transition-colors uppercase font-black text-xs tracking-widest">About</a>
                            <a href="#" className="hover:text-primary transition-colors uppercase font-black text-xs tracking-widest">Connect</a>
                            <a href="#" className="hover:text-primary transition-colors uppercase font-black text-xs tracking-widest">Privacy</a>
                            <button 
                                onClick={() => router.push('/admin')}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <Globe size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">© 2026 YouthCamping luxury travel. All Rights Reserved.</p>
                        <div className="flex gap-6">
                            <Instagram size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                            <Globe size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
