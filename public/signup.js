document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect the data from the form
    const formData = {
        firstName: document.getElementById('firstname-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
        phoneNumber: document.getElementById('phone-number-input').value
    };

    // Send a POST request to /index
    fetch('http://localhost:3000/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Signed up successfully!");
            window.location.href = "/login"; // Redirect to login page after successful signup
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
});
