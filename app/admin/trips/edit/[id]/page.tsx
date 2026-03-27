import { db } from "@/lib/db";
import TripForm from "@/components/admin/TripForm";
import { notFound } from "next/navigation";

interface Params {
    params: Promise<{ id: string }>;
}

export default async function EditTripPage({ params }: Params) {
    const { id } = await params;
    const trip = await db.getTrip(id);

    if (!trip) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Edit Trip</h2>
                <p className="text-gray-500 font-medium font-montserrat tracking-widest uppercase text-xs">Update your travel package settings.</p>
            </div>
            <TripForm initialData={trip} isEdit={true} />
        </div>
    );
}
