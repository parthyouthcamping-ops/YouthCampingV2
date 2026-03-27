"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/Navbar";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isIsolated = pathname.startsWith("/quote/") || pathname.startsWith("/admin");

    return (
        <>
            {!isIsolated && <Navbar />}
            {children}
            {!isIsolated && <WhatsAppFAB />}
            <Toaster position="top-right" richColors />
        </>
    );
}
