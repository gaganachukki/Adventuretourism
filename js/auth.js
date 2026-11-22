/**
 * STACKLY ADVENTURE TOURISM — AUTH SCRIPT (js/auth.js)
 * Frontend demonstration authentication with role-based redirection
 */

document.addEventListener('DOMContentLoaded', () => {
  // GSAP Entrance Animations for Auth Split-Screen
  if (typeof gsap !== 'undefined') {
    gsap.from('.auth-visual-side', {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'all'
    });
    gsap.from('.auth-card', {
      opacity: 0,
      y: 30,
      duration: 0.85,
      delay: 0.15,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }

  // Password Visibility Toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else if (input) {
        input.type = 'password';
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });
  });

  // Role Radio Card Selector
  document.querySelectorAll('.role-radio-label').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.role-radio-label').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      const radio = label.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // ==================== LOGIN FORM ====================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // Check if redirect query or saved role exists
    const urlParams = new URLSearchParams(window.location.search);
    const prefillRole = urlParams.get('role');
    if (prefillRole) {
      const targetRadio = document.querySelector(`input[name="authRole"][value="${prefillRole}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
        targetRadio.closest('.role-radio-label').classList.add('selected');
      }
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const selectedRoleRadio = document.querySelector('input[name="authRole"]:checked');
      const role = selectedRoleRadio ? selectedRoleRadio.value : 'Client';

      if (!Validator.isValidEmail(emailInput.value)) {
        Validator.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        Validator.clearError(emailInput);
      }

      if (!Validator.isNotEmpty(passwordInput.value)) {
        Validator.showError(passwordInput, 'Please enter your password.');
        isValid = false;
      } else {
        Validator.clearError(passwordInput);
      }

      if (isValid) {
        const submitBtn = loginForm.querySelector('.auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

        const userObj = {
          name: emailInput.value.split('@')[0].toUpperCase(),
          email: emailInput.value,
          role: role,
          loggedInAt: new Date().toISOString()
        };

        Storage.setSession(userObj);

        setTimeout(() => {
          showToast('Login Successful', `Welcome back, ${userObj.name}! Directing to your ${role} dashboard...`, 'accent');
          setTimeout(() => {
            if (role === 'Admin') {
              window.location.href = 'AdminDashboard.html';
            } else {
              window.location.href = 'ClientDashboard.html';
            }
          }, 800);
        }, 1000);
      }
    });
  }

  // ==================== SIGNUP FORM ====================
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('signupName');
      const emailInput = document.getElementById('signupEmail');
      const passwordInput = document.getElementById('signupPassword');
      const confirmInput = document.getElementById('signupConfirmPassword');
      const termsCheck = document.getElementById('signupTerms');
      const selectedRoleRadio = document.querySelector('input[name="authRole"]:checked');
      const role = selectedRoleRadio ? selectedRoleRadio.value : 'Client';

      if (!Validator.isNotEmpty(nameInput.value)) {
        Validator.showError(nameInput, 'Full Name is required.');
        isValid = false;
      } else {
        Validator.clearError(nameInput);
      }

      if (!Validator.isValidEmail(emailInput.value)) {
        Validator.showError(emailInput, 'Please enter a valid email.');
        isValid = false;
      } else {
        Validator.clearError(emailInput);
      }

      if (!Validator.isMinLength(passwordInput.value, 6)) {
        Validator.showError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        Validator.clearError(passwordInput);
      }

      if (passwordInput.value !== confirmInput.value) {
        Validator.showError(confirmInput, 'Passwords do not match.');
        isValid = false;
      } else {
        Validator.clearError(confirmInput);
      }

      if (!termsCheck.checked) {
        showToast('Required', 'Please accept the Terms & Conditions to proceed.');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = signupForm.querySelector('.auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

        const newUser = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          role: role,
          createdAt: new Date().toISOString()
        };

        const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
        existingUsers.push(newUser);
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(existingUsers));

        setTimeout(() => {
          showToast('Account Created!', 'Registration successful. Please log in with your credentials.', 'accent');
          setTimeout(() => {
            window.location.href = `Login.html?role=${role}`;
          }, 1000);
        }, 1200);
      }
    });
  }
});

// Logout utility
function logoutUser() {
  if (typeof Storage !== 'undefined') {
    Storage.clearSession();
  }
  showToast('Logged Out', 'Your session has ended. Redirecting...');
  setTimeout(() => {
    window.location.href = 'Login.html';
  }, 700);
}
