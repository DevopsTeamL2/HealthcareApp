document.getElementById('forgot-password-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;

    // Send the email to the server and redirect
    const response = await fetch('/forgotpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
        // Redirect to reset password page
        window.location.href = '/resetpassword';
    } else {
        alert(data.message || 'Something went wrong.');
    }
});
