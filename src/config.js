// API Configuration
// This will automatically use the correct API URL based on environment

const getApiUrl = () => {
    // In production, use the environment variable set by Vercel
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // In development, use localhost
    return 'http://localhost:8080';
};

export const API_URL = getApiUrl();

// Full API base path
export const API_BASE_URL = `${API_URL}/api`;

export default {
    API_URL,
    API_BASE_URL,
};
