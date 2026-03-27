const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("DATABASE_URL not found");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
    console.log("Starting TMS migration...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS trips (
                id UUID PRIMARY KEY,
                trip_id VARCHAR(50) UNIQUE NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("Table 'trips' checked/created.");

        await sql`
            CREATE TABLE IF NOT EXISTS travelers (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                trip_id VARCHAR(50) NOT NULL,
                email VARCHAR(255),
                data JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("Table 'travelers' checked/created.");
        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    }
}

migrate();
