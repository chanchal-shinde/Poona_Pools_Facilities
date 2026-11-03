/**
 * ==============================================================================
 * CENTRAL API CLIENT (src/services/api.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This module centralizes all HTTP communication between the React frontend
 * and the Express REST API.
 * 
 * Key Features:
 * - Always sends `credentials: 'include'` so HttpOnly cookies are attached
 *   to every request (essential for cross-origin JWT session persistence).
 * - Sends `X-Requested-With: 'XMLHttpRequest'` custom header for CSRF defense.
 * - Reads API URL from `import.meta.env.VITE_API_URL` (defaults to http://localhost:5000).
 * - Provides convenient helpers: api.get, api.post, api.put, api.patch, api.delete.
 * ==============================================================================
 */

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Generic fetch wrapper with standardized error handling and credentials.
 * @param {string} endpoint - API path (e.g., '/api/auth/login')
 * @param {object} options - Fetch options (method, body, headers, params, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  // Extract params so it doesn't get forwarded into fetch RequestInit
  const { params, ...fetchOptions } = options;

  let queryString = '';
  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      queryString = (endpoint.includes('?') ? '&' : '?') + qs;
    }
  }

  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };

  const config = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers
    },
    // CRITICAL: Must be 'include' to transmit HttpOnly cookies across origins
    credentials: 'include'
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Parse JSON safely
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If it's a network error (e.g. backend server is not running)
    if (!error.status) {
      error.message = 'Unable to connect to the backend server. Please verify the API is running.';
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  getBaseUrl: () => API_BASE_URL
};

export default api;

