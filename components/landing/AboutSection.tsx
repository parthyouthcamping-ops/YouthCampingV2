"use client";

import { LandingAbout } from "@/lib/types";
import { Compass, Map, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AboutSection({ data }: { data: LandingAbout }) {
    return (
        <>
            <section id="about" className="py-40 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                            <Image src={data.image} alt="About Luxury Travel" fill className="object-cover" />
                        </div>
                        <div className="space-y-10">
                            <h2 className="text-primary font-black uppercase tracking-[0.5em] text-sm">Our Philosophy</h2>
                            <h3 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter leading-none uppercase">
                                {data.title}
                            </h3>
                            <p className="text-2xl text-gray-500 font-medium leading-relaxed italic border-l-8 border-primary/20 pl-8">
                                {data.content}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (Child of About in design logic) */}
            <section id="how-it-works" className="py-40 bg-white">
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
        </>
    );
}
