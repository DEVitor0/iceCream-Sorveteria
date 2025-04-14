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

// Conector personalizado para o stepper
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
    zIndex: 0, // Garante que fique atrás
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
// Componente estilizado para o botão principal
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

// Componente estilizado para os cards de produto
const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [authPopup, setAuthPopup] = useState({
    open: false,
    message: '',
  });
  const navigate = useNavigate();

  // Etapas na ordem correta: Carrinho → Pagamento → Confirmação
  const steps = [
    { label: 'Carrinho', icon: <CartIcon /> },
    { label: 'Pagamento', icon: <PaymentIcon /> },
    { label: 'Confirmação', icon: <ConfirmIcon /> },
  ];

  // Fetch cart items from localStorage
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

  // Fetch product details from API
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
          imageUrl: p.imageUrl, // Mostra a URL da imagem
        })),
      );
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (coupon === 'PRIME10') {
      setDiscount(calculateSubtotal() * 0.1); // 10% discount
      setCouponApplied(true);
    } else {
      setDiscount(0);
      setCouponApplied(false);
      alert('Cupom inválido ou expirado');
    }
  };

  // Remove item from cart
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
      const response = await fetch('/auth/verify-auth', {
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/pagamento');
      } else {
        setAuthPopup({
          open: true,
          message: 'Você precisa estar logado para finalizar a compra',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthPopup({
        open: true,
        message: 'Erro ao verificar autenticação. Tente novamente.',
      });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 0; // Free delivery for now
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
          {/* Ícone de carregamento maior */}
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
            minHeight: '100vh', // Alterado para 100vh
            textAlign: 'center',
            p: 3,
            background:
              'linear-gradient(135deg,rgb(242, 242, 247) 0%, #e8e8f0 100%)', // Cinza mais visível
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
              background: 'rgba(82, 71, 140, 0.1)', // Opacidade aumentada
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(82, 71, 140, 0.1)', // Opacidade aumentada
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
                  backgroundColor: 'rgba(82, 71, 140, 0.15)', // Mais visível
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CartIcon
                  sx={{
                    fontSize: 100,
                    color: '#52478C',
                    opacity: 0.4, // Aumentei a opacidade
                  }}
                />
              </Box>
              <Icon
                path={mdiIcePop}
                size={4}
                color="#52478C"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(82, 71, 140, 0.3))', // Sombra mais forte
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
                color: '#555566', // Texto mais escuro
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
      <Box
        sx={{
          maxWidth: 1280,
          margin: '0 auto',
          p: { xs: 2, md: 4 },
          position: 'relative',
        }}
      >
        {/* Header with close button */}
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

        {/* Stepper corrigido */}
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
                zIndex: 1, // Elementos acima da linha
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
                        zIndex: 2, // Garante que fique acima de tudo
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
          {/* Product list */}
          <Grid item xs={12} md={8}>
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
                          <Grid item xs={4} sm={3} md={2}>
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
                          <Grid item xs={8} sm={9} md={10}>
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
                                    backgroundColor: 'rgba(244, 67, 54, 0.2)', // Fundo vermelho apenas no hover
                                  },
                                  borderRadius: '50%', // Garante que seja redondo
                                  width: '40px', // Tamanho fixo
                                  height: '40px', // Tamanho fixo
                                  transition: 'background-color 0.3s ease', // Transição suave
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

          {/* Order summary */}
          <Grid item xs={12} md={4}>
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
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2, // Margin bottom para o espaço abaixo da linha
                    pb: 2,
                    position: 'relative', // Adicionado para posicionamento da linha
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

                  {/* Linha abaixo do título */}
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

                {/* Cupom */}
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
                          height: '40px', // Mesma altura do botão
                          borderRadius: '12px',
                          backgroundColor: '#FAFAFC',
                          '& fieldset': {
                            borderColor: '#E0E0E5',
                          },
                          '&:hover fieldset': {
                            borderColor: '#52478C',
                          },
                          // Ajustes adicionais para alinhamento perfeito:
                          padding: '4 !important',
                          alignItems: 'center',
                        },
                        '& .MuiInputBase-input': {
                          height: '100%',
                          padding: '0 14px !important', // Padding horizontal mantido
                          // Centraliza o texto verticalmente:
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
                        height: '32px', // Altura reduzida (era 40px)
                        minWidth: 'auto',
                        borderRadius: '12px',
                        backgroundColor: '#52478C',
                        color: '#FFFFFF',
                        px: 2, // Padding horizontal reduzido (era 3)
                        py: 0, // Remove padding vertical padrão
                        fontSize: '0.8125rem', // Tamanho da fonte reduzido
                        lineHeight: 1.5, // Ajuste do line-height
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#3D3568',
                        },
                        '&:disabled': {
                          backgroundColor: '#E0E0E5',
                          color: '#A0A0B0',
                        },
                        // Garante que os estilos tenham precedência
                        '&.MuiButton-root': {
                          minHeight: '32px', // Sobrescreve o min-height padrão
                        },
                        '& .MuiButton-label': {
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        },
                      }}
                    >
                      {couponApplied ? '✓ Aplicado' : 'Aplicar'}
                    </Button>
                  </Box>
                  {couponApplied && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: '#4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <DiscountIcon fontSize="small" />
                      Cupom aplicado com sucesso!
                    </Typography>
                  )}
                </Box>

                {/* Resumo de valores */}
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
                          color: '#4CAF50',
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
                        sx={{ color: '#4CAF50', fontWeight: 500 }}
                      >
                        - R$ {discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Total */}
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

                {/* Botão */}
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
