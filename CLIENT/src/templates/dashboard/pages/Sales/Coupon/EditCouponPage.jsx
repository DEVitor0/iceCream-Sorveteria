import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import CouponForm from '../../../../../components/Coupons/CouponForm';
import useCoupons from '../../../../../hooks/Coupons/useCoupons';
import ErrorBoundaryFallback from '../../../../../errors/ErrorFallback/ErrorBoundaryFallback';

const EditCouponPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCoupon, loading, error } = useCoupons();
  const [coupon, setCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axios.get(`/Dashboard/Vendas/Cupom/${id}`);
        setCoupon(response.data.data);
      } catch (err) {
        console.error('Error fetching coupon:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleSubmit = async (couponData) => {
    try {
      await updateCoupon(id, couponData);
      navigate('/Dashboard/Vendas/Cupom');
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  if (error) return <ErrorBoundaryFallback error={error} />;

  return (
    <Box
      sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <VerticalMenu />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: '95%',
            margin: '30px auto 0 auto',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderRadius: 3,
          }}
        >
          <DashboardNavbar />
        </Box>

        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={60} sx={{ color: '#8C4FED' }} />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Editar Cupom: {coupon?.code}
                </Typography>

                {coupon && (
                  <CouponForm
                    initialData={coupon}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/Dashboard/Vendas/Cupom')}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
};

export default EditCouponPage;
