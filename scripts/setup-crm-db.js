const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in .env.local");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("Creating clients table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS clients (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                status TEXT DEFAULT 'Lead',
                notes TEXT,
                data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Clients table created successfully.");

        console.log("Adding clientId to quotations if not exists...");
        // In a real migration, we'd check if the column exists first. 
        // For simplicity with Neon/serverless, we can use a safe alter.
        try {
            await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS client_id TEXT REFERENCES clients(id);`;
            console.log("quotations table updated.");
        } catch (e) {
            console.log("Client relation update skipped (might already exist).");
        }

    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
