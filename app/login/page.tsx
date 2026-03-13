"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBrandSettings } from "@/hooks/useBrandSettings";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { brand } = useBrandSettings();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                toast.success("Welcome back, Admin!");
                router.push("/admin");
            } else {
                const data = await res.json();
                toast.error(data.error || "Invalid password");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50/50 font-montserrat">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <GlassCard className="max-w-md w-full p-12 rounded-[3rem] shadow-3xl bg-white border-none relative z-10">
                <div className="flex flex-col items-center gap-8 text-center mb-10">
                    {brand?.companyLogo ? (
                        <img src={brand.companyLogo} className="h-16 w-auto object-contain" alt="Logo" />
                    ) : (
                        <h1 className="text-4xl font-black text-primary tracking-tighter">
                            YouthCamping
                        </h1>
                    )}
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admin Access</h2>
                        <p className="text-gray-400 font-medium mt-2 text-sm uppercase tracking-widest">
                            One Trip at a Time
                        </p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/20 focus:outline-none transition-all shadow-sm"
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
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Secure Access Only
                    </p>
                </div>
            </GlassCard>
        </main>
    );
}
