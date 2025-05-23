import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import CouponForm from '../../../../../components/Coupons/CouponForm';
import useCoupons from '../../../../../hooks/Coupons/useCoupons';

const CreateCouponPage = () => {
  const { products, categories, loading, error, createCoupon } = useCoupons();
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  // Busca o token CSRF quando o componente monta
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/csrf-token', {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (couponData) => {
    try {
      await axios.post('/coupons', couponData, {
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
      });
      navigate('/Dashboard/Vendas/Cupom');
    } catch (error) {
      console.error('Error creating coupon:', error);
      // Se for erro de CSRF, tenta renovar o token
      if (
        error.response?.status === 403 &&
        error.response?.data?.error?.includes('CSRF')
      ) {
        const newToken = await axios.get('/csrf-token', {
          withCredentials: true,
        });
        setCsrfToken(newToken.data.csrfToken);
        // Tenta novamente com o novo token
        return handleSubmit(couponData);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: '#f8f9fa',
          overflow: 'hidden',
        }}
      >
        <VerticalMenu />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto', // Permite scroll vertical apenas nesta área
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '90%',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              borderRadius: 3,
              px: 2,
              margin: '0 auto', // Centraliza horizontalmente
              mt: 3, // Adiciona margin top de 24px (3 * 8px)
            }}
          >
            <DashboardNavbar />
          </Box>

          <Container
            maxWidth="xl"
            sx={{
              flex: 1,
              pt: 3,
              pb: 6, // Aumentei o padding bottom para espaço dos botões
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              px: { xs: 1, md: 3 }, // Padding responsivo
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress size={60} sx={{ color: '#8C4FED' }} />
                </Box>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1 }}
                >
                  <CouponForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/Dashboard/Vendas/Cupom')}
                    products={products}
                    categories={categories}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateCouponPage;
