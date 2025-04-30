document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('error-message');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const email = emailInput.value;
      const password = passwordInput.value;
  
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          errorMessage.innerText = data.error;
        } else {
          window.location.href = "/landingpage";
        }
      })
      .catch(err => {
        errorMessage.innerText = "An error occurred.";
        console.error("Login error:", err);
      });
    });
  });
  