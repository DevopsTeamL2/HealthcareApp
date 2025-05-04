// routes/emergency.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://healthcareapp:GroupL2@healthcareapp.6zjsyou.mongodb.net/?retryWrites=true&w=majority&appName=HealthcareApp";
const client = new MongoClient(uri);

router.post('/send-emergency', async (req, res) => {
    const { email, message } = req.body;

    try {
        await client.connect();
        const db = client.db('HealthcareApp');
        const collection = db.collection('emergency');
        await collection.insertOne({ email, message });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ success: false });
    } finally {
        await client.close();
    }
});

module.exports = router;
