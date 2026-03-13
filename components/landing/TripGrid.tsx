"use client";

import { LandingPackage } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TripGrid({ packages }: { packages: LandingPackage[] }) {
    if (!packages.length) return null;

    return (
        <section className="py-40 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-24">
                    <h2 className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-6">Explore the Extraordinary</h2>
                    <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter leading-none">
                        CURATED DESTINATIONS
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {packages.map((dest, i) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
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
                                <p className="text-lg font-bold text-white/80">{dest.price} / {dest.duration}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
