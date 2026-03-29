const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensures the URL ends with /api (without trailing slash)
export const API_BASE = base.endsWith('/api') 
    ? base.replace(/\/$/, '') 
    : `${base.replace(/\/$/, '')}/api`;
