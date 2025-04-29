const express = require('express'); 
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());  // To handle JSON payloads

const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
const dbName = 'userDatabase';
const collectionName = 'users';

const client = new MongoClient(uri);
client.connect().then(() => {
    console.log('Connected to database');
});

// Signup Route (POST /signup)
app.post('/index', async (req, res) => {
    const { firstName, email, password, phoneNumber } = req.body;

    // Check if the user already exists in the database
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    await collection.insertOne({
        firstName,
        email,
        password, // In production, password should be hashed!
        phoneNumber,
        createdAt: new Date(),
    });

    res.status(201).json({ message: 'User created successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
