"use client";

import { useState } from "react";
import { Trip, TripDay } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TripFormProps {
    initialData?: Trip;
    isEdit?: boolean;
}

export default function TripForm({ initialData, isEdit = false }: TripFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState<Partial<Trip>>(initialData || {
        id: `TRIP-${Math.floor(Math.random() * 10000)}`,
        title: "",
        description: "",
        price: 0,
        duration: "",
        inclusions: [""],
        exclusions: [""],
        itinerary: [],
        images: [""]
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const url = isEdit ? `/api/trips/${formData.id}` : "/api/trips";
            const method = isEdit ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to save trip");
            
            toast.success("Trip saved successfully!");
            router.push("/admin/trips");
        } catch (error) {
            toast.error("Failed to save trip.");
        } finally {
            setIsSaving(false);
        }
    };

    const addListItem = (field: 'inclusions' | 'exclusions' | 'images') => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: [...(prev[field] || []), ""] 
        }));
    };

    const removeListItem = (field: 'inclusions' | 'exclusions' | 'images', index: number) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: (prev[field] as string[]).filter((_, i) => i !== index) 
        }));
    };

    const updateListItem = (field: 'inclusions' | 'exclusions' | 'images', index: number, value: string) => {
        setFormData(prev => {
            const newList = [...(prev[field] as string[])];
            newList[index] = value;
            return { ...prev, [field]: newList };
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-12 pb-40">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.push("/admin/trips")} className="rounded-2xl">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="rounded-2xl px-12 shadow-xl shadow-primary/20">
                    <Save size={20} className="mr-2" /> {isEdit ? "Update Package" : "Create Package"}
                </Button>
            </div>

            <GlassCard className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label>Trip ID (Static Code)</Label>
                        <Input 
                            value={formData.id} 
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                            placeholder="e.g. YCPARTH01"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Trip Title</Label>
                        <Input 
                            value={formData.title} 
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Manali Magic"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Price (₹)</Label>
                        <Input 
                            type="number"
                            value={formData.price} 
                            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                            placeholder="24999"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Duration Display</Label>
                        <Input 
                            value={formData.duration} 
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="5 Days / 4 Nights"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>Brief Description</Label>
                    <Textarea 
                        value={formData.description} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Highlight the best parts of the trip..."
                        className="min-h-[120px]"
                    />
                </div>

                {/* Inclusions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-4">
                        <Label className="text-lg font-black uppercase">✅ Inclusions</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('inclusions')}>
                            <Plus size={16} /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {formData.inclusions?.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <Input 
                                    className="flex-1"
                                    value={item} 
                                    onChange={e => updateListItem('inclusions', i, e.target.value)} 
                                />
                                <Button variant="ghost" onClick={() => removeListItem('inclusions', i)} className="text-red-500">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-l-4 border-red-500 pl-4">
                        <Label className="text-lg font-black uppercase">❌ Exclusions</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('exclusions')}>
                            <Plus size={16} /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {formData.exclusions?.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <Input 
                                    className="flex-1"
                                    value={item} 
                                    onChange={e => updateListItem('exclusions', i, e.target.value)} 
                                />
                                <Button variant="ghost" onClick={() => removeListItem('exclusions', i)} className="text-red-500">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-l-4 border-primary pl-4">
                        <Label className="text-lg font-black uppercase">🖼️ Images (URLs)</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('images')}>
                            <Plus size={16} /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {formData.images?.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <Input 
                                    className="flex-1 font-mono text-xs"
                                    value={item} 
                                    onChange={e => updateListItem('images', i, e.target.value)} 
                                    placeholder="https://images.unsplash.com/..."
                                />
                                <Button variant="ghost" onClick={() => removeListItem('images', i)} className="text-red-500">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
