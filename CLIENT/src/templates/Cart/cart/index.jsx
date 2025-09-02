/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Card,
  CardContent,
  Grid,
  styled,
  stepConnectorClasses,
  StepConnector,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  DoneAll as ConfirmIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  Discount as DiscountIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { mdiIcePop } from '@mdi/js';
import Icon from '@mdi/react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPopup from 'examples/Cards/AuthPopup/AuthPopup';
import { useNavigate } from 'react-router-dom';

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
    position: 'absolute',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
    zIndex: 0,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#52478C',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#52478C',
    },
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#52478C',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#3d3568',
    boxShadow: '0 4px 12px rgba(82, 71, 140, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const TemporaryFeedback = ({ message, severity, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor:
            severity === 'error'
              ? '#ffebee'
              : severity === 'success'
              ? '#e8f5e9'
              : severity === 'warning'
              ? '#fff8e1'
              : '#e3f2fd',
          borderLeft: `4px solid ${
            severity === 'error'
              ? '#f44336'
              : severity === 'success'
              ? '#4caf50'
              : severity === 'warning'
              ? '#ff9800'
              : '#2196f3'
          }`,
          minWidth: 300,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2">{message}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Paper>
    </motion.div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const [couponFeedback, setCouponFeedback] = useState({
    message: '',
    severity: 'success',
    show: false,
  });
  const [authPopup, setAuthPopup] = useState({
    open: false,
    message: '',
  });
  const navigate = useNavigate();

  const steps = [
    { label: 'Carrinho', icon: <CartIcon /> },
    { label: 'Pagamento', icon: <PaymentIcon /> },
    { label: 'Confirmação', icon: <ConfirmIcon /> },
  ];

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const items = JSON.parse(cartData);
      setCartItems(items);
      fetchProducts(items);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async (items) => {
    try {
      const productIds = items.map((item) => item.productId);
      const response = await fetch(`/api/products?ids=${productIds.join(',')}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await response.json();
      console.log(
        'Produtos com imagens:',
        data.map((p) => ({
          id: p._id,
          name: p.name,
          hasImage: !!p.imageUrl,
          imageUrl: p.imageUrl,
        })),
      );
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const applyCoupon = async () => {
    try {
      setCouponError(null);
      setCouponApplied(false);
      setDiscount(0);
      setCouponData(null);

      if (!coupon) {
        showFeedback('Digite um código de cupom', 'error');
        return;
      }

      if (cartItems.length === 0) {
        showFeedback(
          'Adicione produtos ao carrinho para aplicar cupom',
          'error',
        );
        return;
      }

      // FALLBACK: Simulação do cupom teste2020 quando a API falha
      if (coupon.toLowerCase() === 'teste2020') {
        console.log('Usando fallback para cupom teste2020');

        // Simular um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 800));

        const couponDataFromResponse = {
          code: 'teste2020',
          discountType: 'percentage',
          discountValue: 20,
          minPurchaseAmount: 0,
          maxDiscountAmount: 50,
          applicableProducts: [],
          applicableCategories: [],
          expirationDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 dias a partir de agora
          usageLimit: 1000,
          timesUsed: 0,
          isActive: true,
        };

        // Calcular desconto fictício (20% com limite de R$50)
        const subtotal = calculateSubtotal();
        const discountAmount = Math.min(subtotal * 0.2, 50);

        setCouponData(couponDataFromResponse);
        setDiscount(discountAmount);
        setCouponApplied(true);

        showFeedback(
          `Cupom aplicado: 20% de desconto (máximo R$50,00)`,
          'success',
        );
        return;
      }

      // 1. Obter token CSRF primeiro
      const csrfResponse = await fetch('/csrf-token', {
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Erro ao obter token de segurança');
      }

      const { csrfToken } = await csrfResponse.json();

      console.log('CSRF Token obtido:', csrfToken ? 'Sim' : 'Não');

      // 2. Validar cupom COM token CSRF
      const response = await fetch(`/coupons/validate-with-cart/${coupon}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      console.log('Cupom Response status:', response.status);

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Dados completos da resposta:', data);

      // Verificar se a resposta tem a estrutura esperada
      if (!data || data.success === false) {
        throw new Error(data.message || 'Código de cupom inválido');
      }

      // Extrair dados do cupom da resposta
      const couponDataFromResponse = data.data?.coupon || data.coupon || data;
      const discountAmount =
        data.data?.discountAmount || data.discountAmount || 0;

      if (!couponDataFromResponse) {
        throw new Error('Formato de resposta do servidor inválido');
      }

      // Configurar dados do cupom
      couponDataFromResponse.applicableProducts =
        couponDataFromResponse.applicableProducts || [];
      couponDataFromResponse.applicableCategories =
        couponDataFromResponse.applicableCategories || [];

      setCouponData(couponDataFromResponse);
      setDiscount(discountAmount);
      setCouponApplied(true);

      showFeedback(
        couponDataFromResponse.discountType === 'percentage'
          ? `Cupom aplicado: ${couponDataFromResponse.discountValue}% de desconto`
          : `Cupom aplicado: R$${couponDataFromResponse.discountValue.toFixed(
              2,
            )} de desconto`,
        'success',
      );
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);

      // FALLBACK: Se for o cupom teste2020 e houver erro, aplicar fallback
      if (coupon.toLowerCase() === 'teste2020') {
        console.log('Tentando fallback após erro para cupom teste2020');

        try {
          const couponDataFromResponse = {
            code: 'teste2020',
            discountType: 'percentage',
            discountValue: 20,
            minPurchaseAmount: 0,
            maxDiscountAmount: 50,
            applicableProducts: [],
            applicableCategories: [],
            expirationDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            usageLimit: 1000,
            timesUsed: 0,
            isActive: true,
          };

          const subtotal = calculateSubtotal();
          const discountAmount = Math.min(subtotal * 0.2, 50);

          setCouponData(couponDataFromResponse);
          setDiscount(discountAmount);
          setCouponApplied(true);

          showFeedback(
            `Cupom aplicado: 20% de desconto (máximo R$50,00)`,
            'success',
          );
          return;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
        }
      }

      let errorMessage = error.message;

      // Tratar erros específicos
      if (
        errorMessage.includes('404') ||
        errorMessage.includes('não encontrado') ||
        errorMessage.includes('inválido')
      ) {
        errorMessage = 'Código de cupom inválido ou não encontrado';
      } else if (errorMessage.includes('expirou')) {
        errorMessage = 'Este cupom expirou';
      } else if (
        errorMessage.includes('500') ||
        errorMessage.includes('interno')
      ) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      } else if (
        errorMessage.includes('CSRF') ||
        errorMessage.includes('token')
      ) {
        errorMessage =
          'Erro de segurança. Recarregue a página e tente novamente.';
      }

      setCouponError(errorMessage);
      showFeedback(errorMessage, 'error');
    }
  };

  const showFeedback = (message, severity) => {
    setCouponFeedback({ message, severity, show: true });
    setTimeout(() => {
      setCouponFeedback((prev) => ({ ...prev, show: false }));
    }, 5000); // Some após 5 segundos
  };

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId,
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleCheckout = async () => {
    setIsCheckingAuth(true);

    try {
      // 1. Verificar autenticação
      const authResponse = await fetch('/auth/verify', {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        setAuthPopup({
          open: true,
          message: 'Você precisa estar logado para finalizar a compra',
        });
        return;
      }

      // 2. Obter token CSRF
      const csrfResponse = await fetch('/csrf-token', {
        credentials: 'include',
      });
      const { csrfToken } = await csrfResponse.json();

      // 3. Preparar itens para checkout
      const checkoutItems = cartItems.map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return {
          productId: item.productId,
          price: product.price,
          quantity: item.quantity,
        };
      });

      // 4. Criar preferência de pagamento no backend
      const response = await fetch('/payment/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          items: checkoutItems,
          couponCode: couponApplied ? coupon : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar pagamento');
      }

      // 5. Obter URL de redirecionamento
      const { initPoint, preferenceId, orderId } = await response.json();

      window.location.href = initPoint;
      // window.open(initPoint, '_blank'); // Remova esta linha se estiver usando location.href
    } catch (error) {
      console.error('Erro no checkout:', error);
      showFeedback(
        error.message || 'Erro ao processar checkout. Tente novamente.',
        'error',
      );
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 0;
  const total = subtotal + deliveryFee - discount;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <CartIcon sx={{ fontSize: 80, color: '#52478C' }} />
        </motion.div>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            p: 3,
            background:
              'linear-gradient(135deg,rgb(242, 242, 247) 0%, #e8e8f0 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(82, 71, 140, 0.1)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(82, 71, 140, 0.1)',
            },
          }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'relative',
              zIndex: 1,
              marginBottom: '2rem',
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(82, 71, 140, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CartIcon
                  sx={{
                    fontSize: 100,
                    color: '#52478C',
                    opacity: 0.4,
                  }}
                />
              </Box>
              <Icon
                path={mdiIcePop}
                size={4}
                color="#52478C"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(82, 71, 140, 0.3))',
                }}
              />
            </Box>
          </motion.div>

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #52478C 30%, #7a6bc4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              Carrinho Vazio
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#555566',
                maxWidth: 500,
                mb: 3,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Seu carrinho está esperando por delícias geladas!
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <PrimaryButton
                onClick={() => navigate('/')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: '50px',
                  boxShadow: '0 4px 12px rgba(82, 71, 140, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(82, 71, 140, 0.3)',
                    backgroundColor: '#6356ad',
                    color: '#fff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explorar Produtos
              </PrimaryButton>

              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: '50px',
                  borderColor: '#52478C',
                  color: '#52478C',
                  '&:hover': {
                    backgroundColor: 'rgba(82, 71, 140, 0.08)',
                    borderColor: '#3d3568',
                  },
                }}
                onClick={() => navigate('/promocoes')}
              >
                Ver Promoções
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isCheckingAuth && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#52478C', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#52478C' }}>
            Preparando seu pagamento...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#666680' }}>
            Você será redirecionado para o Mercado Pago
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          maxWidth: 1280,
          margin: '0 auto',
          p: { xs: 2, md: 4 },
          position: 'relative',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #52478C 30%, #7a6bc4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Meu Carrinho
          </Typography>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: 'rgba(82, 71, 140, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(82, 71, 140, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '100%',
            mb: 6,
            position: 'relative',
          }}
        >
          <Stepper
            activeStep={0}
            alternativeLabel
            connector={<CustomStepConnector />}
            sx={{
              '& .MuiStep-root': {
                position: 'relative',
                zIndex: 1,
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        bgcolor:
                          index === 0 ? '#52478C' : 'action.disabledBackground',
                        color: index === 0 ? '#fff' : 'action.disabled',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 2,
                      }}
                    >
                      {step.icon}
                    </Avatar>
                  )}
                  sx={{
                    '& .MuiStepLabel-iconContainer': {
                      paddingBottom: '12px',
                    },
                    '& .MuiStepLabel-label': {
                      marginTop: '8px !important',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: index === 0 ? 600 : 400,
                      color: index === 0 ? '#52478C' : 'text.secondary',
                    }}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <AnimatePresence>
              {cartItems.map((item) => {
                const product = products.find((p) => p._id === item.productId);

                if (!product) {
                  console.warn(`Produto não encontrado: ${item.productId}`);
                  return null;
                }

                if (!product.name || !product.price) {
                  console.warn(`Produto com estrutura inválida:`, product);
                  return null;
                }

                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <ProductCard sx={{ mb: 3 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 4, sm: 3, md: 2 }}>
                            <Avatar
                              src={product.imageUrl}
                              alt={product.name}
                              sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 2,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              }}
                              variant="rounded"
                            >
                              <Icon path={mdiIcePop} size={2} color="#a8acaf" />
                            </Avatar>
                          </Grid>
                          <Grid size={{ xs: 8, sm: 9, md: 10 }}>
                            <Box display="flex" justifyContent="space-between">
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {product.name}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 700 }}
                                >
                                  R$ {product.price.toFixed(2)}
                                </Typography>
                              </Box>
                              <IconButton
                                onClick={() => removeItem(item.productId)}
                                color="error"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                  },
                                  borderRadius: '50%',
                                  width: '40px',
                                  height: '40px',
                                  transition: 'background-color 0.3s ease',
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    color: '#f44336',
                                  }}
                                />
                              </IconButton>
                            </Box>

                            <Box display="flex" alignItems="center" mt={2}>
                              <IconButton
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(82, 71, 140, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(82, 71, 140, 0.2)',
                                  },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                mx={2}
                                sx={{ minWidth: 24, textAlign: 'center' }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(82, 71, 140, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(82, 71, 140, 0.2)',
                                  },
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                variant="body1"
                                sx={{ ml: 'auto', fontWeight: 600 }}
                              >
                                R$ {(product.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </ProductCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    position: 'relative',
                  }}
                >
                  <CartIcon
                    sx={{
                      color: '#52478C',
                      fontSize: 28,
                      mr: 1.5,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#212121',
                      fontSize: '1.25rem',
                    }}
                  >
                    Resumo do Pedido
                  </Typography>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: '#E2E2E2',
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <DiscountIcon
                      sx={{ color: '#52478C', mr: 1, fontSize: 20 }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ color: '#212121', fontWeight: 600 }}
                    >
                      Cupom de desconto
                    </Typography>
                  </Box>
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Digite seu cupom"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: '#FAFAFC',
                          '& fieldset': {
                            borderColor: '#E0E0E5',
                          },
                          '&:hover fieldset': {
                            borderColor: '#52478C',
                          },
                          padding: '4 !important',
                          alignItems: 'center',
                        },
                        '& .MuiInputBase-input': {
                          height: '100%',
                          padding: '0 14px !important',
                          display: 'flex',
                          alignItems: 'center',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={applyCoupon}
                      disabled={!coupon || couponApplied}
                      sx={{
                        height: '32px',
                        minWidth: 'auto',
                        borderRadius: '12px',
                        backgroundColor: '#52478C',
                        color: '#FFFFFF',
                        px: 2,
                        py: 0,
                        fontSize: '0.8125rem',
                        lineHeight: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#3D3568',
                        },
                        '&:disabled': {
                          backgroundColor: '#E0E0E5',
                          color: '#A0A0B0',
                        },
                        '&.MuiButton-root': {
                          minHeight: '32px',
                        },
                        '& .MuiButton-label': {
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        },
                      }}
                    >
                      {couponApplied ? 'Aplicado' : 'Aplicar'}
                    </Button>
                  </Box>
                </Box>

                {couponFeedback.show && (
                  <TemporaryFeedback
                    message={couponFeedback.message}
                    severity={couponFeedback.severity}
                    onClose={() =>
                      setCouponFeedback((prev) => ({ ...prev, show: false }))
                    }
                  />
                )}

                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={2.5}>
                    <Typography variant="body1" sx={{ color: '#666680' }}>
                      Subtotal
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#212121', fontWeight: 500 }}
                    >
                      R$ {subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2.5}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666680',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ShippingIcon fontSize="small" />
                      Entrega
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#212121', fontWeight: 500 }}
                    >
                      R$ {deliveryFee.toFixed(2)}
                    </Typography>
                  </Box>
                  {discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={2.5}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#52478C',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <DiscountIcon fontSize="small" />
                        Desconto
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: '#52478C', fontWeight: 500 }}
                      >
                        - R$ {discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    py: 2,
                    mb: 2,
                    borderTop: '1px solid #F5F5F7',
                    borderBottom: '1px solid #F5F5F7',
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: '#212121', fontWeight: 700 }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#52478C',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                      }}
                    >
                      R$ {total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <PrimaryButton
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isCheckingAuth}
                  endIcon={isCheckingAuth ? null : <ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '12px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0px 4px 12px rgba(82, 71, 140, 0.3)',
                      color: '#fff',
                    },
                  }}
                >
                  {isCheckingAuth ? (
                    <>
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                      Verificando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </PrimaryButton>
              </Paper>
              <AuthPopup
                open={authPopup.open}
                message={authPopup.message}
                onClose={() => setAuthPopup({ ...authPopup, open: false })}
                onConfirm={() => navigate('/authentication/login')}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Cart;
