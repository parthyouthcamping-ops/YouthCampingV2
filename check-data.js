require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function test() {
    try {
        const count = await sql`SELECT count(*) FROM quotations`;
        console.log("Total quotations in DB:", count[0].count);
        
        const latest = await sql`SELECT id, slug, updated_at FROM quotations ORDER BY updated_at DESC LIMIT 5`;
        console.log("Latest 5 quotations:");
        console.table(latest);
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

test();
