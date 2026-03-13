const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in .env.local");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("Creating notifications table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                message TEXT,
                type TEXT DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                link TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Notifications table created successfully.");

    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
