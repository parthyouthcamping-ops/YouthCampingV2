"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    MoreVertical, 
    Mail, 
    Phone, 
    Calendar,
    ArrowUpRight,
    Loader2,
    Trash2,
    Edit3
} from "lucide-react";
import { getClients, saveClient, deleteClient } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ClientStatus = "Lead" | "Active" | "Completed" | "Lost";

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: ClientStatus;
    notes: string;
    created_at: string;
}

export default function CRMDashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            toast.error("Failed to load clients");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            await deleteClient(id);
            setClients(clients.filter(c => c.id !== id));
            toast.success("Client deleted");
        } catch (error) {
            toast.error("Failed to delete client");
        }
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">CRM & Leads</h2>
                    <p className="text-gray-500 font-medium italic">Manage your elite clientele and sales pipeline.</p>
                </div>
                <Button 
                    onClick={() => { setEditingClient(null); setIsFormOpen(true); }}
                    className="rounded-2xl px-8 h-14 shadow-2xl shadow-primary/20"
                >
                    <UserPlus className="mr-3" size={20} />
                    Add New Client
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-full px-6 border-gray-100">
                        <Filter className="mr-2" size={18} /> Filters
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredClients.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                            <Users className="mx-auto text-gray-200 mb-6" size={64} />
                            <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No Clients Found</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Client Details</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contact</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredClients.map((client) => (
                                        <tr key={client.id} className="group hover:bg-gray-50/30 transition-colors">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-lg">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 group-hover:text-primary transition-colors">{client.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                            Added {new Date(client.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                    client.status === "Lead" ? "bg-amber-50 text-amber-500 border-amber-100" :
                                                    client.status === "Active" ? "bg-green-50 text-green-500 border-green-100" :
                                                    client.status === "Completed" ? "bg-blue-50 text-blue-500 border-blue-100" :
                                                    "bg-gray-50 text-gray-400 border-gray-100"
                                                )}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                        <Mail size={14} className="text-primary" /> {client.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                        <Phone size={14} className="text-primary" /> {client.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setEditingClient(client); setIsFormOpen(true); }}
                                                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(client.id)}
                                                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 hover:shadow-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl">
                        <ClientForm 
                            client={editingClient} 
                            onClose={() => setIsFormOpen(false)} 
                            onSaved={() => { setIsFormOpen(false); loadClients(); }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function ClientForm({ client, onClose, onSaved }: { client: Client | null, onClose: () => void, onSaved: () => void }) {
    const [formData, setFormData] = useState<Partial<Client>>(
        client || { name: "", email: "", phone: "", status: "Lead", notes: "" }
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = {
                ...formData,
                id: client?.id || Date.now().toString(),
                created_at: client?.created_at || new Date().toISOString()
            };
            await saveClient(data);
            toast.success(client ? "Client updated" : "Client created");
            onSaved();
        } catch (error) {
            toast.error("Failed to save client");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <GlassCard className="bg-white p-12 space-y-10 border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            
            <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                    {client ? "Edit Client" : "New Elite Client"}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                    ✕
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                        <input 
                            required
                            className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</label>
                        <select 
                            className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                        >
                            <option value="Lead">Lead</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                        <input 
                            type="email"
                            required
                            className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
                        <input 
                            required
                            className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Internal Notes</label>
                    <textarea 
                        className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-primary/20 outline-none transition-all min-h-[120px]"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Preferences, potential trips, or follow-up history..."
                    />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-8 border-gray-100">Cancel</Button>
                    <Button type="submit" disabled={isSaving} className="rounded-xl px-12 shadow-2xl shadow-primary/20">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : "Save Client Profile"}
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}
