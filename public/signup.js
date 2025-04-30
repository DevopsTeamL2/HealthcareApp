document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect the data from the form
    const formData = {
        firstname: document.getElementById('firstnameInput').value,
        email: document.getElementById('emailInput').value,
        password: document.getElementById('passwordInput').value,
        repeatpassword: document.getElementById('repeatPasswordInput').value,
        phonenumber: document.getElementById('phoneNumberInput').value
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
            window.location.href = "/login";
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
});
