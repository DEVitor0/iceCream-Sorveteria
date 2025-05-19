import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Removi '/api' pois suas rotas começam diretamente com '/coupons'
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

// Função para buscar cupons (substitui fetchProducts e fetchCategories)
export const fetchCoupons = async () => {
  try {
    const response = await api.get('/coupons'); // Endpoint correto para cupons
    return response.data.data || response.data; // Ajuste conforme a estrutura da resposta
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const createCoupon = async (couponData, csrfToken) => {
  try {
    const response = await api.post('/coupons', couponData, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

// Adicione outras operações CRUD para cupons conforme necessário
export const updateCoupon = async (id, couponData, csrfToken) => {
  try {
    const response = await api.put(`/coupons/${id}`, couponData, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
};

export const deleteCoupon = async (id, csrfToken) => {
  try {
    const response = await api.delete(`/coupons/${id}`, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
};

// Adicione estas funções no seu couponApi.js
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products'); // Ajuste o endpoint conforme sua API
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories'); // Ajuste o endpoint conforme sua API
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
