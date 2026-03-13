"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
    CreditCard, 
    Plus, 
    Search, 
    Filter, 
    Download, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ArrowUpRight,
    Loader2,
    FileText,
    ExternalLink
} from "lucide-react";
import { getBookings, saveBooking } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/lib/invoicing"; // Next.js will resolve .tsx

type BookingStatus = "Pending" | "Confirmed" | "Partial" | "Cancelled";

interface Booking {
    id: string;
    quotation_id: string;
    client_id: string;
    client_name: string;
    destination: string;
    amount: number;
    currency: string;
    status: BookingStatus;
    created_at: string;
    transaction_id?: string;
}

export default function BookingsDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setIsLoading(true);
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = bookings.reduce((acc, b) => b.status === 'Confirmed' ? acc + Number(b.amount) : acc, 0);
    const pendingAmount = bookings.reduce((acc, b) => b.status === 'Pending' ? acc + Number(b.amount) : acc, 0);

    return (
        <div className="space-y-12 pb-20">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Financials & Bookings</h2>
                    <p className="text-gray-500 font-medium italic">Track luxury trip transactions and payment statuses.</p>
                </div>
                <div className="flex gap-4">
                     <Button variant="outline" className="rounded-2xl px-6 h-14 border-gray-100">
                        <Download className="mr-3" size={20} />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-8 bg-white border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Confirmed Revenue</p>
                    <h3 className="text-4xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</h3>
                </GlassCard>
                <GlassCard className="p-8 bg-white border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Pending Deposits</p>
                    <h3 className="text-4xl font-black text-gray-900">₹{pendingAmount.toLocaleString()}</h3>
                </GlassCard>
                <GlassCard className="p-8 bg-white border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Bookings</p>
                    <h3 className="text-4xl font-black text-gray-900">{bookings.length}</h3>
                </GlassCard>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by client, destination or Booking ID..."
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

            {/* Bookings Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order & Trip</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Client</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Amount</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <CreditCard className="mx-auto text-gray-100 mb-6" size={64} />
                                        <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No Bookings Recorded</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <div className="font-black text-gray-900 group-hover:text-primary transition-colors">#{booking.id.slice(0, 8).toUpperCase()}</div>
                                                <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                                                    {booking.destination}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-bold text-gray-700">{booking.client_name || "N/A"}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">Recorded {new Date(booking.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-black text-gray-900">₹{Number(booking.amount).toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Full Trip Cost</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={cn(
                                                "flex items-center gap-2 w-fit px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                booking.status === "Confirmed" ? "bg-green-50 text-green-500 border-green-100" :
                                                booking.status === "Pending" ? "bg-amber-50 text-amber-500 border-amber-100" :
                                                "bg-gray-50 text-gray-400 border-gray-100"
                                            )}>
                                                {booking.status === "Confirmed" ? <CheckCircle2 size={12} /> : 
                                                 booking.status === "Pending" ? <Clock size={12} /> : 
                                                 <AlertCircle size={12} />}
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <PDFDownloadLink 
                                                document={<InvoicePDF booking={booking} client={{ name: booking.client_name }} quotation={{ destination: booking.destination }} />} 
                                                fileName={`invoice-${booking.id}.pdf`}
                                            >
                                                {({ loading }) => (
                                                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all disabled:opacity-50">
                                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                                                    </button>
                                                )}
                                            </PDFDownloadLink>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
