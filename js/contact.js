/**
 * STACKLY ADVENTURE TOURISM — CONTACT & FAQ SCRIPT (js/contact.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 2. Contact Form Validation
  const contactForm = document.getElementById('adventureContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const destination = document.getElementById('contactDestination');
      const message = document.getElementById('contactMessage');

      // Validate Name
      if (!Validator.isNotEmpty(name.value)) {
        Validator.showError(name, 'Please enter your full name.');
        isValid = false;
      } else {
        Validator.clearError(name);
      }

      // Validate Email
      if (!Validator.isValidEmail(email.value)) {
        Validator.showError(email, 'Please provide a valid email address.');
        isValid = false;
      } else {
        Validator.clearError(email);
      }

      // Validate Phone
      if (!Validator.isValidPhone(phone.value)) {
        Validator.showError(phone, 'Please provide a valid contact number.');
        isValid = false;
      } else {
        Validator.clearError(phone);
      }

      // Validate Destination
      if (!Validator.isNotEmpty(destination.value)) {
        Validator.showError(destination, 'Please select your destination of interest.');
        isValid = false;
      } else {
        Validator.clearError(destination);
      }

      // Validate Message
      if (!Validator.isMinLength(message.value, 10)) {
        Validator.showError(message, 'Please provide a brief message of at least 10 characters.');
        isValid = false;
      } else {
        Validator.clearError(message);
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          contactForm.reset();
          showToast('Inquiry Received!', 'Thank you! Your travel specialist will contact you with package details shortly.', 'accent');
        }, 1200);
      }
    });

    // Clear inline errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => Validator.clearError(input));
    });
  }
});
