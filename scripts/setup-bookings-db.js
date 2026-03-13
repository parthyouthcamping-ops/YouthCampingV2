const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in .env.local");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("Creating bookings table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                quotation_id TEXT REFERENCES quotations(id),
                client_id TEXT REFERENCES clients(id),
                amount DECIMAL(10, 2) NOT NULL,
                currency TEXT DEFAULT 'INR',
                status TEXT DEFAULT 'Pending', -- Pending, Confirmed, Cancelled
                payment_method TEXT,
                transaction_id TEXT,
                booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                travel_date_from DATE,
                travel_date_to DATE,
                data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Bookings table created successfully.");

    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
