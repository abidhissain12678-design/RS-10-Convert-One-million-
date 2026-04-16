/**
 * Central API Configuration
 * Manages base URL for all API requests
 * 
 * Set NEXT_PUBLIC_API_URL in Vercel environment variables to change the backend:
 * - Development: http://localhost:5000
 * - Production: https://rs-10-convert-one-million.onrender.com
 */

// Get base URL from environment variable or use default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rs-10-convert-one-million.onrender.com';

/**
 * Fetch wrapper that automatically includes auth token and base URL
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit & { body?: any } = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Convert body object to JSON string
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  return response;
}

/**
 * Helper to make GET requests
 */
export async function apiGet(endpoint: string) {
  return apiFetch(endpoint, { method: 'GET' });
}

/**
 * Helper to make POST requests
 */
export async function apiPost(endpoint: string, body: any) {
  return apiFetch(endpoint, { method: 'POST', body });
}

/**
 * Helper to make PUT requests
 */
export async function apiPut(endpoint: string, body: any) {
  return apiFetch(endpoint, { method: 'PUT', body });
}

/**
 * Helper to make DELETE requests
 */
export async function apiDelete(endpoint: string) {
  return apiFetch(endpoint, { method: 'DELETE' });
}

export default {
  API_BASE_URL,
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
