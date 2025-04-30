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
  
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user document
      const newUser = new User({
        firstName,
        email,
        password: hashedPassword,
        phoneNumber,
      });
  
      // Save the user
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
