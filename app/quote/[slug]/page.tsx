"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getQuotationBySlug } from "@/lib/store";
import { Quotation } from "@/lib/types";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { motion, useScroll, useTransform } from "framer-motion";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Users,
    Calendar,
    MapPin,
    CheckCircle2,
    XCircle,
    Star,
    MessageCircle,
    Instagram,
    Globe,
    Phone,
    Sparkles,
    Share2,
    ArrowRight,
    Map,
    Compass,
    ShieldCheck,
    FileDown,
    MessageCircle as WhatsAppIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false,
    loading: () => <p className="text-[10px] font-black uppercase text-gray-400 animate-pulse">Initializing PDF Engine...</p>
});
import { QuotePDF } from "@/components/quote/QuotePDF";

export default function LuxuryView() {
    const { slug } = useParams();
    const [q, setQ] = useState<Quotation | null>(null);
    const { brand } = useBrandSettings();
    const [selectedTier, setSelectedTier] = useState<'standard' | 'luxury'>('standard');
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                const quoteData = await getQuotationBySlug(slug as string);
                setQ(quoteData || null);
            }
        };
        load();
    }, [slug]);

    if (!q) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-montserrat">
            <div className="text-center animate-pulse">
                <h1 className="text-4xl font-black text-primary italic">YouthCamping</h1>
                <p className="text-gray-400 font-semibold uppercase tracking-widest mt-4">One Trip at a Time</p>
            </div>
        </div>
    );

    const whatsappMessage = encodeURIComponent(
        `Hi YouthCamping! I'd like to book my trip to ${q.destination}.\n\n` +
        `Trip Details:\n` +
        `- Destination: ${q.destination}\n` +
        `- Dates: ${q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString() : 'TBA'}\n` +
        `- Pax: ${q.pax} Adults\n` +
        `- Selected Tier: ${selectedTier.toUpperCase()}\n` +
        `- Total Price: ₹${((selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice) * q.pax).toLocaleString()}\n\n` +
        `Quote Link: ${window.location.href}`
    );

    return (
        <div className="bg-white min-h-screen font-montserrat text-[#1a1a1a] selection:bg-primary/20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
                    <Image 
                        src={q.heroImage || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"}
                        alt={q.destination}
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
                </motion.div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-10"
                    >
                        <div className="space-y-4">
                            <h4 className="text-primary-light text-xs md:text-sm font-black uppercase tracking-[0.4em] drop-shadow-lg">
                                YOUR EXCLUSIVE TRAVEL PROPOSAL
                            </h4>
                            <h1 className="text-7xl md:text-[11rem] font-[900] text-white tracking-tight drop-shadow-2xl leading-[0.85] uppercase">
                                {q.destination}
                            </h1>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <span className="h-[2px] w-12 bg-primary" />
                                <span className="text-white font-semibold text-sm md:text-lg tracking-widest uppercase text-shadow">
                                    {q.duration} • {q.pax} ADULTS
                                </span>
                                <span className="h-[2px] w-12 bg-primary" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Down Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 cursor-pointer no-print"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Discover More</span>
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 16, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Traveler & Date Info Section */}
            <section className="relative z-30 -mt-24 px-6 container mx-auto">
                <GlassCard className="p-12 md:p-16 rounded-[4rem] shadow-3xl bg-white border-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ring-1 ring-gray-100">
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Traveller Name</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{q.clientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 lg:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Travel Dates</p>
                            <p className="text-lg font-black text-gray-900 leading-tight">
                                {q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "TBA"} - {q.travelDates?.to ? new Date(q.travelDates.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ""}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Sparkles size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Duration</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{q.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Star size={28} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Preferred Investment</p>
                            <p className="text-xl font-black text-primary leading-none">
                                ₹{(selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </section>

            {/* Package Overview */}
            <section className="py-40 container mx-auto px-6">
                <div className="flex flex-col gap-20">
                    <div className="space-y-6 text-center max-w-4xl mx-auto">
                        <h2 className="text-primary font-black uppercase tracking-[0.5em] text-xs">Exclusively Curated</h2>
                        <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.85]">
                            The Experience
                        </h3>
                        <p className="text-xl text-gray-500 font-medium italic mt-8 leading-relaxed">
                            Every mile, every view, and every stay has been handpicked to align with your personal definition of adventure and comfort.
                        </p>
                    </div>

                    <div className="relative w-full group">
                        <div className="absolute -inset-10 bg-primary/5 rounded-[5rem] blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-1000" />
                        {q.experiencePhotos && q.experiencePhotos.length > 0 ? (
                            <ImageSlider images={q.experiencePhotos} aspectRatio="video" className="w-full rounded-[4rem] shadow-3xl border-8 border-white" />
                        ) : (
                            <div className="relative aspect-video w-full rounded-[4rem] overflow-hidden shadow-3xl border-8 border-white">
                                <Image
                                    src={q.coverImage || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"}
                                    alt="Experience Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Trust Signal: How It Works */}
            <section className="py-32 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">The YouthCamping Method</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Our Precision Curation</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Compass, title: "1. Consultation", desc: "We understood your goals for this trip to ensure every highlight is meaningful." },
                            { icon: Map, title: "2. Bespoke Curation", desc: "Our team analyzed dozens of routes to select the most picturesque and seamless path." },
                            { icon: CheckCircle2, title: "3. Elite Execution", desc: "Once booked, our ground partners ensure your itinerary is executed with zero friction." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl flex flex-col items-center text-center">
                                <div className="bg-primary/5 w-20 h-20 rounded-3xl flex items-center justify-center text-primary mb-8">
                                    <step.icon size={36} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed italic">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Itinerary */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-32 space-y-4">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-gray-900 uppercase">Your Daily Story</h2>
                        <div className="h-2 w-24 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="flex flex-col relative gap-40">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 -translate-x-1/2 hidden lg:block" />

                        {q.itinerary?.map((day, idx) => (
                            <motion.div
                                key={day.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`flex flex-col lg:flex-row gap-20 lg:gap-32 items-center relative ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-2xl z-10 hidden lg:block" />

                                <div className="flex-1 space-y-12">
                                    <div className={`flex flex-col ${idx % 2 !== 0 ? 'lg:items-end lg:text-right' : 'lg:items-start'} gap-6`}>
                                        <div className="flex items-center gap-6">
                                            <span className="w-20 h-20 rounded-[2rem] bg-gray-900 text-white flex items-center justify-center text-2xl font-black italic shadow-2xl">
                                                0{day.day}
                                            </span>
                                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">{day.title}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <p className={`text-xl text-gray-500 font-medium leading-relaxed italic ${idx % 2 !== 0 ? 'lg:text-right' : ''}`}>
                                            {day.description}
                                        </p>

                                        <div className="space-y-12 flex flex-col">
                                            <div className="space-y-6 w-full">
                                                <div className={`flex items-center gap-4 ${idx % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                                                    <div className="h-px bg-primary/20 flex-1" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Curated Highlights</span>
                                                </div>
                                                <ul className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 ${idx % 2 !== 0 ? 'lg:justify-items-end' : ''}`}>
                                                    {day.activities?.map((act, i) => (
                                                        act && (
                                                            <li key={i} className={`flex items-start gap-4 group text-gray-800 ${idx % 2 !== 0 ? 'lg:flex-row-reverse text-right' : ''}`}>
                                                                <CheckCircle2 size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                                <span className="text-base font-bold transition-colors">{act}</span>
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full relative">
                                    <div className="absolute -inset-6 bg-primary/5 rounded-[4rem] blur-3xl -z-10 opacity-60" />
                                    <ImageSlider images={day.photos} className="shadow-3xl rounded-[3.5rem] overflow-hidden border-8 border-white" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Card Section */}
            <section id="pricing" className="py-40 bg-[#0a192f] text-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 items-stretch">
                        <div className="flex-1 space-y-16">
                            <div className="space-y-6">
                                <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs">Investment in Memories</h2>
                                <h3 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                                    Elite <br />Value
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8 bg-white/5 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-xl">
                                    <div className="flex items-center gap-4 text-primary">
                                        <CheckCircle2 size={28} />
                                        <h4 className="text-xl font-black uppercase tracking-widest text-white">Elite Inclusions</h4>
                                    </div>
                                    <ul className="space-y-6">
                                        {q.includes?.slice(0, 6).map((inc, i) => (
                                            <li key={i} className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {inc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-10 flex flex-col justify-center">
                                    <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 no-print">
                                        <button
                                            onClick={() => setSelectedTier('standard')}
                                            className={`flex-1 px-8 py-5 rounded-[1.5rem] flex flex-col items-center transition-all ${selectedTier === 'standard' ? 'bg-primary text-white shadow-2xl' : 'text-gray-400'}`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Option 1</span>
                                            <span className="text-xs font-bold mt-1">₹{q.lowLevelPrice.toLocaleString()}</span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedTier('luxury')}
                                            className={`flex-1 px-8 py-5 rounded-[1.5rem] flex flex-col items-center transition-all ${selectedTier === 'luxury' ? 'bg-primary text-white shadow-2xl' : 'text-gray-400'}`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Option 2</span>
                                            <span className="text-xs font-bold mt-1">₹{q.highLevelPrice.toLocaleString()}</span>
                                        </button>
                                    </div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Pricing Validity</p>
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Your price is locked for the next 72 hours only.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[450px] bg-white text-gray-900 rounded-[4rem] p-16 flex flex-col items-center justify-center text-center shadow-3xl overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-12 italic">Total Trip Value</h4>

                            <div className="space-y-4 mb-20">
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Per Traveler</p>
                                <p className="text-7xl font-black tracking-tighter text-gray-900">
                                    ₹{(selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice).toLocaleString()}
                                </p>
                            </div>

                            <div className="w-full h-px bg-gray-100 mb-20" />

                            <div className="space-y-4 w-full mb-20">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Full Group Package</p>
                                <p className="text-4xl font-black tracking-tight text-primary">
                                    ₹{((selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice) * q.pax).toLocaleString()}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.pax} Premium Slots</p>
                            </div>

                            <Button
                                onClick={() => window.open(`https://wa.me/${q.expert.whatsapp}?text=${whatsappMessage}`, '_blank')}
                                className="w-full py-10 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 mb-4"
                            >
                                <WhatsAppIcon className="mr-3" size={24} />
                                Book This Trip
                            </Button>

                            <div className="w-full no-print">
                                <PDFDownloadLink 
                                    document={<QuotePDF q={q} selectedTier={selectedTier} />} 
                                    fileName={`YouthCamping_Quote_${q.destination.replace(/\s/g, '_')}.pdf`}
                                >
                                    {({ loading }) => (
                                        <Button
                                            variant="outline"
                                            disabled={loading}
                                            className="w-full py-8 border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                                        >
                                            <FileDown size={18} />
                                            {loading ? 'Generating...' : 'Download PDF Quote'}
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expert Personal Touch */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center gap-16 bg-gray-50 p-16 rounded-[4rem] border border-gray-100 relative">
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                            <MessageCircle size={44} />
                        </div>

                        <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl flex-shrink-0">
                            <Image
                                src={q.expert.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(q.expert.name || 'Expert')}&background=random`}
                                alt={q.expert.name || "Expert"}
                                width={160}
                                height={160}
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tight">{q.expert.name}</h4>
                                <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-1 italic">{q.expert.designation || "Luxury Curator"}</p>
                            </div>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8">
                                &quot;Designing journeys for travelers like you is a privilege. I've ensured this proposal reflects the high-end standards you deserve.&quot;
                            </p>
                            <Button
                                onClick={() => window.open(`https://wa.me/${q.expert.whatsapp}?text=${whatsappMessage}`, '_blank')}
                                className="bg-[#0a192f] hover:bg-black text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl"
                            >
                                Chat with {q.expert.name.split(' ')[0]}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Trust CTA */}
            <section className="py-20 bg-gray-50/50 text-center border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">YouthCamping Private Access</p>
                <div className="flex items-center justify-center gap-4 text-gray-400">
                    <ShieldCheck size={16} />
                    <span className="font-bold text-[10px] uppercase tracking-widest">End-to-End Secure Travel Curation</span>
                </div>
            </section>
        </div>
    );
}
