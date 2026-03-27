const { neon } = require('@neondatabase/serverless');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("DATABASE_URL not found");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

const itinerary = [
    {
        day: 1,
        title: "Train Journey Ahmedabad to Chandigarh",
        shortDescription: "Boarding from Sabarmati Station",
        fullDetails: "Reporting Time: 09:00 AM at Sabarmati Railway Station. Begin your epic Spiti adventure with a comfortable train journey towards Chandigarh. Get to know your fellow travelers and the trip captain."
    },
    {
        day: 2,
        title: "Chandigarh → Shimla Sightseeing",
        shortDescription: "Explore the Queen of Hills",
        fullDetails: "Arrival in Chandigarh and drive to Shimla. Explore Mall Road, charming Shimla cafés, and local markets. Stay: Hotel in Shimla. Meals: Dinner included."
    },
    {
        day: 3,
        title: "Shimla → Chitkul",
        shortDescription: "Into the Kinnaur Valley",
        fullDetails: "A scenic drive through Kinnaur Valley. Visit Chitkul, the last inhabited village near the India-Tibet border. Stay: Cottage / Hotel. Meals: Breakfast + Dinner."
    },
    {
        day: 4,
        title: "Chitkul → Tabo via Nako Lake",
        shortDescription: "The High Altitude Desert Entrance",
        fullDetails: "Drive along the India Tibet Border road. Witness Khab Sangam (Spiti + Sutlej River). Visit the serene Nako Lake. Stay: Homestay. Meals: Breakfast + Dinner."
    },
    {
        day: 5,
        title: "Tabo → Dhankar → Kaza",
        shortDescription: "1000 Years of History",
        fullDetails: "Visit Tabo Monastery (1000+ years old). Explore Dhankar Village & Monastery perched on a cliff. Evening in Kaza Market. Stay: Homestay. Meals: Breakfast + Dinner."
    },
    {
        day: 6,
        title: "Key, Komic, Langza, Hikkim",
        shortDescription: "Highest Villages in the World",
        fullDetails: "Visit Key Monastery, Komic Village (highest village), Langza Buddha Statue, and Hikkim (World’s highest post office). Stay: Kaza. Meals: Breakfast + Dinner."
    },
    {
        day: 7,
        title: "Kibber → Chicham Bridge → Chandratal",
        shortDescription: "The Moon Lake",
        fullDetails: "Visit Kibber Village and the iconic Chicham Bridge. Reach the majestic Chandratal Lake for a lakeside camping experience. Stay: Chandratal Camp. Meals: Breakfast + Dinner."
    },
    {
        day: 8,
        title: "Chandratal → Manali",
        shortDescription: "Through the Atal Tunnel",
        fullDetails: "Route via Chhatru, the engineering marvel Atal Tunnel, and Solang Valley. Arrival in Manali. Stay: Hotel / Homestay. Meals: Breakfast + Dinner."
    },
    {
        day: 9,
        title: "Manali Sightseeing & Adventure",
        shortDescription: "Cafes & Paragliding",
        fullDetails: "Visit Hadimba Temple, Mall Road, and Old Manali. Optional activities: Paragliding, River rafting. Stay: Manali. Meal: Breakfast."
    },
    {
        day: 10,
        title: "Manali → Chandigarh/Jalandhar",
        shortDescription: "Beginning the Return",
        fullDetails: "Drive back to the plains to board your return train. Group departure with fond memories."
    },
    {
        day: 11,
        title: "Arrival in Ahmedabad",
        shortDescription: "Trip Ends",
        fullDetails: "Arrival in Ahmedabad. The epic Spiti Valley circuit journey concludes here."
    }
];

const packingList = [
    "Backpack / Rucksack",
    "Trekking shoes / Comfortable sneakers",
    "Heavy woollens & thermals",
    "Gloves & Woollen socks",
    "Sunglasses & Sunscreen SPF 50",
    "Personal medicines & First aid",
    "Power bank",
    "ID proof (Original)"
];

const tripData = {
    id: uuidv4(),
    tripId: "YCSPITI01",
    name: "Spiti Valley Road Trip (Full Circuit)",
    destination: "Spiti Valley",
    dates: { from: "2026-05-07", to: "2026-05-17" },
    tripLeader: { 
        name: "Aryan Captain", 
        phone: "+91 90000 12345",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
    },
    itinerary,
    transport: {
        type: 'Train',
        train: {
            pnr: "4210987654",
            trainNumber: "12903",
            trainName: "GOLDEN TEMPLE ML",
            coach: "S4",
            seat: "42",
            boardingStation: "Sabarmati (SBT)",
            departureTime: "09:00 AM",
            status: "CNF"
        }
    },
    driver: {
        name: "Kumar Driver",
        phone: "+91 80000 54321",
        vehicleNumber: "HP 01 A 0001 (Tempo Traveller)"
    },
    guide: {
        name: "Tenzing Local",
        phone: "+91 70000 67890"
    },
    packingList,
    documents: [
        { name: "Inner Line Permit Info", url: "#" },
        { name: "Spiti Route Map", url: "#" }
    ],
    emergencyContacts: [
        { name: "YouthCamping Support", relation: "HQ", phone: "+91 91234 56789" },
        { name: "Local Spiti Rescue", relation: "Local", phone: "100" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

async function feed() {
    console.log("Feeding Spiti Trip...");
    try {
        await sql`
            INSERT INTO trips (id, trip_id, data, updated_at, created_at)
            VALUES (${tripData.id}, ${tripData.tripId}, ${JSON.stringify(tripData)}::jsonb, ${tripData.updatedAt}, ${tripData.createdAt})
            ON CONFLICT (trip_id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
        `;
        console.log(`SUCCESS: Trip YCSPITI01 created.`);

        // Add a dummy traveler
        const travelerId = uuidv4();
        await sql`
            INSERT INTO travelers (id, name, phone, trip_id, created_at)
            VALUES (${travelerId}, 'Parth User', '+91 98765 43210', 'YCSPITI01', ${new Date().toISOString()})
        `;
        console.log(`SUCCESS: Dummy traveler added.`);

    } catch (err) {
        console.error(err);
    }
}

feed();
