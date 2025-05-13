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
  const [coupons, setCoupons] = useState([]); // Novo estado para os cupons
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

  // Nova função para buscar os cupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = await fetchCsrfToken();
      const response = await axios.get('/coupons', {
        headers: {
          'X-CSRF-Token': token,
        },
        withCredentials: true,
      });

      // Processa os cupons para adicionar status
      const processedCoupons = response.data.data.map((coupon) => {
        let status = 'active';
        if (!coupon.isActive) {
          status = 'inactive';
        } else if (coupon.currentUses >= coupon.maxUses) {
          status = 'used';
        } else if (new Date(coupon.expirationDate) <= new Date()) {
          status = 'expired';
        }
        return { ...coupon, status };
      });

      setCoupons(processedCoupons);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchCoupons(), // Adiciona a busca de cupons
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
      let token = csrfToken;
      if (!token) {
        token = await fetchCsrfToken();
      }

      const response = await createCoupon(couponData, token);
      toast.success('Cupom criado com sucesso!');
      await fetchCoupons(); // Atualiza a lista de cupons após criação
      return response;
    } catch (err) {
      setError(err);
      if (
        err.response?.status === 403 &&
        err.response?.data?.error?.includes('CSRF')
      ) {
        toast.warning('Sessão expirada. Tentando novamente...');
        try {
          const newToken = await fetchCsrfToken();
          const retryResponse = await createCoupon(couponData, newToken);
          await fetchCoupons(); // Atualiza a lista após sucesso
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
    fetchCsrfToken();
    loadData();
  }, []);

  return {
    products,
    categories,
    coupons, // Adiciona os cupons no retorno
    loading,
    error,
    createCoupon: handleCreateCoupon,
    refreshData: loadData,
    refreshCoupons: fetchCoupons, // Nova função para atualizar apenas cupons
    csrfToken,
  };
};

export default useCoupons;
