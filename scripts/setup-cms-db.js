const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in .env.local");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("Creating landing_sections table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS landing_sections (
                id TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Table created successfully.");

        // Initialise with default data if empty
        const sections = [
            {
                id: 'hero',
                data: {
                    title: "Luxury Travel Personified",
                    subtitle: "One Trip at a Time",
                    highlight: "Personified",
                    backgroundImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
                    ctaText: "Display My Trip"
                }
            },
            {
                id: 'about',
                data: {
                    title: "CURATED FOR HIGH ACHIEVERS",
                    content: "We curate travel for those who demand the extraordinary. Every itinerary is a masterpiece of logistics and luxury.",
                    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
                }
            }
        ];

        for (const section of sections) {
            console.log(`Seeding ${section.id}...`);
            await sql`
                INSERT INTO landing_sections (id, data)
                VALUES (${section.id}, ${JSON.stringify(section.data)}::jsonb)
                ON CONFLICT (id) DO NOTHING;
            `;
        }

        console.log("Seeding complete.");
    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
