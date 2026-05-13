var registerForm = document.getElementById('register-form');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var confirmInput = document.getElementById('confirm');
var phoneInput = document.getElementById('phone');
var submitButton = document.getElementById('register-submit');
var successMessage = document.getElementById('register-success');
var strengthBar = document.getElementById('strength-bar');
var strengthText = document.getElementById('strength-text');

var nameError = document.getElementById('name-error');
var emailError = document.getElementById('email-error');
var passwordError = document.getElementById('password-error');
var confirmError = document.getElementById('confirm-error');
var phoneError = document.getElementById('phone-error');

function validateName() {
  var value = nameInput.value.trim();
  if (!value) {
    nameError.textContent = 'Name is required';
    return false;
  }
  if (value.length < 2) {
    nameError.textContent = 'Name must be at least 2 characters';
    return false;
  }
  nameError.textContent = '';
  return true;
}

function validateEmail() {
  var value = emailInput.value.trim();
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    emailError.textContent = 'Email is required';
    return false;
  }
  if (!pattern.test(value)) {
    emailError.textContent = 'Enter a valid email';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validatePassword() {
  var value = passwordInput.value;
  var lengthOk = value.length >= 8;
  var upperOk = /[A-Z]/.test(value);
  var numberOk = /[0-9]/.test(value);
  var specialOk = /[^A-Za-z0-9]/.test(value);

  if (!value) {
    passwordError.textContent = 'Password is required';
    updateStrength(0);
    return false;
  }
  if (!lengthOk || !upperOk || !numberOk || !specialOk) {
    passwordError.textContent = 'Password must be 8+, include uppercase, number, and special';
    updateStrength(value.length ? 1 : 0);
    return false;
  }

  passwordError.textContent = '';
  updateStrength(3);
  return true;
}

function validateConfirm() {
  var value = confirmInput.value;
  if (!value) {
    confirmError.textContent = 'Confirm password is required';
    return false;
  }
  if (value !== passwordInput.value) {
    confirmError.textContent = 'Passwords do not match';
    return false;
  }
  confirmError.textContent = '';
  return true;
}

function validatePhone() {
  var value = phoneInput.value.trim();
  var pattern = /^\+?[0-9\s\-]{7,20}$/;
  if (!value) {
    phoneError.textContent = 'Phone is required';
    return false;
  }
  if (!pattern.test(value)) {
    phoneError.textContent = 'Enter a valid phone number';
    return false;
  }
  phoneError.textContent = '';
  return true;
}

function updateStrength(score) {
  var width = '0%';
  var color = '#ccc';
  var text = 'Password strength';

  if (score === 1) {
    width = '30%';
    color = '#e07a5f';
    text = 'Password strength: weak';
  } else if (score === 2) {
    width = '65%';
    color = '#f4d35e';
    text = 'Password strength: medium';
  } else if (score === 3) {
    width = '100%';
    color = '#4caf50';
    text = 'Password strength: strong';
  }

  strengthBar.style.width = width;
  strengthBar.style.background = color;
  strengthText.textContent = text;
}

function getPasswordScore() {
  var value = passwordInput.value;
  var score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function updateFormState() {
  var valid = validateName() && validateEmail() && validatePassword() && validateConfirm() && validatePhone();
  submitButton.disabled = !valid;
}

function handleInput() {
  validateName();
  validateEmail();
  validatePassword();
  validateConfirm();
  validatePhone();
  updateStrength(getPasswordScore());
  updateFormState();
}

nameInput.addEventListener('input', handleInput);
emailInput.addEventListener('input', handleInput);
passwordInput.addEventListener('input', function () {
  validatePassword();
  validateConfirm();
  updateStrength(getPasswordScore());
  updateFormState();
});
confirmInput.addEventListener('input', handleInput);
phoneInput.addEventListener('input', handleInput);

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', function () {
  validatePassword();
  validateConfirm();
});
confirmInput.addEventListener('blur', validateConfirm);
phoneInput.addEventListener('blur', validatePhone);

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!submitButton.disabled) {
    successMessage.textContent = 'Registration successful!';
    registerForm.reset();
    updateStrength(0);
    submitButton.disabled = true;
  }
});

updateStrength(0);
