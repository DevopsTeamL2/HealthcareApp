import express from 'express'
import path from 'path'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import { MongoClient } from 'mongodb';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import session from 'express-session'; 
import crypto from 'crypto';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const { Schema, model } = mongoose;


// Replace with your actual credentials
const uri = "mongodb+srv://healthcareapp:GroupL2@healthcareapp.6zjsyou.mongodb.net/?retryWrites=true&w=majority&appName=HealthcareApp";
mongoose.connect(uri)

const client = new MongoClient(uri);

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (like CSS, JavaScript, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Needed to parse JSON body from frontend

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // Only set secure: true in production
}));


const blogSchema = new Schema({
  title: String,
  slug: String,
  published: Boolean,
  author: String,
  content: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  comments: [{
    user: String,
    content: String,
    votes: Number
  }]
});

const Blog = model('Blog', blogSchema);


// Create a new blog post object
const article = new Blog({
  title: 'POST 2!',
  slug: 'awesome-post',
  published: true,
  content: 'This is the best post ever',
  tags: ['featured', 'announcement'],
});
// Insert the article in our MongoDB database
await article.save();

const retrievedData = await Blog.findById("6810b41ac3f663168ad6f5eb").exec();
console.log(retrievedData);

const blog = await Blog.exists({ title: 'POST !' })
if(blog){
  console.log("ESITS!!!!")

  console.log(blog)
}else {
  console.log("DOES NOT EXITST")
}



// connect to MongoDB
async function connectToMongoDB() {
  try {
      await client.connect();
      console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
      console.error("❌ Connection failed:", err);
  } finally {
      await client.close();
  }
}

connectToMongoDB();

// Email sending route

app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate a reset token (use crypto for a secure token)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

    // Save the reset token and expiration time in the database
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send the reset link with the token
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click here to reset your password: http://localhost:3000/resetpassword/${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (err) {
    console.error('Error sending reset email:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { username: 'Hetvi' });
});

app.get('/index', (req, res) => {
  res.render('index', { username: 'Guest' });
});

app.post('/index', async (req, res) => {
  const { firstname, email, password, repeatpassword, phonenumber } = req.body;

  // Handle validation and signup logic
  if (password !== repeatpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          firstname,
          email,
          password: hashedPassword,
          phonenumber,
      });

      // Save the user to the database
      await newUser.save();

      // Respond with success
      res.status(200).json({ message: 'User created successfully!' });
  } catch (err) {
      console.error('Error creating user:', err); // Log error for debugging
      // Respond with a 500 status and the error message
      res.status(500).json({ error: 'Something went wrong during signup.' });
  }
});



app.get('/success', (req, res) => {
  res.render('success', { username: 'Guest' });
});


// Handle Password Reset
app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate a password reset token (could use JWT or custom token)
    const resetToken = Math.floor(Math.random() * 1000000); // simple example

    // Send an email to the user with the reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click here to reset your password: http://localhost:3000/forgotpassword/${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    // Save the reset token (store it in the DB or use it in another way)
    user.resetToken = resetToken;
    await user.save();

    return res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (err) {
    console.error('Error sending reset email:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});


app.get('/contact', (req, res) => {
  res.render('contact', { username: 'Guest' });
});

app.get('/emergency', (req, res) => {
  res.render('emergency', { username: 'Guest' });
});

// Route for displaying the signup page
app.get('/signup', (req, res) => {
  res.render('signup');  // Renders signup.ejs
});


app.get('/login', (req, res) => {
  res.render('login', { username: 'Guest' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Store user information in session to maintain login state
      req.session.user = {
          id: user._id,
          email: user.email,
          firstname: user.firstname,
      };

      // Respond with success
      return res.json({ message: 'Login successful' });

  } catch (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Something went wrong.' });
  }
});



app.get('/appointment', (req, res) => {
  res.render('appointment', { username: 'Guest' });
});

app.get('/landingpage', (req, res) => {
  if (req.session.user) {
    res.render('landingpage', { username: req.session.user.firstName });
  } else {
    res.redirect('/login');
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
