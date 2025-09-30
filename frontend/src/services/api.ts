import axios from 'axios';

const API_BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:5000/api';

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
