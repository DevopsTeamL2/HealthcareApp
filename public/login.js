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
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const email = emailInput.value;
      const password = passwordInput.value;
  
      const isDoctor = (email === 'doctor@gmail.com' && password === 'doctor123');
      const url = isDoctor ? '/doctor-login' : '/login';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          if (result.role === 'doctor') {
            window.location.href = '/doctordashboard';
          } else {
            window.location.href = '/landingpage';
          }
        } else {
          errorMessage.innerText = result.error;
        }
      } catch (err) {
        errorMessage.innerText = "An error occurred.";
        console.error("Login error:", err);
      }
    });
  });
  