// Get references to the form and input elements
const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const phone_number_input = document.getElementById('phone-number-input')
const error_message = document.getElementById('error-message')

// Add an event listener for form submission
form.addEventListener('submit', (e) => {

    // Initialise an empty array to collect error messages
    let errors = []

    if (firstname_input) {
        // If we have a firstname input, it's a sign-up form
        errors = getSignUpFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value, phone_number_input.value)
    }
    else {
        // If we don't have a firstname input, it's a login form
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    // If there are errors, prevent the form from submitting and display the errors
    if (errors.length > 0) {
        // If there are any errors
        e.preventDefault() // Prevent form submission
        error_message.innerText = errors.join(". ") // Display the errors in the error message element
    }
})

// Function to validate the sign-up form
function getSignUpFormErrors(firstName, email, password, repeatPassword, phoneNumber) {
    // Initiialise an empty array to store errors
    let errors = []

    // Check if the first name is empty or null
    if (firstName === '' || firstName == null) {
        errors.push('First Name is required')
        firstname_input.parentElement.classList.add('incorrect') // Highlight the input as incorrect
    }

    // Check if the email is empty or null
    if (email === '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }

    // Check if the password is empty or null
    if (password === '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    // Check if the repeat password is empty or null
    if (repeatPassword === '' || repeatPassword == null) {
        errors.push('Password is required')
        repeat_password_input.parentElement.classList.add('incorrect')
    }

    // Check if the phone number is empty or null
    if (phoneNumber === '' || phoneNumber == null) {
        errors.push('Phone Number is required')
        phone_number_input.parentElement.classList.add('incorrect')
    }

    // Check if the password is less than 8 characters
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }

    // Check if the password and repeat password match
    if (password !== repeatPassword) {
        errors.push('Password does not match repeated password')
        password_input.parentElement.classList.add('incorrect')
        repeat_password_input.parentElement.classList.add('incorrect')

    }

    return errors; // Return the errors array
}

// Function to validate the login form
function getLoginFormErrors(email, password) {
    
    // Initialise an empty array to store errors
    let errors = []

    // Check if the email is empty or null
    if (email === '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }

    // Check if the password is empty or null
    if (password === '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors; // Return the errors array
}

// Create an array of all input elements that are part of the form
const allInputs = [firstname_input, email_input, password_input, repeat_password_input, phone_number_input].filter(input => input != null)

// Add an event listener to each input field to remove the 'incorrect' class when the user starts typing
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = '' // Clear the error message
        }
    })
})