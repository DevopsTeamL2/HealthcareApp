document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector("button[type='submit']");
    submitButton.disabled = true;

    const email = document.getElementById('email-input').value;

    fetch('http://localhost:3000/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Password reset link sent to your email.");
            window.location.href = "/login";
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    })
    .finally(() => {
        submitButton.disabled = false;
    });
});
