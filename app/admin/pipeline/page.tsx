"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    MoreVertical,
    Edit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STAGES: Quotation['status'][] = ["Sent", "Viewed", "Interested", "Booked"];

export default function PipelinePage() {
    const router = useRouter();
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

    const totalPipelineRevenue = quotations.reduce((acc, curr) => acc + (curr.highLevelPrice * curr.pax), 0);
    const bookedRevenue = quotations.filter(q => q.status === 'Booked').reduce((acc, curr) => acc + (curr.highLevelPrice * curr.pax), 0);

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center font-montserrat">
            <div className="text-center animate-pulse">
                <h1 className="text-4xl font-black text-primary italic">YouthCamping</h1>
                <p className="text-gray-400 font-semibold uppercase tracking-widest mt-4">Analyzing Your Empire...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 font-montserrat">
            {/* Master Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-primary p-1 shadow-2xl shadow-primary/20 rounded-[3rem]">
                    <div className="bg-primary p-8 rounded-[2.8rem] flex flex-col gap-1 h-full">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Global Pipeline</span>
                        <span className="text-3xl font-black text-white">₹{totalPipelineRevenue.toLocaleString()}</span>
                        <div className="mt-4 flex items-center gap-2">
                             <TrendingUp size={16} className="text-white/40" />
                             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{quotations.length} Proposals Live</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Closed Revenue</span>
                    <span className="text-3xl font-black text-green-600">₹{bookedRevenue.toLocaleString()}</span>
                    <div className="mt-4 flex items-center gap-2">
                         <div className="h-1.5 flex-1 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(bookedRevenue / (totalPipelineRevenue || 1)) * 100}%` }}
                                className="h-full bg-green-500" 
                            />
                         </div>
                         <span className="text-[9px] font-black text-gray-400">{Math.round((bookedRevenue / (totalPipelineRevenue || 1)) * 100)}%</span>
                    </div>
                </div>

                {STAGES.slice(0, 2).map(stage => {
                    const stats = getStageStats(stage);
                    return (
                        <div key={stage} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-1 group hover:border-primary/20 transition-colors">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stage}</span>
                            <span className="text-3xl font-black text-gray-900 group-hover:text-primary transition-colors">{stats.count}</span>
                            <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-widest">₹{stats.revenue.toLocaleString()} Volume</p>
                        </div>
                    );
                })}
            </div>

            {/* Kanban Columns */}
            <div className="flex flex-nowrap gap-8 overflow-x-auto pb-8 min-h-[700px] snap-x">
                {STAGES.map((stage) => (
                    <div key={stage} className="flex-1 min-w-[340px] bg-gray-50/40 rounded-[3.5rem] p-8 flex flex-col gap-8 border-2 border-transparent hover:border-gray-100 transition-all snap-start">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col gap-1">
                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${stage === 'Booked' ? 'bg-green-500' : stage === 'Viewed' ? 'bg-blue-400' : 'bg-primary'}`} />
                                    {stage}
                                </h4>
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">₹{getStageStats(stage).revenue.toLocaleString()}</span>
                            </div>
                            <span className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black text-gray-400 shadow-sm border border-gray-100">
                                {quotations.filter(q => q.status === stage).length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-6">
                            <AnimatePresence mode="popLayout">
                                {quotations
                                    .filter(q => q.status === stage)
                                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                    .map((q) => (
                                        <motion.div
                                            key={q.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="group pointer-events-auto"
                                        >
                                            <GlassCard className="p-7 rounded-[2.5rem] border-2 border-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all h-full bg-white relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/edit/${q.id}`)} className="h-8 w-8 p-0 rounded-full bg-gray-50 text-gray-400 hover:text-primary">
                                                        <Edit size={14} />
                                                    </Button>
                                                </div>
                                                
                                                <div className="flex flex-col gap-6">
                                                    <div className="space-y-1.5 pr-8">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">{q.destination}</p>
                                                        </div>
                                                        <h5 className="font-black text-gray-900 text-lg leading-tight tracking-tight">{q.clientName}</h5>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                                <Users size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-gray-300 uppercase">Travelers</span>
                                                                <span className="text-[11px] font-black text-gray-700">{q.pax} Adults</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                                <Calendar size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-gray-300 uppercase">Duration</span>
                                                                <span className="text-[11px] font-black text-gray-700">{q.duration.split('•')[0]}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Quote Value</span>
                                                            <span className="text-sm font-black text-gray-900">₹{(q.highLevelPrice * q.pax).toLocaleString()}</span>
                                                        </div>
                                                        
                                                        {STAGES.indexOf(stage) < STAGES.length - 1 ? (
                                                            <Button 
                                                                size="sm" 
                                                                onClick={() => updateStatus(q.id, STAGES[STAGES.indexOf(stage) + 1])}
                                                                className="h-10 px-5 rounded-2xl bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all transform hover:scale-105 shadow-none group/btn"
                                                            >
                                                                <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                                            </Button>
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                                                                <CheckCircle2 size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                            {quotations.filter(q => q.status === stage).length === 0 && (
                                <div className="border-2 border-dashed border-gray-100 rounded-[3rem] p-16 text-center flex flex-col items-center gap-4 bg-white/30 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-100">
                                        <TrendingUp size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Empty Stage</p>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase">No active leads at this step</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
