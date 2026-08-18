/**
 * profile.js -- protected profile page logic. Redirects to login.html if
 * the user is not authenticated, otherwise displays username and email.
 */

function initialsFromUsername(username) {
  if (!username) return '?';
  return username.trim().charAt(0).toUpperCase();
}

function escapeHtmlProfile(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

async function initProfilePage() {
  const container = document.getElementById('profile-container');
  if (!container) return; // Not on the profile page.

  const user = await requireAuth();
  if (!user) return; // requireAuth already redirected to login.html.

  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${escapeHtmlProfile(initialsFromUsername(user.username))}</div>
      <h1>${escapeHtmlProfile(user.username)}</h1>
      <p style="color: var(--color-text-muted); margin-top: -0.5rem;">Your account details</p>

      <div class="profile-field">
        <div class="label">Username</div>
        <div class="value">${escapeHtmlProfile(user.username)}</div>
      </div>
      <div class="profile-field">
        <div class="label">Email</div>
        <div class="value">${escapeHtmlProfile(user.email)}</div>
      </div>

      <button type="button" class="btn-logout" id="profile-logout-btn">Log Out</button>
    </div>
  `;

  const logoutBtn = document.getElementById('profile-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

document.addEventListener('DOMContentLoaded', initProfilePage);
