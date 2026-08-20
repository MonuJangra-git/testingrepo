/**
 * auth.js -- authentication helpers shared across all pages.
 * Handles the navbar's logged-in/out state, login/register form submission,
 * logout, and route protection for the profile page.
 */

/**
 * Checks whether the current user is authenticated by calling /api/auth/me.
 * Returns the user object on success, or null if not authenticated.
 * Never throws.
 */
async function checkAuth() {
  try {
    const data = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    return null;
  }
}

/**
 * Updates the shared navbar markup based on auth state.
 * Expects an element with id="nav-dynamic" to exist in the navbar.
 */
function renderNavAuthLinks(user) {
  const slot = document.getElementById('nav-dynamic');
  if (!slot) return;

  if (user) {
    slot.innerHTML = `
      <span class="navbar-username">Hi, ${escapeHtml(user.username)}</span>
      <a href="profile.html">Profile</a>
      <button type="button" id="nav-logout-btn">Logout</button>
    `;
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  } else {
    slot.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html" class="nav-cta">Register</a>
    `;
  }
}

/** Minimal HTML escaping helper to avoid injecting raw user content. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

/** Initializes the navbar on every page. Call this on DOMContentLoaded. */
async function initNavbar() {
  const user = await checkAuth();
  renderNavAuthLinks(user);
  return user;
}

/** Logs the current user out and redirects to the home page. */
async function handleLogout() {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Even if the request fails, proceed to redirect -- cookie will
    // eventually expire on its own after 24h.
    console.error('Logout error:', err);
  }
  window.location.href = 'index.html';
}

/**
 * Guards a page that requires authentication. If the user is not logged
 * in, redirects to login.html. Returns the user object if authenticated.
 */
async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

/** Shows an alert box (error or success) inside a form. */
function showAlert(alertEl, message, type = 'error') {
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = `alert show alert-${type}`;
}

function hideAlert(alertEl) {
  if (!alertEl) return;
  alertEl.className = 'alert';
  alertEl.textContent = '';
}

function setButtonState(button, isBusy, busyText, idleText) {
  if (!button) return;
  button.disabled = isBusy;
  button.textContent = isBusy ? busyText : idleText;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initPasswordToggles() {
  const toggles = document.querySelectorAll('[data-toggle-password]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const inputId = toggle.getAttribute('data-toggle-password');
      const input = inputId ? document.getElementById(inputId) : null;
      if (!input) return;

      const nextType = input.type === 'password' ? 'text' : 'password';
      input.type = nextType;
      toggle.textContent = nextType === 'password' ? 'Show' : 'Hide';
      toggle.setAttribute('aria-label', nextType === 'password' ? 'Show password' : 'Hide password');
    });
  });
}

/** Wires up the login form, if present on the page. */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const alertEl = document.getElementById('form-alert');
  const submitBtn = document.getElementById('login-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertEl);

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showAlert(alertEl, 'Please fill in both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      showAlert(alertEl, 'Please enter a valid email address.');
      return;
    }

    setButtonState(submitBtn, true, 'Logging in...', 'Log In');

    try {
      await api.post('/auth/login', { email, password });
      window.location.href = 'index.html';
    } catch (err) {
      showAlert(alertEl, err.message || 'Login failed. Please try again.');
      setButtonState(submitBtn, false, 'Logging in...', 'Log In');
    }
  });
}

/** Wires up the registration form, if present on the page. */
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const alertEl = document.getElementById('form-alert');
  const submitBtn = document.getElementById('register-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertEl);

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    if (!username || !email || !password) {
      showAlert(alertEl, 'Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      showAlert(alertEl, 'Username must be at least 3 characters long.');
      return;
    }

    if (!isValidEmail(email)) {
      showAlert(alertEl, 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showAlert(alertEl, 'Password must be at least 6 characters long.');
      return;
    }

    if (confirmPasswordInput && confirmPassword !== password) {
      showAlert(alertEl, 'Passwords do not match.');
      return;
    }

    setButtonState(submitBtn, true, 'Creating account...', 'Create Account');

    try {
      await api.post('/auth/register', { username, email, password });
      window.location.href = 'index.html';
    } catch (err) {
      showAlert(alertEl, err.message || 'Registration failed. Please try again.');
      setButtonState(submitBtn, false, 'Creating account...', 'Create Account');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPasswordToggles();
  initLoginForm();
  initRegisterForm();
});
