const express = require('express'); 
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const crypto = require('crypto');

app.use(express.json());  // To handle JSON payloads

const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
const dbName = 'userDatabase';
const collectionName = 'users';

const client = new MongoClient(uri);
client.connect().then(() => {
    console.log('Connected to database');
});

app.post('/index', (req, res) => {
  const { firstname, email, password, phonenumber } = req.body;

  // Check if email is already in the database
  User.findOne({ email: email }, (err, existingUser) => {
      if (err) {
          return res.status(500).json({ error: 'Server error' });
      }
      if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' }); // Specific error message
      }

      // Proceed with user creation
      const newUser = new User({ firstname, email, password, phonenumber });
      newUser.save((err) => {
          if (err) {
              return res.status(500).json({ error: 'Error saving user' }); // Specific error message for save failure
          }
          res.json({ success: true }); // Success response
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

      // (Optional) Store email in session for use on reset page
      req.session.resetEmail = email;

      return res.status(200).json({ message: 'Redirecting to reset password' });
  } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'Server error' });
  }
});


// added route for emergency module

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
