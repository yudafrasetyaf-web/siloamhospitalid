export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use current host
    return window.location.origin;
  }
  // In SSR, use environment variable or default to localhost
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};
