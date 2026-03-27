import { Trip, TrainDetails } from "./types";

/**
 * Mocking a Railway PNR API response
 * In production, replace with a real fetch to a provider like RapidAPI or a custom Railway API
 */
export async function fetchPNRStatus(pnr: string): Promise<Partial<TrainDetails>> {
    console.log(`Fetching PNR status for: ${pnr}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple validation
    if (!/^\d{10}$/.test(pnr)) {
        throw new Error("Invalid PNR format. Must be 10 digits.");
    }

    // Mock data based on PNR
    return {
        pnr,
        trainNumber: "12903",
        trainName: "GOLDEN TEMPLE ML",
        coach: "B2",
        seat: "42",
        boardingStation: "BOMBAY CENTRAL (BCT)",
        departureTime: "09:25 PM",
        status: "CNF"
    };
}

/**
 * Generates the WhatsApp Confirmation Message
 */
export function getConfirmationMessage(travelerName: string, tripId: string, tripName: string) {
    return `Hello ${travelerName}

Your YouthCamping trip "${tripName}" is confirmed.

Trip ID: ${tripId}

View your full trip dashboard here:
https://youthcamping.com/trip/${tripId}

Inside you will find:
• Full itinerary
• Train / flight details
• Driver contact
• Vehicle number
• Packing list

Have an amazing trip!`;
}

/**
 * Sends a WhatsApp message (Placeholder for Twilio/Cloud API)
 */
export async function sendWhatsApp(to: string, message: string) {
    console.log(`[WHATSAPP SENT TO ${to}]`);
    console.log(message);
    // TODO: Integrate Twilio or WhatsApp Cloud API
    // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({ from: 'whatsapp:+14155238886', to: `whatsapp:${to}`, body: message });
    return { success: true };
}
