require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function test() {
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'quotations'
        `;
        console.log("Columns in quotations table:");
        console.log(JSON.stringify(columns, null, 2));
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

test();
