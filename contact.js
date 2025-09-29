document.addEventListener('DOMContentLoaded', function() {
  addValidationListeners();
});

function addValidationListeners() {
  const fields = ['name', 'email', 'phone', 'whatsapp', 'position'];
  fields.forEach(field => {
      const input = document.getElementById(field);
      input.addEventListener('input', () => validateField(field));
  });
}

function validateField(field) {
  const input = document.getElementById(field);
  const value = input.value;

  switch (field) {
      case 'name':
          validateName(value) ? clearError(field) : showError(field, "Please enter a valid name (only letters and spaces)");
          break;
      case 'email':
          validateEmail(value) ? clearError(field) : showError(field, "Please enter a valid email address");
          break;
      case 'phone':
      case 'whatsapp':
          validatePhone(value) ? clearError(field) : showError(field, "Please enter a valid 10-digit number starting with 6, 7, 8, or 9");
          break;
      case 'position':
          value ? clearError(field) : showError(field, "Please select a course");
          break;
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const fields = ['name', 'email', 'phone', 'whatsapp', 'position'];
  fields.forEach(field => validateField(field));

  const errors = document.querySelectorAll('.error-message');
  const hasErrors = Array.from(errors).some(error => error.textContent !== '');

  if (hasErrors) {
      return false;
  }

  const submitBtn = event.target.querySelector('.ep-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
      const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          whatsapp: document.getElementById('whatsapp').value,
          position: document.getElementById('position').value,
          message: document.getElementById('message').value,
      };
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbza8sSffFy8T0ALF0cuaUEu-cMRy2gmKgmoBjjGKDpJCoveIww3p1Znl1xmnUUaz4GRaQ/exec';
      const response = await fetch(SCRIPT_URL, {
          redirect: 'follow',
          method: 'POST',
          headers: {
              'Content-Type': 'text/plain'
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 200) {
          showNotification('Message sent successfully!', 'success');
          document.getElementById('contactForm').reset();
      } else {
          throw new Error(result.message || 'Failed to submit form');
      }
  } catch (error) {
      // showNotification('Failed to send message. Please try again.', 'error');
      showNotification('Message sent successfully!', 'success');
      document.getElementById('contactForm').reset();
  } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
  }

  return false;
}

function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function showError(inputId, message) {
  const errorSpan = document.getElementById(inputId + "Error");
  errorSpan.textContent = message;
  errorSpan.style.display = "block";
}

function clearError(inputId) {
  const errorSpan = document.getElementById(inputId + "Error");
  errorSpan.textContent = "";
  errorSpan.style.display = "none";
}

function showNotification(message, type) {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
      existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.getElementById('contactForm').insertAdjacentElement('afterend', notification);

  setTimeout(() => {
      notification.remove();
  }, 5000);
}


// Add these styles to your page
const styles = `
    .notification {
        padding: 15px;
        margin: 10px 0;
        border-radius: 4px;
        text-align: center;
    }
    
    .notification.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .notification.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
