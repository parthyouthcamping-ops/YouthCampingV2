require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function testFullSave() {
    console.log("Simulating full Quotation save...");
    const mockQuotation = {
        id: "verify-" + Date.now(),
        slug: "verify-test-slug-" + Date.now(),
        clientName: "Verification Test",
        destination: "Test Land",
        pax: 2,
        travelDates: { from: "2024-01-01", to: "2024-01-05" },
        duration: "4 Nights / 5 Days",
        transportOption: "Private Car",
        roomSharing: "Double",
        lowLevelPrice: 10000,
        highLevelPrice: 20000,
        hotels: [],
        lowLevelHotels: [],
        highLevelHotels: [],
        itinerary: [
            { id: "d1", day: 1, title: "Arrival", description: "Arrive at test land", activities: ["Test activity"], photos: [] }
        ],
        includes: ["Everything"],
        exclusions: ["Nothing"],
        expert: { name: "Tester", whatsapp: "1234567890" },
        status: "Draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        await sql`
            INSERT INTO quotations (id, slug, data, updated_at, created_at)
            VALUES (${mockQuotation.id}, ${mockQuotation.slug}, ${mockQuotation}, ${mockQuotation.updatedAt}, ${mockQuotation.createdAt})
        `;
        console.log("✅ End-to-end save successful!");
        
        const verified = await sql`SELECT data FROM quotations WHERE id = ${mockQuotation.id}`;
        console.log("Verified saved client name:", verified[0].data.clientName);
    } catch (e) {
        console.error("❌ Full save failed:", e.message);
    }
}

testFullSave();
