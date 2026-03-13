"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFAB() {
    const phoneNumber = "919000000000"; // Replace with actual business number
    const message = encodeURIComponent("Hello YouthCamping! I'm interested in booking a luxury trip.");

    return (
        <motion.a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-full shadow-2xl flex items-center justify-center group"
        >
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
            <MessageCircle size={32} className="relative z-10" />
            
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-4 bg-[#0a192f] text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap pointer-events-none"
            >
                Chat with our Experts
            </motion.div>
        </motion.a>
    );
}
