"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Search,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Users,
    MapPin,
    Star,
    ArrowRight,
    Map,
    Compass,
    CheckCircle2,
    Calendar,
    Instagram,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useBrandSettings } from "@/hooks/useBrandSettings";
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
        <main className="flex min-h-screen flex-col bg-white font-montserrat text-gray-900 overflow-x-hidden">
            {/* Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TravelAgency",
                        "name": "YouthCamping",
                        "url": "https://quote.youthcamping.in",
                        "logo": brand?.companyLogo || "https://quote.youthcamping.in/logo.png",
                        "description": "Premium luxury travel curators offering curated destinations and elite experiences.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "IN"
                        },
                        "sameAs": [
                            brand?.instagramLink || "https://instagram.com/youthcamping",
                            brand?.websiteLink || "https://youthcamping.in"
                        ]
                    })
                }}
            />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
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
                        className="flex flex-col items-center gap-8"
                    >
                        {brand?.companyLogo ? (
                            <Image src={brand.companyLogo} width={200} height={100} className="h-24 w-auto object-contain brightness-0 invert" alt="Company Logo" />
                        ) : (
                            <h1 className="text-6xl font-black tracking-tighter uppercase italic">
                                YouthCamping
                            </h1>
                        )}

                        <div className="space-y-4 max-w-4xl">
                            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tight leading-[0.85] mb-6">
                                Luxury Travel <br /><span className="text-primary italic">Personified</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-medium text-white/80 uppercase tracking-[0.3em]">
                                One Trip at a Time
                            </p>
                        </div>

                        {/* View Quotation Search with Overhauled UX */}
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
                                        Display My Trip
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stat Bar */}
            <section id="destinations" className="bg-[#0a192f] py-16 border-y border-white/5">
                <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { label: "Trips Planned", value: "500+" },
                        { label: "Elite Members", value: "1,200+" },
                        { label: "Global Presence", value: "24/7" },
                        { label: "Curated Tiers", value: "2" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group border-r border-white/5 last:border-0 border-opacity-50">
                            <div className="text-4xl md:text-6xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Destination Grid */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <h2 className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-6">Explore the Extraordinary</h2>
                        <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter leading-none">
                            CURATED DESTINATIONS
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { name: "Bali, Indonesia", price: "₹85,000", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop" },
                            { name: "Reykjavik, Iceland", price: "₹2,45,000", image: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=2069&auto=format&fit=crop" },
                            { name: "Maasai Mara, Kenya", price: "₹1,95,000", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop" },
                            { name: "Amalfi Coast, Italy", price: "₹3,15,000", image: "https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Kyoto, Japan", price: "₹2,10,000", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Santorini, Greece", price: "₹2,75,000", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2012&auto=format&fit=crop" }
                        ].map((dest, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl"
                            >
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-primary">Starting From</p>
                                    <h4 className="text-3xl font-black mb-1">{dest.name}</h4>
                                    <p className="text-lg font-bold text-white/80">{dest.price} / Person</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - How It Works */}
            <section id="how-it-works" className="py-40 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <h2 className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-6">The Journey to Perfection</h2>
                        <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter leading-none uppercase">
                            Your Path to Luxury
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        {[
                            {
                                icon: Compass,
                                title: "Consultation",
                                desc: "Connect with our elite curators to discuss your high-end travel goals."
                            },
                            {
                                icon: Map,
                                title: "Curation",
                                desc: "Receive a bespoke, itemized quotation tailored to your exact desires."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Discovery",
                                desc: "Approve your proposal and set off on a journey of a lifetime."
                            }
                        ].map((step, i) => (
                            <div key={i} className="group relative">
                                <div className="bg-white p-14 rounded-[3.5rem] shadow-xl hover:shadow-2xl transition-all duration-700 h-full border border-gray-100 flex flex-col items-center text-center">
                                    <div className="bg-primary/5 w-24 h-24 rounded-3xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-700 transform group-hover:rotate-12">
                                        <step.icon size={44} />
                                    </div>
                                    <h4 className="text-3xl font-black text-gray-900 mb-6">{step.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed italic">{step.desc}</p>
                                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-2xl border-4 border-white">
                                        0{i + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center mb-20">
                        <div className="flex gap-2 text-primary mb-8">
                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} fill="currentColor" size={24} />)}
                        </div>
                        <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 text-center uppercase tracking-tighter">
                            Client Experiences
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                name: "Arjun Mehta",
                                trip: "Bali Private Charter",
                                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
                                quote: "The most professional travel planning I've experienced. Every detail was perfect."
                            },
                            {
                                name: "Sara Khan",
                                trip: "Iceland Glacial Tour",
                                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
                                quote: "Exclusive access to locations we couldn't find anywhere else. Simply outstanding."
                            },
                            {
                                name: "Vivek Roy",
                                trip: "African Safari Suite",
                                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
                                quote: "From first quote to last day, the service was ultra-bespoke and seamless."
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-4 border-white shadow-xl">
                                    <Image src={t.photo} width={96} height={96} alt={t.name} className="object-cover" />
                                </div>
                                <div className="flex gap-1 text-primary mb-6">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} fill="currentColor" size={16} />)}
                                </div>
                                <p className="text-xl font-bold text-gray-800 leading-relaxed mb-10 italic">"{t.quote}"</p>
                                <div>
                                    <div className="font-black text-gray-900 uppercase tracking-widest text-xs">{t.name}</div>
                                    <div className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">{t.trip}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Overhaul */}
            <footer className="bg-[#0a192f] pt-32 pb-16 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 pb-20 border-b border-white/5">
                        <div className="col-span-1 lg:col-span-2 space-y-8">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">YouthCamping</h2>
                            <p className="text-gray-400 font-medium text-lg max-w-md leading-relaxed">
                                We curate travel for high-achievers. One trip at a time, we redefine what it means to explore the world in luxury.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-[0.4em] text-xs text-primary mb-8">Resources</h4>
                            <div className="flex flex-col gap-4 font-bold text-gray-400">
                                <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                                <Link href="/#destinations" className="hover:text-white transition-colors">Destinations</Link>
                                <Link href="/#testimonials" className="hover:text-white transition-colors">Experiences</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-[0.4em] text-xs text-primary mb-8">Access</h4>
                            <div className="flex flex-col gap-4 font-bold text-gray-400">
                                <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
                                <Link href="/#quote-lookup" className="hover:text-white transition-colors">View My Trip</Link>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">
                            © 2026 YouthCamping Private Limited. All Rights Reserved.
                        </p>
                        <div className="flex gap-10">
                            <Instagram size={20} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                            <Globe size={20} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}

function Link({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
}
