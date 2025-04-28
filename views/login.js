// Import the necessary functions from the Firebase SDK
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

// The web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAANjSu4SxpEelQ4I4Hq4lT5NmtrF1sW0k",
    authDomain: "devopsproject-1ea1e.firebaseapp.com",
    projectId: "devopsproject-1ea1e",
    storageBucket: "devopsproject-1ea1e.firebasestorage.app",
    messagingSenderId: "298538714309",
    appId: "1:298538714309:web:dc9ed7c397d2794b3c1cac",
    measurementId: "G-3RWN0KTH6W"
};

// Initialize Firebase with the configuration provided
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Form submission event listener for handling login
const form = document.getElementById('form'); // Get the form element by its ID
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behaviour (page reload)

    // Get the submit button to disable it during the login process
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;  // Disable the button to prevent multiple submissions

    // Get the email and password input values from the form
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    // Firebase authentication: attempt to sign in with the provided email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => { // On successful login
            const user = userCredential.user; // Get the user object from the authentication response 
            window.location.href = "/DevOpsProject/homePage/LandingPage.html"; // Redirect the user to the home page after successful login
        })
        .finally(() => {
            submitButton.disabled = false;  // Re-enable the submit button after the login attempt (regardless of success or failure)
        });
});
