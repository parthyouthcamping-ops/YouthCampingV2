"use client";

import { Trip } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
    Calendar, 
    CheckCircle2, 
    XCircle, 
    MapPin, 
    Users, 
    Star, 
    Clock, 
    ArrowRight 
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

interface TripDetailProps {
    trip: Trip;
}

export default function TripDetail({ trip }: TripDetailProps) {
    return (
        <div className="bg-white min-h-screen font-montserrat text-[#1a1a1a]">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image 
                        src={trip.images?.[0] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"}
                        alt={trip.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-white" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 className="text-white/80 text-sm font-black uppercase tracking-[0.4em] mb-4">
                            Premium Travel Experience
                        </h4>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-8">
                            {trip.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6">
                            <span className="h-[2px] w-12 bg-primary" />
                            <span className="text-white font-bold text-lg tracking-widest uppercase">
                                {trip.duration}
                            </span>
                            <span className="h-[2px] w-12 bg-primary" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="relative z-30 -mt-20 px-6 container mx-auto">
                <GlassCard className="p-10 rounded-[3rem] shadow-3xl bg-white border-none grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                            <Clock size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Duration</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{trip.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                            <Star size={28} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Price per person</p>
                            <p className="text-2xl font-black text-primary leading-none">₹{trip.price.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Booking ID</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{trip.id}</p>
                        </div>
                    </div>
                </GlassCard>
            </section>

            {/* Narrative */}
            <section className="py-32 container mx-auto px-6 max-w-4xl text-center">
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-8 uppercase">
                    Journey Overview
                </h3>
                <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                    {trip.description}
                </p>
            </section>

            {/* Inclusions & Exclusions Section */}
            <section id="details" className="py-32 bg-gray-50/50 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/2" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[120px] translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center mb-24 space-y-6">
                        <h2 className="text-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">The Fine Print</h2>
                        <h3 className="text-4xl md:text-7xl font-black tracking-tighter text-secondary uppercase leading-none">
                            Package Contents
                        </h3>
                        <div className="h-2 w-32 bg-primary rounded-full" />
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                        {/* ✅ INCLUSIONS CARD */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group hover:border-emerald-200 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />
                            
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                    <CheckCircle2 size={36} />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-secondary uppercase tracking-tight">✅ Inclusions</h4>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Everything We Provide</p>
                                </div>
                            </div>

                            <ul className="grid grid-cols-1 gap-6">
                                {trip.inclusions && trip.inclusions.length > 0 ? trip.inclusions.map((item, i) => (
                                    <motion.li 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-5 p-5 bg-emerald-50/20 rounded-2xl border border-emerald-50/50 hover:bg-emerald-50/40 hover:border-emerald-100 transition-all cursor-default"
                                    >
                                        <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-sm md:text-base font-bold text-gray-700 leading-relaxed uppercase tracking-tight italic">{item}</span>
                                    </motion.li>
                                )) : (
                                    <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-3xl">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No Inclusions Listed</p>
                                    </div>
                                )}
                            </ul>
                        </motion.div>

                        {/* ❌ EXCLUSIONS CARD */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-red-900/5 border border-red-50 relative overflow-hidden group hover:border-red-200 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 shadow-inner group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                                    <XCircle size={36} />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-secondary uppercase tracking-tight">❌ Exclusions</h4>
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Not Included In Package</p>
                                </div>
                            </div>

                            <ul className="grid grid-cols-1 gap-6">
                                {trip.exclusions && trip.exclusions.length > 0 ? trip.exclusions.map((item, i) => (
                                    <motion.li 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-5 p-5 bg-red-50/20 rounded-2xl border border-red-50/50 hover:bg-red-50/40 hover:border-red-100 transition-all cursor-default"
                                    >
                                        <div className="mt-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/20">
                                            <XCircle size={14} />
                                        </div>
                                        <span className="text-sm md:text-base font-bold text-gray-700 leading-relaxed uppercase tracking-tight italic">{item}</span>
                                    </motion.li>
                                )) : (
                                    <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-3xl">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                            <XCircle size={32} />
                                        </div>
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No Exclusions Listed</p>
                                    </div>
                                )}
                            </ul>
                        </motion.div>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </section>

            {/* Itinerary Accordion would go here (omitted for brevity but follows a similar pattern to QuoteClient) */}

            {/* Final CTA */}
            <section className="py-40 container mx-auto px-6 text-center">
                <div className="bg-[#0a192f] rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <Image src={trip.images?.[1] || trip.images?.[0]} fill className="object-cover" alt="" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
                            Ready to Experience {trip.title}?
                        </h2>
                        <p className="text-xl text-white/70 font-medium">
                            Book your dream destination with YouthCamping and create memories that last a lifetime.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                            <Button className="h-20 px-12 rounded-3xl bg-white text-gray-900 hover:bg-white/90 text-lg font-black uppercase tracking-widest shadow-2x shadow-white/20">
                                Book Now <ArrowRight size={24} className="ml-4" />
                            </Button>
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-white/50">
                                Starting at ₹{trip.price.toLocaleString()} / Person
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
