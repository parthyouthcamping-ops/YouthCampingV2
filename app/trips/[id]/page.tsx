import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TripDetail from "@/components/trip/TripDetail";

interface Params {
    params: Promise<{ id: string }>;
}

export default async function TripPage({ params }: Params) {
    const { id } = await params;
    const trip = await db.getTrip(id);

    if (!trip) {
        notFound();
    }

    return <TripDetail trip={trip} />;
}
