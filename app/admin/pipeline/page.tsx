"use client";

import { useEffect, useState } from "react";
import { getQuotations, saveQuotation } from "@/lib/store";
import { Quotation } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
    Clock, 
    CheckCircle2, 
    ArrowRight, 
    Users, 
    Calendar,
    ChevronRight,
    TrendingUp,
    MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STAGES: Quotation['status'][] = ["Sent", "Viewed", "Interested", "Booked"];

export default function PipelinePage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await getQuotations();
        setQuotations(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateStatus = async (id: string, newStatus: Quotation['status']) => {
        const q = quotations.find(x => x.id === id);
        if (!q) return;

        const updated = { ...q, status: newStatus, updatedAt: new Date().toISOString() };
        try {
            await saveQuotation(updated);
            setQuotations(prev => prev.map(x => x.id === id ? updated : x));
            toast.success(`Moved to ${newStatus}`);
        } catch (error) {
            toast.error("Cloud update failed.");
        }
    };

    const getStageStats = (stage: string) => {
        const filtered = quotations.filter(q => q.status === stage);
        const revenue = filtered.reduce((acc, curr) => acc + (curr.highLevelPrice * curr.pax), 0);
        return { count: filtered.length, revenue };
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-primary tracking-widest">LOADING PIPELINE...</div>;

    return (
        <div className="flex flex-col gap-12">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {STAGES.map(stage => {
                    const stats = getStageStats(stage);
                    return (
                        <div key={stage} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stage}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900">{stats.count}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quotes</span>
                            </div>
                            <p className="text-xs font-black text-primary mt-2">₹{stats.revenue.toLocaleString()} <span className="text-[8px] opacity-60">Potential</span></p>
                        </div>
                    );
                })}
            </div>

            {/* Kanban Columns */}
            <div className="flex flex-nowrap gap-8 overflow-x-auto pb-8 min-h-[600px]">
                {STAGES.map((stage) => (
                    <div key={stage} className="flex-1 min-w-[320px] bg-gray-50/50 rounded-[3rem] p-6 flex flex-col gap-6 border-2 border-transparent hover:border-gray-100 transition-all">
                        <div className="flex items-center justify-between px-4">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${stage === 'Booked' ? 'bg-green-500' : 'bg-primary'}`} />
                                {stage}
                            </h4>
                            <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-400 shadow-sm border border-gray-100">
                                {quotations.filter(q => q.status === stage).length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AnimatePresence mode="popLayout">
                                {quotations
                                    .filter(q => q.status === stage)
                                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                    .map((q) => (
                                        <motion.div
                                            key={q.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="group pointer-events-auto"
                                        >
                                            <GlassCard className="p-6 rounded-[2rem] border-2 border-white/80 hover:border-primary/20 hover:shadow-xl transition-all h-full bg-white">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-primary uppercase tracking-widest">{q.destination}</p>
                                                            <h5 className="font-black text-gray-900 text-sm leading-tight line-clamp-1">{q.clientName}</h5>
                                                        </div>
                                                        <button className="text-gray-300 hover:text-gray-900">
                                                            <MoreVertical size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-4 py-3 border-y border-gray-50">
                                                        <div className="flex items-center gap-1.5">
                                                            <Users size={12} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-600">{q.pax}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-600">{q.duration.split('•')[0]}</span>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <span className="text-[10px] font-black text-gray-900">₹{(q.highLevelPrice * q.pax).toLocaleString()}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {STAGES.indexOf(stage) < STAGES.length - 1 && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost"
                                                                onClick={() => updateStatus(q.id, STAGES[STAGES.indexOf(stage) + 1])}
                                                                className="flex-1 text-[8px] font-black uppercase tracking-widest h-9 rounded-xl hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20"
                                                            >
                                                                Move to {STAGES[STAGES.indexOf(stage) + 1]} <ArrowRight size={10} className="ml-1" />
                                                            </Button>
                                                        )}
                                                        {stage === 'Booked' && (
                                                            <div className="w-full h-9 rounded-xl bg-green-50 flex items-center justify-center gap-2">
                                                                <CheckCircle2 size={12} className="text-green-500" />
                                                                <span className="text-[8px] font-black uppercase text-green-600 tracking-widest">Revenue Locked</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                            {quotations.filter(q => q.status === stage).length === 0 && (
                                <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center flex flex-col items-center gap-3">
                                    <TrendingUp size={24} className="text-gray-200" />
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No Active Leads</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
