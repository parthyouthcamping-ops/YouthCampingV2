"use client";

import { useState } from "react";
import Image from "next/image";
import { Quotation, BrandSettings } from "@/lib/types";
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
    Sparkles,
    Share2,
    ArrowRight,
    Map,
    Compass,
    ShieldCheck,
    FileDown,
    MessageCircle,
    Instagram,
    Globe,
    Phone,
    ChevronDown,
    ChevronUp,
    Hotel,
    MessageCircle as WhatsAppIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportSection } from "@/components/quote/TransportSection";

function AccordionDay({ day, isOpen, toggle }: { day: any; isOpen: boolean; toggle: () => void }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all cursor-pointer hover:border-primary/30" onClick={toggle}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <span className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
                        D{day.day}
                    </span>
                    <div className="flex-1 pr-6">
                        <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                        {!isOpen && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{day.description}</p>}
                    </div>
                </div>
                <div className="text-primary bg-primary/5 p-2 rounded-full">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            
            {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-8 mt-6 border-t border-gray-100 space-y-8">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {day.description}
                    </p>
                    {day.activities && day.activities.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.activities.map((act: string, i: number) => act && (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-primary mt-0.5" />
                                    <span className="text-sm font-semibold text-gray-700">{act}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {day.photos && day.photos.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                            {day.photos.map((photo: string, i: number) => (
                                <div key={i} className="w-72 aspect-video flex-shrink-0 snap-center rounded-2xl overflow-hidden relative">
                                    <Image src={photo} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}

interface QuoteClientProps {
    q: Quotation;
    brand: BrandSettings | null;
    slug: string;
}

export default function QuoteClient({ q, brand, slug }: QuoteClientProps) {
    const [selectedTier, setSelectedTier] = useState<'standard' | 'luxury'>('standard');
    const [openDayId, setOpenDayId] = useState<string | null>(q.itinerary?.[0]?.id || null);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    const quoteUrl = typeof window !== 'undefined' ? window.location.href : "";

    const whatsappMessage = encodeURIComponent(
        `Hi YouthCamping! I'd like to book my trip to ${q.destination}.\n\n` +
        `Trip Details:\n` +
        `- Destination: ${q.destination}\n` +
        `- Dates: ${q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString() : 'TBA'}\n` +
        `- Pax: ${q.pax} Adults\n` +
        `- Selected Tier: ${selectedTier.toUpperCase()}\n` +
        `- Total Price: ₹${((selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice) * q.pax).toLocaleString()}\n\n` +
        `Quote Link: ${quoteUrl}`
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
            </section>

            {/* Traveler & Date Info Section */}
            <section className="relative z-30 -mt-24 px-6 container mx-auto">
                <GlassCard className="p-12 md:p-16 rounded-[4rem] shadow-3xl bg-white border-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ring-1 ring-gray-100">
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Prepared For</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{q.clientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 lg:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Travel Dates</p>
                            <p className="text-sm font-black text-gray-900 leading-tight">
                                {q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString('en-GB') : "TBA"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-r border-gray-100 pr-6 last:border-0 last:pr-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Travelers</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{q.pax} Adults</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-[1.4rem] flex items-center justify-center text-primary flex-shrink-0">
                            <Star size={28} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Starting Price</p>
                            <p className="text-xl font-black text-primary leading-none">
                                ₹{q.lowLevelPrice.toLocaleString()} <span className="text-xs text-gray-500 font-semibold">/ pax</span>
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


            {/* Transport Details Section */}
            {q.transport && q.transport.type && (
                <TransportSection transport={q.transport} />
            )}

            {/* Itinerary */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-32 space-y-4">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-gray-900 uppercase">Your Daily Story</h2>
                        <div className="h-2 w-24 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="max-w-4xl mx-auto flex flex-col gap-6">
                        {q.itinerary?.map((day) => (
                            <AccordionDay
                                key={day.id}
                                day={day}
                                isOpen={openDayId === day.id}
                                toggle={() => setOpenDayId(openDayId === day.id ? null : day.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Hotel Section */}
            {((selectedTier === 'standard' && (q.lowLevelHotels?.length > 0 || q.hotels?.length > 0)) || 
              (selectedTier === 'luxury' && (q.highLevelHotels?.length > 0 || q.hotels?.length > 0))) && (
                <section className="py-24 bg-white relative z-10">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs">Where You'll Stay</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase">Accommodations</h3>
                            <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-6" />
                        </div>
                        
                        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
                            {(selectedTier === 'standard' ? (q.lowLevelHotels?.length > 0 ? q.lowLevelHotels : q.hotels) : (q.highLevelHotels?.length > 0 ? q.highLevelHotels : q.hotels))?.map((hotel, i) => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-8 items-center group hover:border-primary/20 transition-all">
                                    <div className="w-full md:w-80 aspect-video rounded-3xl overflow-hidden relative flex-shrink-0 border-4 border-gray-50">
                                        <Image src={hotel.photos?.[0] || "https://images.unsplash.com/photo-1542314831-c6a4d27d6682?q=80&w=2000&auto=format&fit=crop"} fill alt={hotel.name} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 space-y-5 w-full text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-1 text-primary">
                                            {Array(hotel.rating || 4).fill(0).map((_, i) => <Star key={`star-${i}`} size={16} fill="currentColor" />)}
                                        </div>
                                        <h4 className="text-3xl font-black text-gray-900 tracking-tight">{hotel.name}</h4>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-xl"><MapPin size={14} className="text-primary" /> {hotel.location}</span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-xl"><Hotel size={14} className="text-primary" /> {hotel.roomType}</span>
                                        </div>
                                        {hotel.description && <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed max-w-2xl font-medium">{hotel.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Inclusions & Exclusions Section */}
            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs">The Details</h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary uppercase">Included & Excluded</h3>
                    </div>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
                        {/* Inclusions */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col gap-8">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h4 className="text-2xl font-black text-secondary tracking-tight uppercase">Included</h4>
                            </div>
                            <ul className="space-y-4">
                                {q.includes?.map((inc, i) => (
                                    <li key={`inc-${i}`} className="flex items-start gap-4">
                                        <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-bold text-gray-600 leading-relaxed">{inc}</span>
                                    </li>
                                ))}
                                {(!q.includes || q.includes.length === 0) && (
                                    <p className="text-sm font-bold text-gray-400 italic">No inclusions specified.</p>
                                )}
                            </ul>
                        </div>

                        {/* Exclusions */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col gap-8">
                            <div className="flex items-center gap-4 text-red-500">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <XCircle size={28} />
                                </div>
                                <h4 className="text-2xl font-black text-secondary tracking-tight uppercase">Excluded</h4>
                            </div>
                            <ul className="space-y-4">
                                {q.exclusions?.map((exc, i) => (
                                    <li key={`exc-${i}`} className="flex items-start gap-4">
                                        <XCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-bold text-gray-600 leading-relaxed">{exc}</span>
                                    </li>
                                ))}
                                {(!q.exclusions || q.exclusions.length === 0) && (
                                    <p className="text-sm font-bold text-gray-400 italic">No exclusions specified.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Price Summary Section */}
            <section id="pricing" className="py-32 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs">Final Step</h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary uppercase">Price Summary</h3>
                    </div>

                    <div className="max-w-xl mx-auto">
                        <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group hover:border-primary/20 transition-all">
                            <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
                            
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Starting Price</h4>
                            <div className="flex items-end justify-center gap-3 mb-10">
                                <span className="text-6xl md:text-7xl font-black tracking-tighter text-gray-900">₹{q.lowLevelPrice.toLocaleString()}</span>
                                <span className="text-lg font-bold text-gray-500 mb-2 border-l-2 border-gray-200 pl-3 leading-tight flex flex-col text-left">
                                    <span>per</span>
                                    <span>adult</span>
                                </span>
                            </div>

                            <div className="w-full h-px bg-gray-100 mb-10" />

                            <div className="space-y-4 w-full mb-12">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Select Your Package</p>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded-[2.5rem]">
                                    <button
                                        onClick={() => setSelectedTier('standard')}
                                        className={`py-5 rounded-[2rem] flex flex-col items-center transition-all ${selectedTier === 'standard' ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-100' : 'text-gray-500 hover:bg-white/50'}`}
                                    >
                                        <span className="text-[10px] uppercase tracking-widest font-black">Standard</span>
                                        <span className="text-sm font-bold mt-1">₹{q.lowLevelPrice.toLocaleString()}</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTier('luxury')}
                                        className={`py-5 rounded-[2rem] flex flex-col items-center transition-all ${selectedTier === 'luxury' ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-100' : 'text-gray-500 hover:bg-white/50'}`}
                                    >
                                        <span className="text-[10px] uppercase tracking-widest font-black">Luxury</span>
                                        <span className="text-sm font-bold mt-1">₹{q.highLevelPrice.toLocaleString()}</span>
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={() => window.open(`https://wa.me/${q.expert.whatsapp}?text=${whatsappMessage}`, '_blank')}
                                className="w-full py-8 text-sm md:text-lg bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-[#25D366]/20 transition-all hover:scale-[1.02] mb-6"
                            >
                                <WhatsAppIcon className="mr-3" size={24} />
                                Book This Trip
                            </Button>

                            {/* PDF Download removed */}
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

        </div>
    );
}
