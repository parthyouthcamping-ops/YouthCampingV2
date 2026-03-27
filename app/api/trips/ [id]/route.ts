import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const trip = await db.getTrip(id);
        if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        return NextResponse.json(trip);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();
        const existing = await db.getTrip(id);
        if (!existing) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        
        const updated = {
            ...existing,
            ...data,
            id: id,
            updatedAt: new Date().toISOString()
        };
        await db.setTrip(updated);
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await db.deleteTrip(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
