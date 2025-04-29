const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (like CSS, JavaScript, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Needed to parse JSON body from frontend

// ✅ Email sending route
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gfredibe4@gmail.com',
        pass: 'laru qfsj bjib zjpl'
      }
    });

    const mailOptions = {
      from: email,
      to: 'gfredibe4@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Email failed to send.' });
  }
});


// Routes
app.get('/', (req, res) => {
  res.render('index', { username: 'Hetvi' });
});

app.get('/success', (req, res) => {
  res.render('success', { username: 'Guest' });
});

app.get('/index', (req, res) => {
  res.render('index', { username: 'Guest' });
});

app.get('/login', (req, res) => {
  res.render('login', { username: 'Guest' });
});

app.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', { username: 'Guest' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { username: 'Guest' });
});

app.get('/emergency', (req, res) => {
  res.render('emergency', { username: 'Guest' });
});

app.get('/login', (req, res) => {
  res.render('login', { username: 'Guest' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { username: 'Guest' });
});

app.get('/appointment', (req, res) => {
  res.render('appointment', { username: 'Guest' });
});

app.get('/landingpage', (req, res) => {
  res.render('landingpage', { username: 'Guest' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
