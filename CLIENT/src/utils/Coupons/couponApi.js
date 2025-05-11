// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Ajuste conforme sua configuração
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  try {
    const response = await api.get('/Dashboard/products'); // Ajuste o endpoint conforme sua rota
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/Dashboard/categories'); // Ajuste o endpoint conforme sua rota
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCoupon = async (couponData, csrfToken) => {
  const response = await axios.post('/coupons', couponData, {
    withCredentials: true,
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
