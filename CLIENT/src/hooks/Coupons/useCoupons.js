import { useState, useEffect } from 'react';
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
      const response = await createCoupon(couponData);
      toast.success('Cupom criado com sucesso!');
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || 'Erro ao criar cupom');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    createCoupon: handleCreateCoupon,
    refreshData: loadData,
  };
};

export default useCoupons;
