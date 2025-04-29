const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const phone_number_input = document.getElementById('phone-number-input');
const error_message = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();

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
        // Example: Submit to server
        const formData = {
            firstName: firstname_input.value,
            email: email_input.value,
            password: password_input.value,
            phoneNumber: phone_number_input.value,
        };

        fetch('/index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
    }
});

function getSignUpFormErrors(firstName, email, password, repeatPassword, phoneNumber) {
    let errors = [];

    if (!firstName) errors.push("First Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (password.length < 8) errors.push("Password must be at least 8 characters");
    if (password !== repeatPassword) errors.push("Passwords do not match");
    if (!phoneNumber) errors.push("Phone Number is required");

    return errors;
}
