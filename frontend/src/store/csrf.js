export const csrfFetch = async (url, options = {}) => {
  options.method = options.method || 'GET';

  options.headers = options.headers || {};

  // If the method is not GET, attach the XSRF-TOKEN header
  if (options.method.toUpperCase() !== 'GET') {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      options.headers['XSRF-TOKEN'] = token;
    }
  }

  // Always send JSON headers if sending a body
  if (options.body && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }

  options.credentials = 'include'; // Include cookies

  const res = await fetch(url, options);

  if (!res.ok) throw res;

  return res;
};

// Helper to get a cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// src/store/csrf.js
export const restoreCSRF = async () => {
  const res = await fetch('/api/csrf/restore', {
    credentials: 'include',
  });
  return res;
};
// frontend/src/App.js