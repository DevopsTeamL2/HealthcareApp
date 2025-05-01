document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Send the login request to the backend
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      // Check for login success and role
      if (response.ok) {
        if (result.role === 'doctor') {
          window.location.href = '/doctordashboard';
        } else {
          window.location.href = '/landingpage';
        }
      } else {
        errorMessage.innerText = result.error;  // Display error message if login fails
      }
    } catch (err) {
      errorMessage.innerText = "An error occurred.";
      console.error("Login error:", err);
    }
  });
});
