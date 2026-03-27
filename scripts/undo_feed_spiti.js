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

async function undo() {
    console.log("Revoking database changes (YCSPITI01)...");
    try {
        const resTravelers = await sql`DELETE FROM travelers WHERE trip_id = 'YCSPITI01'`;
        console.log("Travelers deleted.");
        
        const resTrips = await sql`DELETE FROM trips WHERE trip_id = 'YCSPITI01'`;
        console.log("Trip deleted.");
        
        console.log("Database revoked successfully.");
    } catch (err) {
        console.error("Error revoking database changes:", err);
    }
}

undo();
