require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set in .env.local");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function addTripsTable() {
    console.log("- Creating 'trips' table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS trips (
                id TEXT PRIMARY KEY,
                data JSONB,
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;
        console.log("✅ SUCCESS: Trips table added!");
    } catch (e) {
        console.error("❌ ERROR: Failed to create trips table:", e);
    }
}

addTripsTable();
