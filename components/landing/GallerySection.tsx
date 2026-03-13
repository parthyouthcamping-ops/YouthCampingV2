"use client";

import { LandingGalleryItem } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GallerySection({ images }: { images: LandingGalleryItem[] }) {
    if (!images.length) return null;

    return (
        <section id="gallery" className="py-40 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-24">
                    <h2 className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-6">Visual Journeys</h2>
                    <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter leading-none uppercase">
                        Our Gallery
                    </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {images.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="relative aspect-square rounded-3xl overflow-hidden shadow-xl"
                        >
                            {item.type === 'image' ? (
                                <Image src={item.url} fill alt="Gallery Image" className="object-cover" />
                            ) : (
                                <video src={item.url} autoPlay muted loop className="w-full h-full object-cover" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
