require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function test() {
    try {
        const id = 'test-id-' + Date.now();
        const data = { name: 'test', value: 123 };
        console.log("Attempting to insert object directly...");
        await sql`INSERT INTO quotations (id, slug, data) VALUES (${id}, ${id}, ${data})`;
        console.log("✅ Success!");
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

test();
