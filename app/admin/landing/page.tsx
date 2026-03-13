"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Layout, Image as ImageIcon, MessageSquare, Package, Home, Save, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { getLandingContent, updateLandingSection } from "@/lib/store";
import { LandingContent, LandingHero, LandingAbout, LandingPackage, LandingTestimonial, LandingGalleryItem } from "@/lib/types";
import { toast } from "sonner";
import Image from "next/image";

type SectionTab = "hero" | "about" | "packages" | "testimonials" | "gallery";

export default function AdminLandingPage() {
    const [content, setContent] = useState<LandingContent | null>(null);
    const [activeTab, setActiveTab] = useState<SectionTab>("hero");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await getLandingContent();
            // Ensure defaults if missing
            setContent({
                hero: data.hero || { title: "", subtitle: "", backgroundImage: "", ctaText: "" },
                about: data.about || { title: "", content: "", image: "" },
                packages: data.packages || [],
                testimonials: data.testimonials || [],
                gallery: data.gallery || []
            });
            setIsLoading(false);
        };
        load();
    }, []);

    const handleSave = async (sectionId: string, data: any) => {
        setIsSaving(true);
        try {
            await updateLandingSection(sectionId, data);
            toast.success(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} updated!`);
        } catch (error) {
            toast.error("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !content) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Landing Page CMS</h2>
                <p className="text-gray-500 font-medium">Manage every pixel of your high-conversion landing page.</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[
                    { id: "hero", label: "Hero Section", icon: Home },
                    { id: "about", label: "About Us", icon: Layout },
                    { id: "packages", label: "Trips Grid", icon: Package },
                    { id: "testimonials", label: "Reviews", icon: MessageSquare },
                    { id: "gallery", label: "Gallery", icon: ImageIcon },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SectionTab)}
                        className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? "bg-primary text-white shadow-xl shadow-primary/30" 
                            : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100"
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-12">
                {activeTab === "hero" && (
                    <HeroEditor 
                        data={content.hero} 
                        onSave={(data) => handleSave("hero", data)} 
                        isSaving={isSaving}
                    />
                )}
                {activeTab === "about" && (
                    <AboutEditor 
                        data={content.about} 
                        onSave={(data) => handleSave("about", data)} 
                        isSaving={isSaving}
                    />
                )}
                {activeTab === "packages" && (
                    <PackagesEditor 
                        data={content.packages} 
                        onSave={(data) => handleSave("packages", data)} 
                        isSaving={isSaving}
                    />
                )}
                {activeTab === "testimonials" && (
                    <TestimonialsEditor 
                        data={content.testimonials} 
                        onSave={(data) => handleSave("testimonials", data)} 
                        isSaving={isSaving}
                    />
                )}
                {activeTab === "gallery" && (
                    <GalleryEditor 
                        data={content.gallery} 
                        onSave={(data) => handleSave("gallery", data)} 
                        isSaving={isSaving}
                    />
                )}
            </div>
        </div>
    );
}

/* Sub-components for each section editor */

function HeroEditor({ data, onSave, isSaving }: { data: LandingHero, onSave: (d: LandingHero) => void, isSaving: boolean }) {
    const [hero, setHero] = useState(data);

    return (
        <GlassCard className="p-12 space-y-10 bg-white border-none shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Main Title</label>
                        <input 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Highlight Text (Italicized)</label>
                        <input 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={hero.highlight}
                            onChange={(e) => setHero({ ...hero, highlight: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Subtitle</label>
                        <input 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={hero.subtitle}
                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">CTA Button Label</label>
                        <input 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={hero.ctaText}
                            onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Hero Background Image</label>
                    <MediaUpload 
                        value={hero.backgroundImage} 
                        onUpload={(url) => setHero({ ...hero, backgroundImage: url })} 
                    />
                </div>
            </div>
            <div className="pt-8 border-t border-gray-100 flex justify-end">
                <Button onClick={() => onSave(hero)} disabled={isSaving} className="px-12 py-8 rounded-2xl shadow-2xl shadow-primary/20">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} className="mr-2" /> Publish Hero Changes</>}
                </Button>
            </div>
        </GlassCard>
    );
}

function AboutEditor({ data, onSave, isSaving }: { data: LandingAbout, onSave: (d: LandingAbout) => void, isSaving: boolean }) {
    const [about, setAbout] = useState(data);

    return (
        <GlassCard className="p-12 space-y-10 bg-white border-none shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Heading</label>
                        <input 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={about.title}
                            onChange={(e) => setAbout({ ...about, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Content Body</label>
                        <textarea 
                            className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all min-h-[200px]"
                            value={about.content}
                            onChange={(e) => setAbout({ ...about, content: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">About Us Image</label>
                    <MediaUpload 
                        value={about.image} 
                        onUpload={(url) => setAbout({ ...about, image: url })} 
                    />
                </div>
            </div>
            <div className="pt-8 border-t border-gray-100 flex justify-end">
                <Button onClick={() => onSave(about)} disabled={isSaving} className="px-12 py-8 rounded-2xl shadow-2xl shadow-primary/20">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} className="mr-2" /> Publish About Changes</>}
                </Button>
            </div>
        </GlassCard>
    );
}

function PackagesEditor({ data, onSave, isSaving }: { data: LandingPackage[], onSave: (d: LandingPackage[]) => void, isSaving: boolean }) {
    const [packages, setPackages] = useState(data);

    const addPackage = () => {
        setPackages([...packages, { id: Date.now().toString(), name: "New Trip", price: "₹0", duration: "5 Days", image: "" }]);
    };

    const removePackage = (id: string) => {
        setPackages(packages.filter(p => p.id !== id));
    };

    const updatePack = (id: string, updates: Partial<LandingPackage>) => {
        setPackages(packages.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <GlassCard key={pkg.id} className="p-8 bg-white border-none shadow-xl flex flex-col gap-6 relative group">
                        <button 
                            onClick={() => removePackage(pkg.id)}
                            className="absolute top-4 right-4 p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                        <MediaUpload value={pkg.image} onUpload={(url) => updatePack(pkg.id, { image: url })} compact />
                        <div className="space-y-4">
                            <input 
                                className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 focus:bg-white outline-none"
                                value={pkg.name}
                                onChange={(e) => updatePack(pkg.id, { name: e.target.value })}
                                placeholder="Destination Name"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    className="w-full p-4 bg-gray-50 rounded-xl font-bold text-primary focus:bg-white outline-none"
                                    value={pkg.price}
                                    onChange={(e) => updatePack(pkg.id, { price: e.target.value })}
                                    placeholder="Price"
                                />
                                <input 
                                    className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-500 focus:bg-white outline-none"
                                    value={pkg.duration}
                                    onChange={(e) => updatePack(pkg.id, { duration: e.target.value })}
                                    placeholder="Duration"
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}
                <button 
                    onClick={addPackage}
                    className="aspect-[4/5] border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 hover:border-primary/30 hover:text-primary transition-all gap-4"
                >
                    <Plus size={48} />
                    <span className="font-black uppercase tracking-widest text-xs">Add Featured Trip</span>
                </button>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => onSave(packages)} disabled={isSaving} className="px-12 py-8 rounded-2xl shadow-2xl">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} className="mr-2" /> Save Package Grid</>}
                </Button>
            </div>
        </div>
    );
}

function TestimonialsEditor({ data, onSave, isSaving }: { data: LandingTestimonial[], onSave: (d: LandingTestimonial[]) => void, isSaving: boolean }) {
    const [testimonials, setTestimonials] = useState(data);

    const add = () => {
        setTestimonials([...testimonials, { id: Date.now().toString(), name: "Client Name", trip: "Bali Tour", photo: "", quote: "", rating: 5 }]);
    };

    const remove = (id: string) => {
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    const update = (id: string, updates: Partial<LandingTestimonial>) => {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t) => (
                    <GlassCard key={t.id} className="p-10 bg-white border-none shadow-xl relative group">
                        <button 
                            onClick={() => remove(t.id)}
                            className="absolute top-4 right-4 p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="flex gap-8 items-start">
                            <div className="w-24 shrink-0">
                                <MediaUpload value={t.photo} onUpload={(url) => update(t.id, { photo: url })} circle />
                            </div>
                            <div className="flex-1 space-y-4">
                                <input 
                                    className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 focus:bg-white outline-none"
                                    value={t.name}
                                    onChange={(e) => update(t.id, { name: e.target.value })}
                                />
                                <input 
                                    className="w-full p-4 bg-gray-50 rounded-xl font-bold text-primary focus:bg-white outline-none"
                                    value={t.trip}
                                    onChange={(e) => update(t.id, { trip: e.target.value })}
                                />
                                <textarea 
                                    className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-500 italic focus:bg-white outline-none min-h-[100px]"
                                    value={t.quote}
                                    onChange={(e) => update(t.id, { quote: e.target.value })}
                                    placeholder="Client Review..."
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
            <div className="flex justify-between items-center">
                <Button onClick={add} variant="outline" className="rounded-2xl border-2 border-gray-100 font-black">
                    <Plus size={18} className="mr-2" /> Add Client Experience
                </Button>
                <Button onClick={() => onSave(testimonials)} disabled={isSaving} className="px-12 py-8 rounded-2xl shadow-2xl">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} className="mr-2" /> Publish Reviews</>}
                </Button>
            </div>
        </div>
    );
}

function GalleryEditor({ data, onSave, isSaving }: { data: LandingGalleryItem[], onSave: (d: LandingGalleryItem[]) => void, isSaving: boolean }) {
    const [gallery, setGallery] = useState(data);

    const addItem = () => {
        setGallery([...gallery, { id: Date.now().toString(), url: "", type: "image" }]);
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {gallery.map((item) => (
                    <div key={item.id} className="relative group aspect-square">
                        <MediaUpload value={item.url} onUpload={(url) => {
                            setGallery(gallery.map(g => g.id === item.id ? { ...g, url } : g));
                        }} compact />
                        <button 
                            onClick={() => setGallery(gallery.filter(g => g.id !== item.id))}
                            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                <button 
                    onClick={addItem}
                    className="aspect-square border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 hover:border-primary/30 hover:text-primary transition-all"
                >
                    <Plus size={32} />
                </button>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => onSave(gallery)} disabled={isSaving} className="px-12 py-8 rounded-2xl shadow-2xl">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} className="mr-2" /> Update Gallery</>}
                </Button>
            </div>
        </div>
    );
}

/* Base UI Components for the Editor */

function MediaUpload({ value, onUpload, compact, circle }: { value?: string, onUpload: (url: string) => void, compact?: boolean, circle?: boolean }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "ml_default");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            onUpload(data.secure_url);
            toast.success("Media uploaded successfully!");
        } catch (err) {
            toast.error("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`relative ${compact ? 'aspect-square' : 'aspect-video'} ${circle ? 'rounded-full' : 'rounded-3xl'} overflow-hidden bg-gray-50 border-2 border-dashed border-gray-100 group transition-all`}>
            {value ? (
                <>
                    <Image src={value} fill className="object-cover" alt="Uploaded Content" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-gray-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl">
                            {isUploading ? "Uploading..." : "Replace"}
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                        </label>
                    </div>
                </>
            ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all gap-3">
                    {isUploading ? <Loader2 className="animate-spin text-primary" /> : <ImageIcon size={compact ? 24 : 48} className="text-gray-300" />}
                    {!compact && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Media Library Upload</span>}
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
            )}
        </div>
    );
}
