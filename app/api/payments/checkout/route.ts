import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { quotationId, clientId, amount, currency = 'INR', method } = await req.json();

        if (!quotationId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Phase 8: Mock Payment Gateway Logic
        // In a real scenario, you would initialize Stripe/PayPal here
        
        const bookingId = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
        
        // Create a pending booking record
        await db.setBooking({
            id: bookingId,
            quotation_id: quotationId,
            client_id: clientId,
            amount: amount,
            status: 'Pending',
            data: {
                payment_method: method,
                initiated_at: new Date().toISOString()
            }
        });

        // Add notification for admin
        await db.addNotification({
            title: "New Booking Initiated",
            message: `A payment for ₹${amount} has been initiated for Quotation #${quotationId.slice(0,8)}.`,
            type: "info",
            link: "/admin/bookings"
        });

        return NextResponse.json({ 
            success: true, 
            bookingId,
            checkoutUrl: `/payment/mock?id=${bookingId}` // Placeholder for real checkout
        });

    } catch (error: any) {
        console.error("[PAYMENT ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
