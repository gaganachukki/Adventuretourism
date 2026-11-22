/**
 * STACKLY ADVENTURE TOURISM — FORM VALIDATOR (js/validation.js)
 * Clean reusable field-level validators
 */

const Validator = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPhone(phone) {
    const cleaned = String(phone).replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 7 && /^\d+$/.test(cleaned);
  },

  isNotEmpty(val) {
    return val !== null && val !== undefined && String(val).trim().length > 0;
  },

  isMinLength(val, min) {
    return String(val).trim().length >= min;
  },

  showError(inputEl, message) {
    const formGroup = inputEl.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.add('has-error');
    let errEl = formGroup.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'form-error';
      formGroup.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
  },

  clearError(inputEl) {
    const formGroup = inputEl.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('has-error');
    const errEl = formGroup.querySelector('.form-error');
    if (errEl) errEl.style.display = 'none';
  }
};
