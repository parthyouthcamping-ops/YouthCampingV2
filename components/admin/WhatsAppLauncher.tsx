"use client";

import { useState } from "react";
import { Quotation } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface WhatsAppLauncherProps {
    quotation: Quotation;
    onClose: () => void;
}

const TEMPLATES = [
    {
        id: "luxury",
        name: "Luxury Premium",
        content: (q: Quotation, link: string) => `Hi ${q.clientName},

Greetings from YouthCamping! 🌴

As discussed, I have exclusively curated a luxury proposal for your trip to *${q.destination}*.

You can view your bespoke itinerary, handpicked hotel collections, and private transport details here:
${link}

Looking forward to bringing this dream journey to life for you.

Best,
${q.expert.name}`
    },
    {
        id: "standard",
        name: "Standard Professional",
        content: (q: Quotation, link: string) => `Hello ${q.clientName},

Please find the travel quotation for *${q.destination}* as requested.

View Details: ${link}

Feel free to reach out if you'd like to make any adjustments.

Regards,
${q.expert.name}`
    },
    {
        id: "followup",
        name: "Gentle Follow-up",
        content: (q: Quotation, link: string) => `Hi ${q.clientName}, hope you're doing well!

Just checking if you had a chance to review the *${q.destination}* proposal:
${link}

We currently have a few premium slots available for your dates. Would you like to lock them in?`
    }
];

export function WhatsAppLauncher({ quotation, onClose }: WhatsAppLauncherProps) {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [copied, setCopied] = useState(false);
    
    const quoteLink = typeof window !== 'undefined' ? `${window.location.origin}/quote/${quotation.slug}` : '';
    const message = selectedTemplate.content(quotation, quoteLink);

    const handleSend = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        toast.success("Message copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl"
            >
                <GlassCard className="p-10 shadow-3xl bg-white flex flex-col gap-8 rounded-[3rem]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">WhatsApp Launcher</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalized Travel Proposals</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedTemplate.id === t.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <textarea
                            readOnly
                            value={message}
                            className="w-full h-64 p-8 bg-gray-50 rounded-[2rem] text-sm font-medium text-gray-600 leading-relaxed border-2 border-transparent focus:border-primary/20 transition-all resize-none outline-none"
                        />
                        <button 
                            onClick={handleCopy}
                            className="absolute top-6 right-6 p-3 bg-white shadow-md rounded-xl text-gray-400 hover:text-primary transition-all active:scale-95"
                        >
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 rounded-2xl py-8 font-black uppercase tracking-widest text-[10px]" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="flex-1 rounded-2xl py-8 font-black uppercase tracking-widest text-[10px] bg-[#25D366] hover:bg-[#128C7E]" onClick={handleSend}>
                            <Send size={18} className="mr-3" /> Launch WhatsApp
                        </Button>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
