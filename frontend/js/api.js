/**
 * api.js -- thin fetch wrapper shared by every page.
 * All requests use credentials: 'include' so the httpOnly JWT cookie is
 * sent/received correctly, including when the frontend and API share the
 * same origin (recommended) or a configured CORS origin.
 */

const API_BASE = '/api';

/**
 * Performs a fetch call against the API and returns parsed JSON.
 * Throws an Error with a human-readable message on failure so callers
 * can catch it and show it in the UI.
 */
async function apiRequest(path, options = {}) {
  const finalOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, finalOptions);
  } catch (networkErr) {
    throw new Error('Could not reach the server. Please check your connection and try again.');
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message = (data && data.error) || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

const api = {
  get: (path) => apiRequest(path, { method: 'GET' }),
  post: (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body || {}) })
};
