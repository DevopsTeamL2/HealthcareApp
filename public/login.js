document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate email and password fields
        if (!email || !password) {
            errorMessage.innerText = "Both email and password are required!";
            return;
        }

        // Send the login request
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorMessage.innerText = data.error; // Display server-side error message
            } else {
                window.location.href = "/landingpage"; // Redirect if login is successful
            }
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
    });
});
