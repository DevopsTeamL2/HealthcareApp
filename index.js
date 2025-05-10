import express from 'express'
import path from 'path'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import session from 'express-session'; 
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();


const MAIL_USER = 'gfredibe4@gmail.com';     // e.g. medicalcenter@gmail.com
const MAIL_PASS = 'onsu zpzk yqgu kipq';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { Schema, model } = mongoose;


const uri = process.env.MONGODB_URI;


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


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Mongoose connected to MongoDB Atlas!");
}).catch((err) => {
  console.error("❌ Mongoose connection failed:", err);
});



// Routes
app.get('/', (req, res) => {
  res.render('index', { username: 'Hetvi' });
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,          // use 587 + secure:false if you prefer STARTTLS
      secure: true,
      auth: { user: MAIL_USER, pass: MAIL_PASS }
    });

    await transporter.sendMail({
      /*  Gmail will reject arbitrary “From” addresses. 
          Keep it as your own mailbox and let “reply-to” point at the visitor. */
      from: `"Medical Center Contact" <${MAIL_USER}>`,
      replyTo: email,                       // click “Reply” → replies to the visitor
      to: MAIL_USER,                        // deliver to yourself
      subject: `Contact-form message from ${name}`,   // shows sender’s name
      text:
    `Name : ${name}
    Email: ${email}
    
    ${message}`,
      html: `
        <p><strong>Name :</strong> ${name}<br>
           <strong>Email:</strong> ${email}</p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    

    return res.status(200).json({ message: 'Mail sent!' });
  } catch (err) {
    console.error('Nodemailer error:', err);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.get('/patients', async (req, res) => {
  try {
    // Fetch users where the role is 'user' (exclude admins/doctors)
    const patients = await User.find({ role: 'user' }).select('firstname email phonenumber');
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patient records.' });
  }
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
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' }); // Return specific error message if email is found
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
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
    res.status(500).json({ error: 'Something went wrong during signup.' }); // General error message
  }
});


app.get('/success', (req, res) => {
  res.render('success', { username: 'Guest' });
});


app.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', { username: 'Guest' });
});

app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Store email in session
    req.session.resetEmail = email;

    res.status(200).json({ message: 'Redirecting to reset password' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});



app.get('/resetpassword', (req, res) => {
  res.render('resetpassword', { username: 'Guest' });
});

app.post('/resetpassword', async (req, res) => {
  const { newPassword } = req.body;
  const email = req.session.resetEmail;

  if (!email) {
    return res.status(400).json({ message: 'No email in session.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, {
      password: hashedPassword,
    });

    req.session.resetEmail = null; // Clear session

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Failed to reset password.' });
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

app.get('/appointment', (req, res) => {
  res.render('appointment'); 
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
app.post('/appointment', async (req, res) => {
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
app.get('/appointments', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Fetch all appointments (or filter based on user if needed)
    const appointments = await Appointment.find()
      .select('fullname email phone datetime details status')
      .sort({ datetime: 1 }); // Sort by date

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
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
