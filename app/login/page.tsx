"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import Script from "next/script";
import Image from "next/image";

declare global {
    interface Window {
        onTurnstileSuccess: (token: string) => void;
        turnstile: any;
    }
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const router = useRouter();
    const { brand } = useBrandSettings();
    const tokenCaptured = useRef(false);

    // Consolidated Turnstile logic:
    // 1. Define the callback globally so the script can find it immediately
    useEffect(() => {
        window.onTurnstileSuccess = (token: string) => {
            console.log("[LOGIN] Turnstile token captured");
            setTurnstileToken(token);
            tokenCaptured.current = true;
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!turnstileToken) {
            const hasKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && 
                           process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "YOUR_TURNSTILE_SITE_KEY";
            
            if (!hasKey) {
                toast.error("Turnstile configuration is missing. Using testing fallback.");
            } else {
                toast.error("Please complete the security check (Verify you are human)");
            }
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, turnstileToken }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Welcome back, Admin!");
                router.push("/admin");
            } else {
                toast.error(data.error || "Login failed");
                // Reset turnstile on failure to allow retry
                if (window.turnstile) window.turnstile.reset();
                setTurnstileToken(null);
            }
        } catch (error) {
            toast.error("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50/50 font-montserrat">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <GlassCard className="max-w-md w-full p-12 rounded-[3rem] shadow-3xl bg-white border-none relative z-10">
                <div className="flex flex-col items-center gap-8 text-center mb-10">
                    {brand?.companyLogo ? (
                        <Image src={brand.companyLogo} width={150} height={60} className="h-16 w-auto object-contain" alt="Logo" priority />
                    ) : (
                        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">
                            YouthCamping
                        </h1>
                    )}
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
                        <p className="text-gray-400 font-medium mt-2 text-sm uppercase tracking-widest italic">
                            One Trip at a Time
                        </p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <ShieldCheck size={20} />
                        </div>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/20 focus:outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/20 focus:outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div 
                            className="cf-turnstile" 
                            data-sitekey={
                                (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "YOUR_TURNSTILE_SITE_KEY")
                                ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY 
                                : "1x00000000000000000000AA"
                            }
                            data-callback="onTurnstileSuccess"
                            data-theme="light"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-8 text-sm tracking-[0.2em] font-black uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 group"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
                        Handcrafted by YouthCamping Ops
                    </p>
                </div>
            </GlassCard>

            <Script 
                src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
                strategy="afterInteractive"
            />
        </main>
    );
}
