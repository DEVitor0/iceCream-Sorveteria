import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { fetchCoupons } from '../../utils/Coupons/couponApi';

const useCoupons = (couponId = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token', {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrfToken);
    } catch (err) {
      console.error('Erro ao buscar CSRF token:', err);
      throw err;
    }
  };

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons();

      // Garante que os dados tenham a estrutura esperada
      const formattedCoupons = data.map((coupon) => ({
        ...coupon,
        expirationDate: coupon.expirationDate || new Date(),
        createdAt: coupon.createdAt || new Date(),
        currentUses: coupon.currentUses || 0,
        maxUses: coupon.maxUses || 1,
        isActive: coupon.isActive || false,
      }));

      console.log('Cupons formatados:', formattedCoupons);
      setCoupons(formattedCoupons);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/coupons/${id}`);
      setCoupon(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar cupom');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCsrfToken();
      await loadCoupons();
      if (couponId) await fetchCouponById(couponId);
    };

    loadData();
  }, [couponId]);

  return {
    coupons,
    coupon,
    loading,
    error,
    csrfToken,
    refreshCoupons: loadCoupons,
  };
};

export default useCoupons;
