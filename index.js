const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (like CSS, JavaScript, images)
app.use(express.static(path.join(__dirname, 'public')));

// Define routes here

// Home route
app.get('/', (req, res) => {
    res.render('index', { username: 'Hetvi' });
  });
  
  // Contact route
  app.get('/contact', (req, res) => {
    res.render('contact', { username: 'Guest' });
  });
  
  // Emergency route
  app.get('/emergency', (req, res) => {
    res.render('emergency', { username: 'Guest' });
  });
  
  // Login route
  app.get('/login', (req, res) => {
    res.render('login', { username: 'Guest' });
  });
  
  // Signup route
  app.get('/signup', (req, res) => {
    res.render('signup', { username: 'Guest' });
  });
  
  // Appointment route
  app.get('/appointment', (req, res) => {
    res.render('appointment', { username: 'Guest' });
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
