// Get the correct API base URL based on environment
export const getApiBaseUrl = (): string => {
  // In browser environment
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return 'https://rs-10-convert-one-million-production.up.railway.app';
    }
    // In development, use localhost
    return 'http://localhost:5000';
  }
  
  // Server-side rendering fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};
