// Get the correct API URL based on environment
const getAPIUrl = () => {
  // If explicitly set in env
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }

  // In production, use same origin (current domain)
  return window.location.origin;
};

export const API_URL = getAPIUrl();

export default {
  API_URL
};
