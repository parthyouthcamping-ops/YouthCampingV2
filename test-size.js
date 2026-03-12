require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function test() {
    try {
        const id = 'test-size-' + Date.now();
        const largeString = 'a'.repeat(2 * 1024 * 1024); // 2MB
        const data = { name: 'test-large', value: largeString };
        console.log("Attempting to insert 2MB object...");
        const start = Date.now();
        await sql`INSERT INTO quotations (id, slug, data) VALUES (${id}, ${id}, ${data})`;
        process.stdout.write(`✅ Success! Time: ${Date.now() - start}ms\n`);
    } catch (e) {
        process.stdout.write(`❌ Failed: ${e.message}\n`);
    }
}

test();
