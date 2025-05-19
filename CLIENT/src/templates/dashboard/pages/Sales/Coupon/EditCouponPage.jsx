import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  Button,
  Divider,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  TextField,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack,
  Discount,
  Check,
  Close,
  Add,
  LocalOffer,
  Event,
  People,
  Person,
  ShoppingBasket,
  Category,
  ErrorOutline,
  InfoOutlined,
  Search,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import axios from 'axios';

// Estilos personalizados
const GradientCard = styled(Card)(({ theme }) => ({
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,240,255,0.95) 100%)',
  borderRadius: '16px',
  boxShadow: '0 12px 30px -10px rgba(127, 70, 222, 0.2)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.3)',
  overflow: 'visible',
  position: 'relative',
  height: '100%',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #7F46DE 0%, #9A6AFF 100%)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  backgroundColor: 'rgba(127, 70, 222, 0.1)',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
  '& .MuiChip-deleteIcon': {
    color: '#7F46DE',
    '&:hover': {
      color: '#5F36AE',
    },
  },
}));

const CustomInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(127, 70, 222, 0.3)',
  backgroundColor: 'rgba(127, 70, 222, 0.05)',
  fontSize: '0.875rem',
  fontFamily: theme.typography.fontFamily,
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: '#7F46DE',
    boxShadow: '0 0 0 2px rgba(127, 70, 222, 0.2)',
    backgroundColor: 'rgba(127, 70, 222, 0.1)',
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(127, 70, 222, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(127, 70, 222, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(127, 70, 222, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7F46DE',
      boxShadow: '0 0 0 2px rgba(127, 70, 222, 0.2)',
    },
  },
  '& .MuiSelect-select': {
    padding: '10px 14px',
    fontSize: '0.875rem',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #7F46DE 0%, #9A6AFF 100%)',
  color: 'white',
  borderRadius: '24px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(127, 70, 222, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(127, 70, 222, 0.4)',
    background: 'linear-gradient(90deg, #6F36CE 0%, #8A5AEF 100%)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: '2px solid #7F46DE',
  color: '#7F46DE',
  borderRadius: '24px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(127, 70, 222, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const CouponAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  backgroundColor: 'rgba(127, 70, 222, 0.1)',
  border: '3px solid rgba(127, 70, 222, 0.3)',
  color: '#7F46DE',
  margin: '0 auto',
  boxShadow: '0 8px 16px rgba(127, 70, 222, 0.2)',
  '& svg': {
    fontSize: '36px',
  },
}));

const CouponEditPage = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expirationDate: new Date(),
    maxUses: 100,
    currentUses: 0,
    userMaxUses: 1,
    applicableProducts: [],
    applicableCategories: [],
    isActive: true,
  });

  useEffect(() => {
    const getCSRFToken = async () => {
      try {
        await axios.get('/csrf-token', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro ao obter CSRF token:', error);
      }
    };

    getCSRFToken();
  }, []);

  useEffect(() => {
    console.log('useEffect triggered, couponId:', couponId); // Debug log

    if (!couponId) {
      console.log('No coupon ID, setting loading to false');
      setLoading(false);
      setApiError('ID do cupom não fornecido');
      return;
    }

    const fetchCoupon = async () => {
      console.log('Starting to fetch coupon...');

      try {
        setLoading(true);
        console.log('Making API call to:', `/coupons/${couponId}`);

        const response = await axios
          .get(`/coupons/${couponId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .catch((error) => {
            console.error('Axios error:', error);
            if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
            }
            throw error;
          });

        console.log('API response:', response.data);

        if (!response.data) {
          throw new Error('Dados do cupom não recebidos');
        }

        const couponData = response.data.data;
        setCoupon(couponData);

        setFormData({
          code: couponData.code || '',
          discountType: couponData.discountType || 'percentage',
          discountValue: couponData.discountValue || 0,
          expirationDate: couponData.expirationDate
            ? new Date(couponData.expirationDate)
            : new Date(),
          maxUses: couponData.maxUses || 100,
          currentUses: couponData.currentUses || 1,
          userMaxUses: couponData.userMaxUses || 1,
          applicableProducts: couponData.applicableProducts || [],
          applicableCategories: couponData.applicableCategories || [],
          isActive:
            couponData.isActive !== undefined ? couponData.isActive : true,
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setApiError(error.message || 'Erro ao carregar cupom');
        setSnackbar({
          open: true,
          message: error.message || 'Erro ao carregar cupom',
          severity: 'error',
        });
      } finally {
        console.log('Fetch completed, setting loading to false');
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [couponId]); // Make sure couponId is stable and doesn't change unnecessarily

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Buscar produtos para cupons
        const productsResponse = await axios.get('/api/products/coupons', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAvailableProducts(productsResponse.data || []);

        // Buscar categorias únicas das tags
        const categoriesResponse = await axios.get(
          '/api/categories/unique-tags',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        setAvailableCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Erro ao buscar recursos:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar produtos e categorias',
          severity: 'error',
        });
      }
    };

    fetchResources();
  }, []);

  const handleAddProducts = () => {
    setSelectedProducts(formData.applicableProducts.map((p) => p._id));
    setShowProductDialog(true);
  };

  const handleAddCategories = () => {
    setSelectedCategories(formData.applicableCategories.map((c) => c._id));
    setShowCategoryDialog(true);
  };

  const handleProductSelect = (selected) => {
    const selectedProducts = availableProducts.filter((p) =>
      selected.includes(p.id),
    );

    setFormData((prev) => ({
      ...prev,
      applicableProducts: selectedProducts,
    }));

    setShowProductDialog(false);

    // Feedback visual
    setSnackbar({
      open: true,
      message: `${selectedProducts.length} produto(s) adicionado(s)`,
      severity: 'success',
      autoHideDuration: 2000,
    });
  };

  const handleCategorySelect = (selected) => {
    const selectedCategories = availableCategories.filter((c) =>
      selected.includes(c.id),
    );

    setFormData((prev) => ({
      ...prev,
      applicableCategories: selectedCategories,
    }));

    setShowCategoryDialog(false);

    // Feedback visual
    setSnackbar({
      open: true,
      message: `${selectedCategories.length} categoria(s) adicionada(s)`,
      severity: 'success',
      autoHideDuration: 2000,
    });
  };

  const filteredProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
  );

  const filteredCategories = availableCategories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      expirationDate: date,
    }));
  };

  const handleToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const response = await axios.put(`/coupons/${couponId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      setSnackbar({
        open: true,
        message: 'Cupom atualizado com sucesso!',
        severity: 'success',
      });

      setTimeout(() => navigate('/Dashboard/Vendas/Cupom'), 2000);
    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erro ao atualizar cupom',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (type, itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) =>
        typeof item === 'object'
          ? item._id !== itemToRemove._id
          : item !== itemToRemove,
      ),
    }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} style={{ color: '#7F46DE' }} />
      </Box>
    );
  }

  if (!coupon) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          {apiError || 'Cupom não encontrado'}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/Dashboard/Vendas/Cupom')}
        >
          Voltar para lista de cupons
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <VerticalMenu />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 240px)',
          [theme.breakpoints.down('lg')]: {
            width: 'calc(100% - 80px)',
          },
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        }}
      >
        <DashboardNavbar />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  p: isMobile ? 2 : 4,
                  maxWidth: '1200px',
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: isMobile ? 2 : 4,
                  }}
                >
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2, color: '#7F46DE' }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    fontWeight="bold"
                    sx={{ color: '#7F46DE' }}
                  >
                    Editar Cupom
                  </Typography>
                </Box>
                {/* Primeira linha - Cupom e Configurações */}
                <Grid
                  container
                  spacing={isMobile ? 2 : 4}
                  sx={{ mb: isMobile ? 2 : 4 }}
                >
                  {/* Card do Cupom */}
                  <Grid item xs={12} md={4}>
                    <GradientCard>
                      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                          <CouponAvatar>
                            <Discount />
                          </CouponAvatar>
                          <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            fontWeight="bold"
                            mt={2}
                          >
                            {coupon.code}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            ID: {coupon.code || 'N/A'}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <LocalOffer sx={{ color: '#7F46DE', mr: 1 }} />
                            <Typography variant="body1">
                              Desconto:{' '}
                              <strong>
                                {coupon.discountValue !== undefined
                                  ? coupon.discountValue
                                  : '0'}
                              </strong>
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Event sx={{ color: '#7F46DE', mr: 1 }} />
                            <Typography variant="body1">
                              Expira em:{' '}
                              <strong>
                                {formData.expirationDate
                                  ? new Date(
                                      formData.expirationDate,
                                    ).toLocaleDateString('pt-BR')
                                  : '--/--/----'}
                              </strong>
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <People sx={{ color: '#7F46DE', mr: 1 }} />
                            <Typography variant="body1">
                              Usos:{' '}
                              <strong>
                                {coupon.currentUses || 0}/
                                {coupon.maxUses || 100}
                              </strong>
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ color: '#7F46DE', mr: 1 }} />
                            <Typography variant="body1">
                              Máx. por usuário:{' '}
                              <strong>{formData.userMaxUses}</strong>
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body1" fontWeight="500">
                            Status do Cupom
                          </Typography>
                          <Switch
                            name="isActive"
                            checked={formData.isActive || false}
                            onChange={handleToggle}
                            color="primary"
                            sx={{
                              '& .MuiSwitch-thumb': {
                                color: formData.isActive
                                  ? '#7F46DE'
                                  : theme.palette.grey[400],
                              },
                              '& .MuiSwitch-track': {
                                backgroundColor: formData.isActive
                                  ? 'rgba(127, 70, 222, 0.5)'
                                  : undefined,
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </GradientCard>
                  </Grid>

                  {/* Card de Configurações */}
                  <Grid item xs={12} md={8} sx={{ width: '68%' }}>
                    <GradientCard
                      sx={{
                        height: '100%',
                        boxShadow: '0 8px 32px rgba(127, 70, 222, 0.2)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Degradê superior sutil */}
                      <Box
                        sx={{
                          height: 6,
                          background:
                            'linear-gradient(90deg, #7F46DE 0%, #9A6AFF 100%)',
                          width: '100%',
                        }}
                      />

                      <CardContent
                        sx={{
                          p: isMobile ? 3 : 5,
                          position: 'relative',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '120px',
                            height: '120px',
                            background:
                              'radial-gradient(circle, rgba(127, 70, 222, 0.08) 0%, rgba(127, 70, 222, 0) 70%)',
                            transform: 'translate(50%, -50%)',
                          },
                        }}
                      >
                        {/* Cabeçalho premium */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 5,
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: '16px',
                              bgcolor: 'rgba(127, 70, 222, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 3,
                              boxShadow: '0 4px 12px rgba(127, 70, 222, 0.15)',
                            }}
                          >
                            <Discount
                              sx={{
                                color: '#7F46DE',
                                fontSize: '2rem',
                                strokeWidth: 1.5,
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              sx={{
                                color: '#7F46DE',
                                letterSpacing: '-0.5px',
                                lineHeight: 1.2,
                              }}
                            >
                              Configurações do Cupom
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                mt: 0.5,
                              }}
                            >
                              Personalize as regras e condições de uso
                            </Typography>
                          </Box>
                        </Box>
                        {/* Seções com cards internos */}
                        <Box
                          sx={{
                            display: 'grid',
                            gap: 4,
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {/* Card de Desconto */}
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              borderRadius: '16px',
                              p: 4,
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                              border: '1px solid rgba(127, 70, 222, 0.15)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                                pb: 2,
                                borderBottom:
                                  '1px dashed rgba(127, 70, 222, 0.2)',
                              }}
                            >
                              <LocalOffer
                                sx={{
                                  color: '#7F46DE',
                                  mr: 2,
                                  fontSize: '1.5rem',
                                }}
                              />
                              <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                sx={{
                                  color: '#7F46DE',
                                  fontSize: '1.1rem',
                                }}
                              >
                                Configurações de Desconto
                              </Typography>
                            </Box>

                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1.5,
                                      color: theme.palette.text.secondary,
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>▸</span>{' '}
                                    Tipo de Desconto
                                  </Typography>
                                  <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    style={{
                                      width: '100%',
                                      padding: '14px 16px',
                                      height: '48px',
                                      boxSizing: 'border-box',
                                      border:
                                        '1px solid rgba(127, 70, 222, 0.2)',
                                      borderRadius: '12px',
                                      backgroundColor:
                                        'rgba(127, 70, 222, 0.03)',
                                      fontSize: '0.9375rem',
                                      color: theme.palette.text.primary,
                                      outline: 'none',
                                      cursor: 'pointer',
                                      transition:
                                        'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      appearance: 'none',
                                      backgroundImage:
                                        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237F46DE%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 16px center',
                                      backgroundSize: '16px',
                                      ':hover': {
                                        borderColor: 'rgba(127, 70, 222, 0.4)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.05)',
                                      },
                                      ':focus': {
                                        borderColor: '#7F46DE',
                                        boxShadow:
                                          '0 0 0 3px rgba(127, 70, 222, 0.1)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.07)',
                                      },
                                    }}
                                  >
                                    <option value="percentage">
                                      Porcentagem (%)
                                    </option>
                                    <option value="fixed">
                                      Valor Fixo (R$)
                                    </option>
                                  </select>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1.5,
                                      color: theme.palette.text.secondary,
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>▸</span>
                                    {formData.discountType === 'percentage'
                                      ? 'Valor (%)'
                                      : 'Valor (R$)'}
                                  </Typography>
                                  <CustomInput
                                    name="discountValue"
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    style={{
                                      width: '100%',
                                      padding: '14px 16px',
                                      height: '48px',
                                      boxSizing: 'border-box',
                                      border:
                                        '1px solid rgba(127, 70, 222, 0.2)',
                                      borderRadius: '12px',
                                      backgroundColor:
                                        'rgba(127, 70, 222, 0.03)',
                                      fontSize: '0.9375rem',
                                      transition:
                                        'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      ':hover': {
                                        borderColor: 'rgba(127, 70, 222, 0.4)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.05)',
                                      },
                                      ':focus': {
                                        borderColor: '#7F46DE',
                                        boxShadow:
                                          '0 0 0 3px rgba(127, 70, 222, 0.1)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.07)',
                                        outline: 'none',
                                      },
                                    }}
                                  />
                                  {errors.discountValue && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#ff3b5b',
                                        mt: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.8125rem',
                                      }}
                                    >
                                      <ErrorOutline
                                        sx={{ fontSize: '1rem', mr: 0.5 }}
                                      />
                                      {errors.discountValue}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Card de Validade */}
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              borderRadius: '16px',
                              p: 4,
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                              border: '1px solid rgba(127, 70, 222, 0.15)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                                pb: 2,
                                borderBottom:
                                  '1px dashed rgba(127, 70, 222, 0.2)',
                              }}
                            >
                              <Event
                                sx={{
                                  color: '#7F46DE',
                                  mr: 2,
                                  fontSize: '1.5rem',
                                }}
                              />
                              <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                sx={{
                                  color: '#7F46DE',
                                  fontSize: '1.1rem',
                                }}
                              >
                                Validade e Limites
                              </Typography>
                            </Box>

                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1.5,
                                      color: theme.palette.text.secondary,
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>▸</span>{' '}
                                    Data de Expiração
                                  </Typography>
                                  <input
                                    type="date"
                                    value={
                                      formData.expirationDate
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    onChange={(e) =>
                                      handleDateChange(new Date(e.target.value))
                                    }
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{
                                      width: '100%',
                                      padding: '14px 16px',
                                      height: '48px',
                                      boxSizing: 'border-box',
                                      border:
                                        '1px solid rgba(127, 70, 222, 0.2)',
                                      borderRadius: '12px',
                                      backgroundColor:
                                        'rgba(127, 70, 222, 0.03)',
                                      fontSize: '0.9375rem',
                                      color: theme.palette.text.primary,
                                      outline: 'none',
                                      transition:
                                        'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      ':hover': {
                                        borderColor: 'rgba(127, 70, 222, 0.4)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.05)',
                                      },
                                      ':focus': {
                                        borderColor: '#7F46DE',
                                        boxShadow:
                                          '0 0 0 3px rgba(127, 70, 222, 0.1)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.07)',
                                      },
                                    }}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1.5,
                                      color: theme.palette.text.secondary,
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>▸</span>{' '}
                                    Usos Máximos
                                  </Typography>
                                  <CustomInput
                                    name="maxUses"
                                    type="number"
                                    value={formData.maxUses}
                                    onChange={handleChange}
                                    style={{
                                      width: '100%',
                                      padding: '14px 16px',
                                      height: '48px',
                                      boxSizing: 'border-box',
                                      border:
                                        '1px solid rgba(127, 70, 222, 0.2)',
                                      borderRadius: '12px',
                                      backgroundColor:
                                        'rgba(127, 70, 222, 0.03)',
                                      fontSize: '0.9375rem',
                                      transition:
                                        'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      ':hover': {
                                        borderColor: 'rgba(127, 70, 222, 0.4)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.05)',
                                      },
                                      ':focus': {
                                        borderColor: '#7F46DE',
                                        boxShadow:
                                          '0 0 0 3px rgba(127, 70, 222, 0.1)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.07)',
                                        outline: 'none',
                                      },
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      mt: 1.5,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.8125rem',
                                      }}
                                    >
                                      <InfoOutlined
                                        sx={{ fontSize: '1rem', mr: 0.5 }}
                                      />
                                      Usos atuais: {coupon.currentUses}
                                    </Typography>
                                    {errors.maxUses && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: '#ff3b5b',
                                          display: 'flex',
                                          alignItems: 'center',
                                          fontSize: '0.8125rem',
                                        }}
                                      >
                                        <ErrorOutline
                                          sx={{ fontSize: '1rem', mr: 0.5 }}
                                        />
                                        {errors.maxUses}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1.5,
                                      color: theme.palette.text.secondary,
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>▸</span>{' '}
                                    Máximo por Usuário
                                  </Typography>
                                  <CustomInput
                                    name="userMaxUses"
                                    type="number"
                                    value={formData.userMaxUses}
                                    onChange={handleChange}
                                    style={{
                                      width: '100%',
                                      padding: '14px 16px',
                                      height: '48px',
                                      boxSizing: 'border-box',
                                      border:
                                        '1px solid rgba(127, 70, 222, 0.2)',
                                      borderRadius: '12px',
                                      backgroundColor:
                                        'rgba(127, 70, 222, 0.03)',
                                      fontSize: '0.9375rem',
                                      transition:
                                        'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      ':hover': {
                                        borderColor: 'rgba(127, 70, 222, 0.4)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.05)',
                                      },
                                      ':focus': {
                                        borderColor: '#7F46DE',
                                        boxShadow:
                                          '0 0 0 3px rgba(127, 70, 222, 0.1)',
                                        backgroundColor:
                                          'rgba(127, 70, 222, 0.07)',
                                        outline: 'none',
                                      },
                                    }}
                                  />
                                  {errors.userMaxUses && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#ff3b5b',
                                        mt: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.8125rem',
                                      }}
                                    >
                                      <ErrorOutline
                                        sx={{ fontSize: '1rem', mr: 0.5 }}
                                      />
                                      {errors.userMaxUses}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                        {/* Botão de ação premium */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 5,
                            pt: 3,
                            borderTop: '1px solid rgba(127, 70, 222, 0.1)',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          <PrimaryButton
                            onClick={handleSubmit}
                            disabled={loading || isSubmitting}
                            startIcon={
                              isSubmitting ? (
                                <CircularProgress size={24} />
                              ) : (
                                <Check />
                              )
                            }
                            sx={{
                              '&:hover': {
                                backgroundColor: 'white !important',
                              },
                            }}
                          >
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                          </PrimaryButton>
                        </Box>
                      </CardContent>
                    </GradientCard>
                  </Grid>
                </Grid>
                <Grid container spacing={isMobile ? 2 : 4}>
                  {/* Card de Estatísticas */}
                  <Grid item xs={12} md={4}>
                    <GradientCard>
                      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 2, color: '#7F46DE' }}
                        >
                          Estatísticas
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            Taxa de utilização
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <Box
                                sx={{
                                  height: '8px',
                                  backgroundColor: 'rgba(127, 70, 222, 0.1)',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${Math.min(
                                      ((coupon.currentUses || 0) /
                                        (coupon.maxUses || 100)) *
                                        100,
                                      100,
                                    )}%`,
                                    height: '100%',
                                    background:
                                      'linear-gradient(90deg, #7F46DE 0%, #9A6AFF 100%)',
                                    borderRadius: '4px',
                                  }}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {Math.round(
                                ((coupon.currentUses || 0) /
                                  (coupon.maxUses || 100)) *
                                  100,
                              )}
                              %
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 3,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Criado em
                            </Typography>
                            <Typography variant="body1">
                              {new Date(coupon.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Última atualização
                            </Typography>
                            <Typography variant="body1">
                              {new Date(coupon.updatedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </GradientCard>
                  </Grid>

                  {/* Card de Restrições */}
                  <Grid item xs={12} md={8} sx={{ width: '68%' }}>
                    <GradientCard>
                      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 3, color: '#7F46DE' }}
                        >
                          Restrições do Cupom
                        </Typography>

                        <Grid container spacing={isMobile ? 1 : 3}>
                          <Grid item xs={12}>
                            {/* Produtos Aplicáveis */}
                            <Box sx={{ mb: 3 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <ShoppingBasket
                                  sx={{ color: '#7F46DE', mr: 1 }}
                                />
                                <Typography variant="subtitle1">
                                  Produtos Aplicáveis
                                </Typography>
                              </Box>

                              {formData.applicableProducts.length > 0 ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    mb: 2,
                                    p: 1,
                                    minHeight: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(127, 70, 222, 0.05)',
                                    border:
                                      '1px dashed rgba(127, 70, 222, 0.3)',
                                  }}
                                >
                                  {formData.applicableProducts.map(
                                    (product) => (
                                      <StyledChip
                                        key={product.id}
                                        label={product.name}
                                        onDelete={() =>
                                          handleRemoveItem(
                                            'applicableProducts',
                                            product,
                                          )
                                        }
                                        deleteIcon={
                                          <Close style={{ fontSize: '16px' }} />
                                        }
                                        sx={{
                                          backgroundColor:
                                            'rgba(127, 70, 222, 0.1)',
                                          '& .MuiChip-deleteIcon': {
                                            color: '#7F46DE',
                                          },
                                        }}
                                      />
                                    ),
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    mb: 2,
                                    p: 1,
                                    minHeight: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '12px',
                                    backgroundColor: 'transparent',
                                    border:
                                      '1px dashed rgba(127, 70, 222, 0.3)',
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Nenhum produto selecionado
                                  </Typography>
                                </Box>
                              )}

                              <SecondaryButton
                                startIcon={<Add />}
                                onClick={handleAddProducts}
                                sx={{ mt: 1 }}
                              >
                                Adicionar Produtos
                              </SecondaryButton>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            {/* Categorias Aplicáveis */}
                            <Box sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <Category sx={{ color: '#7F46DE', mr: 1 }} />
                                <Typography variant="subtitle1">
                                  Categorias Aplicáveis
                                </Typography>
                              </Box>

                              {formData.applicableCategories.length > 0 ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    mb: 2,
                                    p: 1,
                                    minHeight: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(127, 70, 222, 0.05)',
                                    border:
                                      '1px dashed rgba(127, 70, 222, 0.3)',
                                  }}
                                >
                                  {formData.applicableCategories.map(
                                    (category) => (
                                      <StyledChip
                                        key={category.id}
                                        label={category.name}
                                        onDelete={() =>
                                          handleRemoveItem(
                                            'applicableCategories',
                                            category,
                                          )
                                        }
                                        deleteIcon={
                                          <Close style={{ fontSize: '16px' }} />
                                        }
                                        sx={{
                                          backgroundColor:
                                            'rgba(127, 70, 222, 0.1)',
                                          '& .MuiChip-deleteIcon': {
                                            color: '#7F46DE',
                                          },
                                        }}
                                      />
                                    ),
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    mb: 2,
                                    p: 1,
                                    minHeight: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '12px',
                                    backgroundColor: 'transparent',
                                    border:
                                      '1px dashed rgba(127, 70, 222, 0.3)',
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Nenhuma categoria selecionada
                                  </Typography>
                                </Box>
                              )}

                              <SecondaryButton
                                startIcon={<Add />}
                                onClick={handleAddCategories}
                                sx={{ mt: 1 }}
                              >
                                Adicionar Categorias
                              </SecondaryButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </GradientCard>
                  </Grid>
                </Grid>
              </Box>
              {/* Diálogo para seleção de produtos */}
              <Dialog
                open={showProductDialog}
                onClose={() => setShowProductDialog(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>
                  <Box display="flex" alignItems="center">
                    <Search sx={{ mr: 1 }} />
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Buscar produtos..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    {filteredProducts.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Paper sx={{ p: 1 }}>
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => {
                                const newSelected = e.target.checked
                                  ? [...selectedProducts, product.id]
                                  : selectedProducts.filter(
                                      (id) => id !== product.id,
                                    );
                                setSelectedProducts(newSelected);
                              }}
                            />
                            <Typography>{product.name}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowProductDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleProductSelect(selectedProducts)}
                    color="primary"
                  >
                    Confirmar ({selectedProducts.length})
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Diálogo para seleção de categorias */}
              <Dialog
                open={showCategoryDialog}
                onClose={() => setShowCategoryDialog(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>
                  <Box display="flex" alignItems="center">
                    <Search sx={{ mr: 1 }} />
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Buscar categorias..."
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    {filteredCategories.map((category) => (
                      <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <Paper sx={{ p: 1 }}>
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              checked={selectedCategories.includes(category.id)}
                              onChange={(e) => {
                                const newSelected = e.target.checked
                                  ? [...selectedCategories, category.id]
                                  : selectedCategories.filter(
                                      (id) => id !== category.id,
                                    );
                                setSelectedCategories(newSelected);
                              }}
                            />
                            <Typography>{category.name}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowCategoryDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleCategorySelect(selectedCategories)}
                    color="primary"
                  >
                    Confirmar ({selectedCategories.length})
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              >
                <Alert
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  severity={snackbar.severity}
                  sx={{ width: '100%' }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </motion.div>
          </AnimatePresence>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default CouponEditPage;
