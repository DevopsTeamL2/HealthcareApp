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

// Emergency Notification Schema
const emergencySchema = new Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' } // pending, sent, failed
});

const Emergency = model('Emergency', emergencySchema, 'emergency');

app.get('/emergency', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('emergency', { username: req.session.user.firstname });
});

app.post('/send-emergency', async (req, res) => {
  try {
    const { email, message } = req.body;

    // Validate input
    if (!email || !message) {
      return res.status(400).json({ success: false, error: 'Email and message are required' });
    }

    // Create new emergency record
    const newEmergency = new Emergency({
      email,
      message
    });

    // Save to database
    await newEmergency.save();

    // Here you could also add email sending functionality if needed
    // using nodemailer or your preferred email service

    res.json({ 
      success: true, 
      message: 'Emergency notification saved successfully!',
      data: newEmergency
    });

  } catch (error) {
    console.error('Error saving emergency notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save emergency notification' 
    });
  }
});
// end of emergency module code block


// Route for displaying the signup page
app.get('/signup', (req, res) => {
  res.render('signup');  // Renders signup.ejs
});

app.get('/doctordashboard', (req, res) => {
  if (req.session.user && req.session.user.role === 'doctor') {
    res.render('doctordashboard', { username: req.session.user.firstname });
  } else {
    res.redirect('/login');
  }
});


app.get('/login', (req, res) => {
  res.render('login', { username: 'Guest' });
});




app.post('/doctor-login', (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin (doctor) login credentials
  const doctorEmail = 'doctor@gmail.com';
  const doctorPassword = 'doctor123';

  if (email === doctorEmail && password === doctorPassword) {
    // Set session for doctor
    req.session.user = {
      email: doctorEmail,
      firstname: 'Doctor',
      role: 'doctor',
    };

    return res.json({ message: 'Login successful', role: 'doctor' });
  } else {
    return res.status(401).json({ error: 'Invalid doctor credentials' });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      role: user.role || 'user'  // fallback in case it's missing
    };

    return res.json({ message: 'Login successful', role: user.role || 'user' });

  } catch (err) {
    console.error('Server error during login:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/login'); // ✅ Redirect to login after logout
  });
});


// start of appoinment module
const appointmentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  datetime: { type: Date, required: true },
  details: { type: String, required: true },
  status: { type: String, default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);
// Add this route handler ABOVE any error handling middleware
app.post('/appointments', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { fullname, email, phone, datetime, details } = req.body;
    
    // Create new appointment document
    const newAppointment = new Appointment({
      fullname,
      email,
      phone,
      datetime: new Date(datetime),
      details,
      user: req.session.user.id,
      status: 'pending'
    });

    // Save to database
    await newAppointment.save();
    
    // Send success response
    res.json({ 
      success: true, 
      message: 'Appointment booked successfully!',
      appointmentId: newAppointment._id
    });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to book appointment. Please try again.' 
    });
  }
});

// Add this route ABOVE your server start code
app.get('/appointment', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('appointment', { 
    username: req.session.user.firstname,
    user: req.session.user // Pass user data to pre-fill form
  });
});
// end of appointment module

app.get('/landingpage', (req, res) => {
  if (req.session.user) {
    res.render('landingpage', { username: req.session.user.firstname });
  } else {
    res.redirect('/login');  // Redirect to login if user is not authenticated
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
