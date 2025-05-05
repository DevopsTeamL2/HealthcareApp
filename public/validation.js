document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const firstname_input = document.getElementById('firstnameInput');
    const email_input = document.getElementById('emailInput');
    const password_input = document.getElementById('passwordInput');
    const repeat_password_input = document.getElementById('repeatPasswordInput');
    const phone_number_input = document.getElementById('phoneNumberInput');
    const error_message = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous error message
        error_message.innerText = '';

        let errors = getSignUpFormErrors(
            firstname_input.value,
            email_input.value,
            password_input.value,
            repeat_password_input.value,
            phone_number_input.value
        );

        if (errors.length > 0) {
            error_message.innerText = errors.join(". ");
        } else {
            // Proceed with form submission
            const formData = {
                firstname: firstname_input.value,
                email: email_input.value,
                password: password_input.value,
                repeatpassword: repeat_password_input.value,
                phonenumber: phone_number_input.value,
            };

            fetch('/index', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    error_message.innerText = data.error;  // Display error message from backend (like "Email already in use")
                } else {
                    alert("Signed up successfully!");
                    window.location.href = "/login";  // Redirect after successful signup
                }
            })
            .catch(error => {
                error_message.innerText = "Error: " + error.message;  // Display fetch failure error
            });
        }
    });

    function getSignUpFormErrors(firstname, email, password, repeatpassword, phonenumber) {
        let errors = [];

        if (!firstname) errors.push("First Name is required");
        if (!email) errors.push("Email is required");
        if (!password) errors.push("Password is required");
        if (password !== repeatpassword) errors.push("Passwords do not match");
        if (!phonenumber) errors.push("Phone Number is required");

        return errors;
    }
});
