const { MongoClient } = require('mongodb');

// Replace with your actual credentials
const uri = "mongodb+srv://healthcareapp:GroupL2@healthcareapp.6zjsyou.mongodb.net/?retryWrites=true&w=majority&appName=HealthcareApp";

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        await client.close();
    }
}

run();
