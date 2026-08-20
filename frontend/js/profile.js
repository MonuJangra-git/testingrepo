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

function formatJoinedDate(dateValue) {
  if (!dateValue) return 'Recently joined';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return 'Recently joined';
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function initProfilePage() {
  const container = document.getElementById('profile-container');
  if (!container) return; // Not on the profile page.

  const user = await requireAuth();
  if (!user) return; // requireAuth already redirected to login.html.

  const joinedAt = formatJoinedDate(user.createdAt);

  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${escapeHtmlProfile(initialsFromUsername(user.username))}</div>
      <h1>${escapeHtmlProfile(user.username)}</h1>
      <p class="profile-subtitle">Account overview and preferences</p>

      <div class="profile-metrics" aria-label="Profile highlights">
        <div class="profile-metric-item">
          <span class="metric-label">Member since</span>
          <span class="metric-value">${escapeHtmlProfile(joinedAt)}</span>
        </div>
        <div class="profile-metric-item">
          <span class="metric-label">Status</span>
          <span class="metric-value">Active</span>
        </div>
      </div>

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
