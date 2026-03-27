"use client";

import { useEffect, useState } from "react";
import { Trip } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MapPin, Star, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminTrips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadTrips = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/trips");
            const data = await res.json();
            setTrips(data);
        } catch (error) {
            toast.error("Failed to load trips.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTrips();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Trip deleted!");
                loadTrips();
            }
        } catch (error) {
            toast.error("Failed to delete trip.");
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Trip Packages</h2>
                    <p className="text-gray-500 font-medium">Manage your standard travel itineraries here.</p>
                </div>
                <Link href="/admin/trips/new">
                    <Button className="rounded-2xl shadow-xl shadow-primary/20 h-14 px-8 font-black uppercase text-xs tracking-widest">
                        <Plus size={20} className="mr-2" /> New Trip
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <GlassCard key={i} className="h-64 animate-pulse bg-gray-50 border-none"><div /></GlassCard>)}
                </div>
            ) : trips.length === 0 ? (
                <GlassCard className="p-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto">
                        <Clock size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">No Trips Found</h3>
                        <p className="text-gray-500 font-medium">Start by adding your first premium travel package.</p>
                    </div>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip, idx) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassCard className="p-8 group hover:border-primary/20 transition-all duration-500">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                            <MapPin size={12} /> {trip.id}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{trip.title}</h3>
                                        <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Clock size={12} /> {trip.duration}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="text-xl font-black text-primary">₹{trip.price.toLocaleString()}</div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/trips/edit/${trip.id}`}>
                                                <Button size="sm" variant="outline" className="rounded-xl"><Edit size={16} /></Button>
                                            </Link>
                                            <Button size="sm" variant="ghost" className="text-red-400 rounded-xl" onClick={() => handleDelete(trip.id)}><Trash2 size={16} /></Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/trips/${trip.id}`} target="_blank" className="flex-1">
                                            <Button variant="secondary" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest rounded-xl">View Live</Button>
                                        </Link>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
