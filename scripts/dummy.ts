import { Neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

// Simple neon wrapper for script
const { neon } = require('@neondatabase/serverless');
const sql = neon(DATABASE_URL);

async function createDummy() {
    const id = uuidv4();
    const destination = "Andaman Islands - The Elite Escape";
    const slug = `andaman-elite-${id.substring(0, 5)}`;
    
    const quotation = {
        id,
        slug,
        status: "Confirmed",
        clientName: "Mr. & Mrs. Sharma",
        destination,
        pax: 2,
        duration: "5 Nights / 6 Days",
        travelDates: {
            from: "2026-06-12",
            to: "2026-06-17"
        },
        transportOption: "Flight",
        roomSharing: "Double",
        lowLevelPrice: 85000,
        highLevelPrice: 125000,
        heroImage: "https://images.unsplash.com/photo-1589418579007-88f284f9349c?auto=format&fit=crop&q=80&w=2000",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000"
        ],
        transportDetails: {
            type: 'Flight',
            inboundLegs: [
                {
                    id: uuidv4(),
                    from: "AMD",
                    to: "BLR",
                    time: "11:00 PM",
                    operator: "IndiGo",
                    number: "6E-212",
                    duration: "2h 30m"
                },
                {
                    id: uuidv4(),
                    from: "BLR",
                    to: "IXZ",
                    time: "06:25 AM",
                    operator: "IndiGo",
                    number: "6E-854",
                    duration: "2h 45m",
                    isNextDay: true
                }
            ],
            outboundLegs: [
                {
                    id: uuidv4(),
                    from: "IXZ",
                    to: "AMD",
                    time: "03:05 PM",
                    operator: "IndiGo",
                    number: "6E-901",
                    duration: "7h 25m (via BLR)"
                }
            ],
            baggageCabin: '7 Kg',
            baggageCheckin: '25 Kg (Premium)',
            inboundLayover: '4h 55m Layover in Bengaluru'
        },
        itinerary: [
            {
                id: uuidv4(),
                day: 1,
                title: "Departure & Arrival in Paradise",
                description: "Your journey begins with a night flight to the islands. Upon arrival at Port Blair, you'll be greeted by our representative and transferred to your luxury resort. Spend the day relaxing by the infinity pool.",
                activities: ["Airport Greeting", "Luxury Transfer", "Sunset Cocktails"],
                photos: ["https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800"]
            },
            {
                id: uuidv4(),
                day: 2,
                title: "Cellular Jail & Sound and Light Show",
                description: "Delve into the history of the islands with a guided tour of the Cellular Jail, followed by a mesmerizing sound and light show that narrates the heroic saga of the freedom struggle.",
                activities: ["Heritage Tour", "Museum Visit", "Light & Sound Show"],
                photos: ["https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800"]
            },
            {
                id: uuidv4(),
                day: 3,
                title: "Private Yacht to Havelock Island",
                description: "Experience the crystal clear waters of the Andaman Sea as you sail to Havelock Island on a private yacht. Check-in to the Taj Exotica and witness the sunset at Radhanagar Beach.",
                activities: ["Private Yacht", "Taj Exotica Check-in", "Sunset at Radhanagar"],
                photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800"]
            }
        ],
        includes: [
            "Return Premium Economy Airfare",
            "5 Nights Luxury Accommodation",
            "All Meals (Buffet & A la Carte)",
            "Private Yacht Transfers",
            "Dedicated Travel Concierge"
        ],
        exclusions: [
            "Personal Shopping",
            "Water Sports beyond Inclusions",
            "Alcoholic Beverages (unless specified)"
        ],
        expert: {
            name: "Rajesh Kumar",
            whatsapp: "919876543210",
            designation: "Island Specialist",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(quotation);
    
    try {
        await sql`
            INSERT INTO quotations (id, slug, data, updated_at, created_at)
            VALUES (${id}, ${slug}, ${jsonString}::jsonb, ${new Date().toISOString()}, ${new Date().toISOString()})
        `;
        console.log(`\x1b[32mSUCCESS: Dummy quotation created!\x1b[0m`);
        console.log(`Slug: ${slug}`);
        console.log(`URL: http://localhost:3000/quote/${slug}`);
    } catch (err) {
        console.error("Failed to insert dummy:", err);
    }
}

createDummy();
