// Import the necessary Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; // Corrected import here

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

// Initialise Firebase app using the provided configuration
const app = initializeApp(firebaseConfig);
// Set up references to the Firebase Realtime Database and Authentication services
const db = getDatabase();
const auth = getAuth(app);

// Event listener for the form submission
const form = document.getElementById('form'); // Get the form element by its ID
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the page from reloading upon form submission

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;  // Disable the button to prevent multiple submissions

    // Retrieve values entered in the form fields
    const firstname = document.getElementById('firstname-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const repeatPassword = document.getElementById('repeat-password-input').value;
    const phoneNumber = document.getElementById('phone-number-input').value;

    // Perform Firebase authentication to create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => { // If user creation is successful
            const user = userCredential.user; // Get the newly created user object

            // Save additional user information to the Firebase Realtime Database
            set(ref(db, 'users/' + user.uid), {
                firstname: firstname,
                email: email,
                phoneNumber: phoneNumber,
            })
                .then(() => { // If the data is successfully saved to the database
                    form.reset(); // Reset the form fields
                    submitButton.disabled = false;  // Re-enable the submit button
                })
                .catch((error) => { // If there's an error saving to the database
                    submitButton.disabled = false;  // Re-enable the submit button even if there's an error
                });
        })
        .catch((error) => { // If there's an error during the authentication process
            submitButton.disabled = false;  // Re-enable the submit button after the error
        });
});
