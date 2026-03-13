"use client";

import { LandingTestimonial } from "@/lib/types";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewsSection({ testimonials }: { testimonials: LandingTestimonial[] }) {
    if (!testimonials.length) return null;

    return (
        <section id="testimonials" className="py-40 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-20 text-center">
                    <div className="flex gap-2 text-primary mb-8">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} fill="currentColor" size={24} />)}
                    </div>
                    <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 uppercase tracking-tighter">
                        Client Experiences
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-4 border-white shadow-xl relative">
                                <Image src={t.photo} fill alt={t.name} className="object-cover" />
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
    );
}
