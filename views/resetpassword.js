// Import Firebase Authentication and Initialisation methods
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAANjSu4SxpEelQ4I4Hq4lT5NmtrF1sW0k",
    authDomain: "devopsproject-1ea1e.firebaseapp.com",
    projectId: "devopsproject-1ea1e",
    storageBucket: "devopsproject-1ea1e.firebasestorage.app",
    messagingSenderId: "298538714309",
    appId: "1:298538714309:web:dc9ed7c397d2794b3c1cac",
    measurementId: "G-3RWN0KTH6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get the form element that contains the reset password form
const form = document.getElementById('reset-form');

// Add an event listener to handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from reloading the page upon submission

    // Disable the submit button to prevent multiple form submissions while the request is in progress
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;  // Disable the button to prevent multiple submissions

    // Get the email entered by the user in the input field
    const email = document.getElementById('email-input').value;

    // Call Firebase's sendPasswordResetEmail function to send a reest link to the user's email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // If the email is successfully sent, show an alert to inform the user
            alert("Password reset link sent to your email.");
            // Redirect the user to the login page after sending the reset link
            window.location.href = "login.ejs";
        })
        .catch((error) => {
            // If an error occurs (e.g., invalid email), show an error message
            alert("Error: " + error.message);
        })
        .finally(() => {
            // Re-enable the submit button regardless of success or failure
            submitButton.disabled = false; 
        });
});
