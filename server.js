const express = require('express'); 
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Use dynamic port on Azure
const port = process.env.PORT || 3000;

// MongoDB URI (change this to your cloud MongoDB URI for Azure)
const uri = 'mongodb+srv://healthcareapp:GroupL2@healthcareapp.6zjsyou.mongodb.net/?retryWrites=true&w=majority&appName=HealthcareApp';
const dbName = 'HealthcareApp';
const collectionName = 'test';

// MongoDB connection setup using mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = mongoose.model('User', new mongoose.Schema({
    firstname: String,
    email: { type: String, required: true, unique: true },
    password: String,
    phonenumber: String
}));

const Emergency = mongoose.model('Emergency', new mongoose.Schema({
    email: String,
    message: String
}));

app.use(express.json());  // To handle JSON payloads

app.post('/index', (req, res) => {
    const { firstname, email, password, phonenumber } = req.body;

    // Check if email is already in the database
    User.findOne({ email: email }, (err, existingUser) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Proceed with user creation
        const newUser = new User({ firstname, email, password, phonenumber });
        newUser.save((err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving user' });
            }
            res.json({ success: true });
        });
    });
});

app.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        req.session.resetEmail = email;
        return res.status(200).json({ message: 'Redirecting to reset password' });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/send-emergency', async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ success: false, error: 'Both email and message are required.' });
    }

    try {
        const newAlert = new Emergency({ email, message });
        await newAlert.save();
        res.json({ success: true, message: 'Emergency message sent successfully.' });
    } catch (err) {
        console.error('Error saving emergency message:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
