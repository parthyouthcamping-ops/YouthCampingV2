import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    try {
        const trips = await db.getTrips();
        return NextResponse.json(trips);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const trip = {
            ...data,
            id: data.id || `TRIP-${uuidv4().slice(0, 8).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await db.setTrip(trip);
        return NextResponse.json(trip);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
