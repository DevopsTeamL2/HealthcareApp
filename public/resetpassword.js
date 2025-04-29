form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;

    const email = document.getElementById('email-input').value;

    fetch('http://localhost:3000/reset-password', {
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
