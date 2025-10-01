import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:5000';
const API_BACKEND_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const api = axios.create({
  baseURL: API_BACKEND_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    return Promise.reject(error);
  }
);
