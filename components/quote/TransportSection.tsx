"use client";

import { TransportData, FlightDetails, TrainDetails } from "@/lib/types";
import { Plane, Train, Clock, Briefcase, Luggage, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TransportSectionProps {
    transport: TransportData;
}

const FlightCard = ({ title, details }: { title: string, details: FlightDetails }) => {
    if (!details) return null;

    return (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-3xl border border-gray-100 flex flex-col gap-10 hover:shadow-primary/5 transition-all group">
            {/* Header: Airline Style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Plane size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">{title}</p>
                        <h4 className="text-3xl font-black text-secondary leading-tight tracking-tight uppercase">
                            {details.airlineName || "Airline Info Missing"}
                        </h4>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:flex gap-10">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Flight Number</p>
                        <p className="text-xl font-black text-secondary uppercase tracking-tight">{details.flightNumber || "N/A"}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Departure Date</p>
                        <p className="text-xl font-black text-secondary uppercase tracking-tight">
                            {details.departureDate ? new Date(details.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Segments: Timeline Visualization */}
            <div className="flex flex-col gap-10">
                {!details.segments || details.segments.length === 0 ? (
                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest py-8">Route details not available</p>
                ) : (
                    details.segments.map((segment, idx) => (
                        <div key={idx} className="space-y-10 group/segment">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative px-4 md:px-0">
                                {/* Desktop Timeline Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -translate-y-1/2 hidden md:block" />
                                
                                {/* Mobile Timeline Line */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-100 -translate-x-1/2 md:hidden" />

                                {/* Departure City */}
                                <div className="flex flex-col items-center md:items-start text-center md:text-left basis-[40%] z-10 bg-white md:bg-transparent pb-4 md:pb-0">
                                    <h5 className="text-2xl md:text-4xl font-black text-secondary mb-1">
                                        {segment.from.city || "Departure City"}
                                    </h5>
                                    <p className="text-sm md:text-xl font-bold text-primary tracking-tight">
                                        {segment.from.time || "Time N/A"}
                                    </p>
                                </div>

                                {/* Icon Center */}
                                <div className="z-10 bg-white p-2">
                                    <div className="w-16 h-16 md:w-14 md:h-14 bg-secondary text-white rounded-full flex items-center justify-center border-8 border-white shadow-xl transform transition-transform group-hover/segment:rotate-45">
                                        <Plane size={24} className="rotate-90 md:rotate-0" />
                                    </div>
                                </div>

                                {/* Arrival City */}
                                <div className="flex flex-col items-center md:items-end text-center md:text-right basis-[40%] z-10 bg-white md:bg-transparent pt-4 md:pt-0">
                                    <h5 className="text-2xl md:text-4xl font-black text-secondary mb-1">
                                        {segment.to.city || "Arrival City"}
                                    </h5>
                                    <div className="flex flex-col md:items-end">
                                        <p className="text-sm md:text-xl font-bold text-primary tracking-tight">
                                            {segment.to.time || "Time N/A"}
                                            {segment.to.isNextDay && <span className="text-[10px] align-top ml-1 text-primary-deep font-black uppercase tracking-tighter">(+1 Day)</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Layover Highlight: Orange Styling */}
                            {segment.layoverAfter && (
                                <div className="flex items-center justify-center py-4">
                                    <div className="bg-[#D4541A]/10 border border-[#D4541A]/20 rounded-2xl px-10 py-4 flex items-center gap-4 shadow-sm animate-pulse-slow">
                                        <Clock size={18} className="text-[#D4541A]" />
                                        <span className="text-xs font-black text-[#D4541A] uppercase tracking-[0.2em]">
                                            {segment.layoverAfter} Layover
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Baggage Bar: Premium Rounded Design */}
            {details.baggage && (details.baggage.cabin || details.baggage.checkIn) && (
                <div className="bg-gray-50 rounded-[2rem] p-6 flex flex-wrap items-center justify-center gap-10 md:gap-20 mt-4 border border-gray-100">
                    {details.baggage.cabin && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Cabin Bag</p>
                                <p className="text-sm font-black text-secondary uppercase">{details.baggage.cabin}</p>
                            </div>
                        </div>
                    )}
                    {details.baggage.checkIn && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                                <Luggage size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Check-in Bag</p>
                                <p className="text-sm font-black text-secondary uppercase">{details.baggage.checkIn}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TrainCard = ({ details }: { details: TrainDetails }) => {
    if (!details) return null;

    return (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-3xl border border-gray-100 flex flex-col gap-10 hover:shadow-primary/5 transition-all group">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Train size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Train Journey</p>
                        <h4 className="text-3xl font-black text-secondary leading-tight tracking-tight uppercase">
                            {details.trainName || "Train Name Missing"}
                        </h4>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:flex gap-10">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Train Number</p>
                        <p className="text-xl font-black text-secondary uppercase tracking-tight">{details.trainNumber || "N/A"}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Coach Class</p>
                        <p className="text-xl font-black text-secondary uppercase tracking-tight">{details.coachClass || "Standard"}</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative px-4 md:px-0 py-4">
                {/* Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -translate-y-1/2 hidden md:block" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-100 -translate-x-1/2 md:hidden" />

                <div className="flex flex-col items-center md:items-start text-center md:text-left basis-[40%] z-10 bg-white md:bg-transparent pb-4 md:pb-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 md:mb-1">
                        {details.departureDate ? new Date(details.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "TBA"}
                    </p>
                    <h5 className="text-2xl md:text-4xl font-black text-secondary mb-1">
                        {details.from.city || "Origin"}
                    </h5>
                    <p className="text-sm md:text-xl font-bold text-primary">
                        {details.from.time || "N/A"}
                    </p>
                </div>

                <div className="z-10 bg-white p-2">
                    <div className="w-16 h-16 md:w-14 md:h-14 bg-secondary text-white rounded-full flex items-center justify-center border-8 border-white shadow-xl">
                        <Train size={24} />
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right basis-[40%] z-10 bg-white md:bg-transparent pt-4 md:pt-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 md:mb-1">
                         {details.to?.date || details.departureDate ? new Date(details.to?.date || details.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "TBA"}
                    </p>
                    <h5 className="text-2xl md:text-4xl font-black text-secondary mb-1">
                        {details.to?.city || "Destination"}
                    </h5>
                    <p className="text-sm md:text-xl font-bold text-primary uppercase">
                        {details.to?.time || "N/A"}
                        {details.to?.isNextDay && <span className="text-[10px] align-top ml-1 text-primary-deep font-black tracking-tighter uppercase">(+1 Day)</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const TransportSection = ({ transport }: TransportSectionProps) => {
    if (!transport || !transport.type) return null;

    return (
        <section id="transport" className="py-40 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
            
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <h2 className="text-primary font-black uppercase tracking-[0.5em] text-xs">Seamless Journeys</h2>
                    <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-secondary uppercase leading-none">
                        Travel Details
                    </h3>
                    <div className="h-2 w-32 bg-primary rounded-full mt-4" />
                </div>

                <div className="max-w-5xl mx-auto space-y-16">
                    {transport.type === 'flight' && transport.flightDetails && (
                        <div className="space-y-16">
                            {transport.flightDetails.departure ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <FlightCard title="Departure Itinerary" details={transport.flightDetails.departure} />
                                </motion.div>
                            ) : (
                                <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest italic">Departure flight details not available</p>
                                </div>
                            )}

                            {transport.flightDetails.return && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <FlightCard title="Return Itinerary" details={transport.flightDetails.return} />
                                </motion.div>
                            )}
                        </div>
                    )}

                    {transport.type === 'train' && transport.trainDetails && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <TrainCard details={transport.trainDetails} />
                        </motion.div>
                    )}

                    {((transport.type === 'flight' && !transport.flightDetails) || 
                      (transport.type === 'train' && !transport.trainDetails)) && (
                        <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 max-w-2xl mx-auto">
                            <p className="text-gray-400 font-black uppercase tracking-[0.2em] italic">Information not available</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        </section>
    );
};
