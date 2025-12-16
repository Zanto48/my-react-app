import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Health API
export const healthAPI = {
    create: (data) => api.post('/health', data),
    getAll: () => api.get('/health'),
    getLatest: () => api.get('/health/latest'),
    getDashboard: () => api.get('/health/dashboard'),
    getGraph: (period) => api.get(`/health/graph/${period}`),
};

// Symptoms API
export const symptomsAPI = {
    getList: () => api.get('/symptoms/list'),
    log: (data) => api.post('/symptoms', data),
    logBatch: (data) => api.post('/symptoms/batch', data),
    getHistory: () => api.get('/symptoms/history'),
    getStats: () => api.get('/symptoms/stats'),
};

// Family API
export const familyAPI = {
    invite: (data) => api.post('/family/invite', data),
    getMembers: () => api.get('/family/members'),
    getRequests: () => api.get('/family/requests'),
    approve: (id) => api.put(`/family/approve/${id}`),
    reject: (id) => api.put(`/family/reject/${id}`),
    getMemberHealth: (id) => api.get(`/family/${id}/health`),
    remove: (id) => api.delete(`/family/${id}`),
};

// Recommendations API
export const recommendationsAPI = {
    getFood: () => api.get('/recommendations/food'),
    getExercise: () => api.get('/recommendations/exercise'),
    getEmotional: () => api.get('/recommendations/emotional'),
};

export default api;
