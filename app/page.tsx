import { MapPin, Search, Star, Compass, Map, CheckCircle2, Instagram, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { LandingContent } from "@/lib/types";
import HeroSection from "@/components/landing/HeroSection";
import TripGrid from "@/components/landing/TripGrid";
import AboutSection from "@/components/landing/AboutSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import GallerySection from "@/components/landing/GallerySection";

export const revalidate = 3600; // ISR 1 hour

async function getLandingData() {
    const sections = await db.getAllLandingSections();
    const brand = await db.get("global_brand");
    return { sections, brand };
}

export default async function Home() {
    const { sections, brand } = await getLandingData();
    const hero = sections.hero || { title: "Luxury Travel Personified", subtitle: "One Trip at a Time", backgroundImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", ctaText: "Display My Trip" };
    const about = sections.about || { title: "CURATED FOR HIGH ACHIEVERS", content: "We curate travel for those who demand the extraordinary. Every itinerary is a masterpiece of logistics and luxury.", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop" };

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
                        "url": "https://youthcamping.in",
                        "logo": brand?.companyLogo || "https://youthcamping.in/logo.png",
                        "description": "Premium luxury travel curators offering curated destinations and elite experiences.",
                        "sameAs": [
                            brand?.instagramLink || "https://instagram.com/youthcamping",
                            brand?.websiteLink || "https://youthcamping.in"
                        ]
                    })
                }}
            />

            <HeroSection data={hero} logo={brand?.companyLogo} />

            {/* Stat Bar (Static for now as per design) */}
            <section id="destinations" className="bg-[#0a192f] py-16 border-y border-white/5">
                <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { label: "Trips Planned", value: "500+" },
                        { label: "Elite Members", value: "1,200+" },
                        { label: "Global Presence", value: "24/7" },
                        { label: "Curated Tiers", value: "2" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group border-r border-white/5 last:border-0 border-opacity-50">
                            <div className="text-4xl md:text-6xl font-black text-white mb-3 group-hover:text-primary transition-colors hover:scale-105 transform transition-all">
                                {stat.value}
                            </div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <TripGrid packages={sections.packages || []} />
            <AboutSection data={about} />
            <ReviewsSection testimonials={sections.testimonials || []} />
            <GallerySection images={sections.gallery || []} />

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
                                <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                                <a href="/#destinations" className="hover:text-white transition-colors">Destinations</a>
                                <a href="/#testimonials" className="hover:text-white transition-colors">Experiences</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-[0.4em] text-xs text-primary mb-8">Access</h4>
                            <div className="flex flex-col gap-4 font-bold text-gray-400">
                                <a href="/login" className="hover:text-white transition-colors">Admin Login</a>
                                <a href="/#quote-lookup" className="hover:text-white transition-colors">View My Trip</a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">
                            {brand?.footerText || "© 2026 YouthCamping Private Limited. All Rights Reserved."}
                        </p>
                        <div className="flex gap-10">
                            {brand?.instagramLink && <a href={brand.instagramLink} target="_blank" rel="noopener noreferrer"><Instagram size={20} className="text-gray-500 hover:text-white transition-colors cursor-pointer" /></a>}
                            {brand?.websiteLink && <a href={brand.websiteLink} target="_blank" rel="noopener noreferrer"><Globe size={20} className="text-gray-500 hover:text-white transition-colors cursor-pointer" /></a>}
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
