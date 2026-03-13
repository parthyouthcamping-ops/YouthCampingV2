"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LandingHero } from "@/lib/types";

export default function HeroSection({ data, logo }: { data: LandingHero, logo?: string }) {
    const [slug, setSlug] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (slug.trim()) {
            router.push(`/quote/${slug.trim()}`);
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.backgroundImage}
                    alt="Adventure Hero"
                    fill
                    priority
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex flex-col items-center gap-8"
                >
                    {logo ? (
                        <Image src={logo} width={200} height={100} className="h-24 w-auto object-contain brightness-0 invert" alt="Company Logo" />
                    ) : (
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic">
                            YouthCamping
                        </h1>
                    )}

                    <div className="space-y-4 max-w-4xl">
                        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tight leading-[0.85] mb-6">
                            {data.title.split(data.highlight || "").map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && <span className="text-primary italic">{data.highlight}</span>}
                                </span>
                            ))}
                        </h2>
                        <p className="text-xl md:text-2xl font-medium text-white/80 uppercase tracking-[0.3em]">
                            {data.subtitle}
                        </p>
                    </div>

                    <div id="quote-lookup" className="w-full max-w-2xl mt-16 bg-white/10 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 shadow-2xl">
                        <form onSubmit={handleSearch} className="flex flex-col gap-6">
                            <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary">
                                    <Search size={28} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Unique Quote ID (e.g. bali-luxury-trip)"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    pattern="^[a-z0-9-]{5,100}$"
                                    required
                                    className="w-full pl-20 pr-8 py-8 bg-white/10 border-2 border-white/20 rounded-3xl text-white placeholder:text-white/50 font-bold focus:bg-white focus:text-gray-900 focus:border-white transition-all outline-none text-lg"
                                />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-xs font-black text-white/80 uppercase tracking-widest">
                                        Private Access Required
                                    </p>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                        Pattern: alphanumeric and dashes only
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full md:w-auto px-12 py-10 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl"
                                >
                                    {data.ctaText}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
