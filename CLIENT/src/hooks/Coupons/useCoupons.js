import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  fetchProducts,
  fetchCategories,
  createCoupon,
} from '../../utils/Coupons/couponApi';
import { toast } from 'react-toastify';

const useCoupons = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');

  // Função para obter o token CSRF
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token', {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrfToken);
      return response.data.csrfToken;
    } catch (err) {
      console.error('Erro ao buscar CSRF token:', err);
      throw err;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      setLoading(true);

      // Garante que temos um token CSRF válido
      let token = csrfToken;
      if (!token) {
        token = await fetchCsrfToken();
      }

      const response = await createCoupon(couponData, token); // Passa o token CSRF
      toast.success('Cupom criado com sucesso!');
      return response;
    } catch (err) {
      setError(err);

      // Tratamento especial para erro de CSRF
      if (
        err.response?.status === 403 &&
        err.response?.data?.error?.includes('CSRF')
      ) {
        toast.warning('Sessão expirada. Tentando novamente...');
        try {
          // Tenta renovar o token e enviar novamente
          const newToken = await fetchCsrfToken();
          const retryResponse = await createCoupon(couponData, newToken);
          toast.success('Cupom criado com sucesso!');
          return retryResponse;
        } catch (retryErr) {
          toast.error('Erro ao criar cupom. Por favor, recarregue a página.');
          throw retryErr;
        }
      } else {
        toast.error(err.response?.data?.message || 'Erro ao criar cupom');
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca o token CSRF quando o componente monta
    fetchCsrfToken();
    loadData();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    createCoupon: handleCreateCoupon,
    refreshData: loadData,
    csrfToken, // Opcional: expor o token se necessário
  };
};

export default useCoupons;
