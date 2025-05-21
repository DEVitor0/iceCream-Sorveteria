import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  styled,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Collapse,
  Alert,
  Autocomplete,
  ListItem,
  CircularProgress,
} from '@mui/material';
import { ShoppingBag, Category } from '@mui/icons-material';
import { Checkbox, ListItemText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  CalendarToday,
  People,
  LocalOffer,
  ArrowBack,
  Check,
  Settings,
  Info,
  ExpandMore,
  ExpandLess,
  Person,
  CheckCircle,
  Cancel,
  AttachMoney,
  Percent,
} from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Componentes estilizados atualizados
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
  border: `1px solid ${theme.palette.divider}`,
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: '#8C4FED', // Alterado para a cor desejada
  color: '#fff', // Cor do texto em branco para contraste
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    background: '#7B3ECC', // Uma tonalidade mais escura para o hover
    boxShadow: '#DADBDC',
  },
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 4),
  fontWeight: 500,
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const StyledStep = styled(Step)(({ theme }) => ({
  position: 'relative',
  '& .MuiStepConnector-root': {
    position: 'absolute',
    top: '50%',
    left: 'calc(-50% + 24px)',
    right: 'calc(50% + 24px)',
    zIndex: 0,
    transform: 'translateY(-50%)',
  },
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: '#DEE2E6',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    transform: 'translate(14px, 11px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.85)',
      fontSize: '0.95rem',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& input': {
      padding: theme.spacing(0.75, 1),
      fontSize: '1rem',
    },
    '& fieldset': {
      borderRadius: theme.shape.borderRadius * 2,
    },
  },
  '& .MuiSelect-select': {
    paddingLeft: '3px !important',
    transform: 'translateY(3px) !important',
  },
  '& .MuiFormHelperText-root': {
    marginTop: theme.spacing(1),
  },
  marginBottom: theme.spacing(3),
}));

// Esquema de validação
const schema = yup.object().shape({
  code: yup
    .string()
    .required('Código é obrigatório')
    .max(20, 'Máximo 20 caracteres'),
  discountType: yup.string().oneOf(['percentage', 'fixed']).required(),
  discountValue: yup
    .number()
    .positive('Valor deve ser positivo')
    .when('discountType', (discountType, schema) => {
      return discountType === 'percentage'
        ? schema.max(100, 'Máximo 100%')
        : schema;
    })
    .required('Valor é obrigatório'),
  expirationDate: yup
    .date()
    .min(new Date(), 'Data deve ser no futuro')
    .required('Data de validade é obrigatória'),
  maxUses: yup.number().integer().min(1).required(),
  userMaxUses: yup.number().integer().min(1).required(),
  applicableProducts: yup.array().of(yup.string()),
  applicableCategories: yup.array().of(yup.string()),
  isActive: yup.boolean(),
});

const CouponCreator = ({
  onSubmit,
  onCancel,
  products = [],
  categories = [],
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const getCSRFToken = () => {
    // Tenta pegar do cookie (padrão csurf)
    const csrfCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('_csrf='))
      ?.split('=')[1];

    // Se não encontrar, tenta pegar do header XSRF-TOKEN (padrão axios)
    return (
      csrfCookie ||
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
    );
  };

  // Estados únicos para os dados
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState({
    products: true,
    categories: true,
  });
  const [error, setError] = useState({
    products: null,
    categories: null,
  });

  useEffect(() => {
    // Configura proteção CSRF quando o componente monta
    const setupCSRFProtection = async () => {
      try {
        if (!getCSRFToken()) {
          await axios.get('/csrf-token', {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        console.error('Erro ao obter CSRF token:', error);
      }
    };

    setupCSRFProtection();
  }, []);

  // Efeito único para buscar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verifica se já temos os dados ou se já está carregando
        if (
          (products.length === 0 &&
            fetchedProducts.length === 0 &&
            !loading.products) ||
          (categories.length === 0 &&
            fetchedCategories.length === 0 &&
            !loading.categories)
        ) {
          setLoading({
            products: products.length === 0,
            categories: categories.length === 0,
          });

          const requests = [];

          if (products.length === 0 && fetchedProducts.length === 0) {
            requests.push(
              axios
                .get('/api/products/coupons')
                .then((response) => setFetchedProducts(response.data))
                .catch((err) => {
                  console.error('Erro ao buscar produtos:', err);
                  setError((prev) => ({
                    ...prev,
                    products: 'Erro ao carregar produtos',
                  }));
                }),
            );
          }

          if (categories.length === 0 && fetchedCategories.length === 0) {
            requests.push(
              axios
                .get('/api/categories/unique-tags')
                .then((response) => setFetchedCategories(response.data))
                .catch((err) => {
                  console.error('Erro ao buscar categorias:', err);
                  setError((prev) => ({
                    ...prev,
                    categories: 'Erro ao carregar categorias',
                  }));
                }),
            );
          }

          if (requests.length > 0) {
            await Promise.all(requests);
          }
        }
      } finally {
        setLoading({
          products: false,
          categories: false,
        });
      }
    };

    fetchData();
  }, [products, categories]); // Adicione outras dependências se necessário

  // Dados finais a serem usados - com fallback seguro
  const productsToUse = products.length > 0 ? products : fetchedProducts || [];
  const categoriesToUse =
    categories.length > 0 ? categories : fetchedCategories || [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: 100,
      userMaxUses: 1,
      applicableProducts: [],
      applicableCategories: [],
      isActive: true,
    },
    mode: 'onChange',
  });

  const discountType = watch('discountType');
  const isActive = watch('isActive');
  const code = watch('code');
  const discountValue = watch('discountValue');
  const expirationDate = watch('expirationDate');

  const steps = [
    { label: 'Informações Básicas', icon: <LocalOffer /> },
    { label: 'Configurações', icon: <Settings /> },
    { label: 'Revisão', icon: <Category /> },
    { label: 'Sucesso', icon: <Check /> },
  ];

  const currentIcon = steps[activeStep].icon;

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token', {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  };

  const handleFinalSubmit = async () => {
    const formData = watch();

    // Garantir que temos arrays válidos (não undefined) e filtrar valores vazios
    const applicableProducts = Array.isArray(formData.applicableProducts)
      ? formData.applicableProducts.filter(Boolean).map((id) => String(id))
      : [];

    const applicableCategories = Array.isArray(formData.applicableCategories)
      ? formData.applicableCategories.filter(Boolean).map((id) => String(id))
      : [];

    const payload = {
      ...formData,
      applicableProducts,
      applicableCategories,
      expirationDate: formData.expirationDate.toISOString(),
    };

    try {
      // Chama a função onSubmit passada como prop
      await onSubmit(payload);

      // Se chegou aqui, o envio foi bem-sucedido
      setSubmitStatus('success');

      // Redireciona após 2 segundos (tempo para o usuário ver a mensagem de sucesso)
      setTimeout(() => {
        navigate('/Dashboard/Vendas/Cupom');
      }, 300);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Erro ao criar cupom:', error);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 3) {
      // Agora prepara a revisão no step 2
      const formData = watch();
      setPreviewData({
        code: formData.code,
        discount: `${formData.discountValue}${
          formData.discountType === 'percentage' ? '%' : 'R$'
        }`,
        validUntil: formData.expirationDate.toLocaleDateString(),
        usesLeft: formData.maxUses,
        status: formData.isActive ? 'Ativo' : 'Inativo',
        userMaxUses: formData.userMaxUses,
      });
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleGenerateCode = () => {
    const randomCode = `PROMO${Math.floor(1000 + Math.random() * 9000)}`;
    setValue('code', randomCode, { shouldValidate: true });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
          height: '100vh',
          width: '100%',
        }}
      >
        {/* Header - Atualizado para Grid v2 */}
        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 2, md: 4 },
            pt: 2,
            pb: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#8C4FED', // Corrigido para #8C4FED
                mr: 2,
                width: 56,
                height: 56,
                boxShadow: theme.shadows[4],
                '& svg': {
                  width: '1.4em !important',
                  height: '1.4em !important',
                  color: '#fff', // Ícone branco
                },
              }}
            >
              {React.cloneElement(currentIcon, {
                style: {
                  fontSize: '2rem',
                  width: '1em',
                  height: '1em',
                },
              })}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Criar Novo Cupom
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure promoções personalizadas para seus clientes
              </Typography>
            </Box>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              flex: 1,
              minWidth: { xs: '100%', md: 'auto' },
              position: 'relative',
              '& .MuiStep-root': {
                padding: theme.spacing(0, 2),
                position: 'relative',
              },
            }}
          >
            {steps.map((step, index) => (
              <StyledStep key={step.label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      marginTop: '8px',
                    },
                  }}
                  StepIconComponent={() => (
                    <Tooltip title={step.label}>
                      <Avatar
                        sx={{
                          bgcolor:
                            activeStep >= index
                              ? '#8C4FED'
                              : 'action.disabledBackground', // Corrigido para #8C4FED
                          color:
                            activeStep >= index ? '#fff' : 'action.disabled',
                          width: 40,
                          height: 40,
                          boxShadow: 3,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    </Tooltip>
                  )}
                />
              </StyledStep>
            ))}
          </Stepper>
        </Box>

        {/* Form Content */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
              px: { xs: 2, md: 4 },
              pb: 4, // Espaço para os botões
            }}
          >
            <Grid container spacing={3}>
              {/* Step 1: Basic Info */}
              {activeStep === 0 && (
                <Grid
                  container
                  spacing={3}
                  sx={{
                    maxWidth: '1600px', // Aumentei para 1600px
                    mx: 'auto',
                    width: '100%',
                  }}
                >
                  {/* Form Section */}
                  <Grid item xs={12} md={9}>
                    <Paper
                      sx={{
                        p: 4,
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #e0e0e0',
                        height: '100%',
                        width: '40vw', // Garante que ocupa toda a largura do Grid item
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3,
                          pb: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <LocalOffer
                          color="primary"
                          sx={{
                            fontSize: 28,
                            mr: 2,
                            color: '#8C4FED', // Corrigido para #8C4FED
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Configurações do Cupom
                        </Typography>
                      </Box>

                      {/* Code Field */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Código do Cupom *
                        </Typography>
                        <Controller
                          name="code"
                          control={control}
                          render={({ field }) => (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                {...field}
                                fullWidth
                                error={!!errors.code}
                                helperText={errors.code?.message}
                                placeholder="Ex: PROMO20"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& input': {
                                      padding: '12px 14px',
                                      fontSize: '0.9375rem',
                                    },
                                  },
                                }}
                              />
                              <Button
                                onClick={handleGenerateCode}
                                variant="outlined"
                                sx={{
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  whiteSpace: 'nowrap',
                                  backgroundColor: '#fff !important',
                                  color: '#8C4FED !important',
                                }}
                              >
                                Gerar Código
                              </Button>
                            </Box>
                          )}
                        />
                      </Box>

                      {/* Discount Fields */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            Tipo de Desconto *
                          </Typography>
                          <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                select
                                fullWidth
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (
                                    e.target.value === 'percentage' &&
                                    discountValue > 100
                                  ) {
                                    setValue('discountValue', 100);
                                  }
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: '48px !important',
                                    borderRadius: '8px !important',
                                    '& .MuiSelect-select': {
                                      padding: '12px 14px !important',
                                      fontSize: '0.9375rem !important',
                                      height: '100% !important',
                                      boxSizing: 'border-box !important',
                                      display: 'flex !important',
                                      alignItems: 'center !important',
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="percentage">
                                  Porcentagem (%)
                                </MenuItem>
                                <MenuItem value="fixed">
                                  Valor Fixo (R$)
                                </MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {discountType === 'percentage'
                              ? 'Porcentagem *'
                              : 'Valor *'}
                          </Typography>
                          <Controller
                            name="discountValue"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {discountType === 'percentage'
                                        ? '%'
                                        : 'R$'}
                                    </InputAdornment>
                                  ),
                                  inputProps: {
                                    min:
                                      discountType === 'percentage' ? 0 : 0.01,
                                    max:
                                      discountType === 'percentage'
                                        ? 100
                                        : undefined,
                                    step:
                                      discountType === 'percentage' ? 1 : 0.01,
                                  },
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: '48px !important',
                                    borderRadius: '8px !important',
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Coupon Preview */}
                  <Grid item xs={12} md={5} lg={4}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: '#8C4FED',
                        color: '#fff',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          p: '6px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography
                          variant="overline"
                          sx={{
                            fontWeight: 700,
                            color: '#fff',
                            fontSize: '0.7rem',
                            letterSpacing: '1px',
                          }}
                        >
                          CUPOM DE DESCONTO
                        </Typography>
                        <LocalOffer sx={{ fontSize: 20, color: '#fff' }} />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          textAlign: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            fontSize: '2.2rem',
                            color: '#fff',
                            letterSpacing: '-0.5px',
                          }}
                        >
                          {code || 'SEUCODIGO'}
                        </Typography>

                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#fff',
                          }}
                        >
                          {discountType === 'percentage' ? (
                            <>{discountValue || 'X'}% DE DESCONTO</>
                          ) : (
                            <>R$ {discountValue || 'X'} DE DESCONTO</>
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 3,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                          Válido até
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: '#fff' }}
                        >
                          {expirationDate
                            ? expirationDate.toLocaleDateString('pt-BR')
                            : new Date().toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* Step 2: Advanced Settings */}
              {activeStep === 1 && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: '#FAF7FF',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(140, 79, 237, 0.1)',
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Linha 1 */}
                      {/* Validade */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: 'white',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: '1px solid #EDE7F6',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: '#F9F5FF',
                              borderRadius: '8px',
                            }}
                          >
                            <CalendarToday
                              sx={{
                                fontSize: 22,
                                mr: 1.5,
                                color: '#8C4FED',
                                backgroundColor: '#F1E7FF',
                                borderRadius: '6px',
                                p: 0.5,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#5E35B1',
                              }}
                            >
                              Validade
                            </Typography>
                          </Box>
                          <Controller
                            name="expirationDate"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                minDate={new Date()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#F9F5FF',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </Paper>
                      </Grid>

                      {/* Status - Design especial */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: isActive ? '#E8F5E9' : '#FFEBEE',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: `1px solid ${
                              isActive ? '#C8E6C9' : '#FFCDD2'
                            }`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: isActive ? '#E8F5E9' : '#FFEBEE',
                              borderRadius: '8px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {isActive ? (
                                <CheckCircle
                                  sx={{
                                    fontSize: 22,
                                    mr: 1.5,
                                    color: '#4CAF50',
                                    backgroundColor: '#C8E6C9',
                                    borderRadius: '6px',
                                    p: 0.5,
                                  }}
                                />
                              ) : (
                                <Cancel
                                  sx={{
                                    fontSize: 22,
                                    mr: 1.5,
                                    color: '#F44336',
                                    backgroundColor: '#FFCDD2',
                                    borderRadius: '6px',
                                    p: 0.5,
                                  }}
                                />
                              )}
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: isActive ? '#2E7D32' : '#C62828',
                                }}
                              >
                                Status
                              </Typography>
                            </Box>
                            <Controller
                              name="isActive"
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  color={isActive ? 'success' : 'error'}
                                  sx={{
                                    '& .MuiSwitch-switchBase': {
                                      color: isActive ? '#4CAF50' : '#F44336',
                                    },
                                    '& .MuiSwitch-track': {
                                      backgroundColor: isActive
                                        ? '#A5D6A7'
                                        : '#EF9A9A',
                                    },
                                  }}
                                />
                              )}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              color: isActive ? '#2E7D32' : '#C62828',
                              fontStyle: 'italic',
                            }}
                          >
                            {isActive
                              ? 'Cupom ativo e disponível para uso'
                              : 'Cupom inativo e indisponível'}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Usos Totais */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: 'white',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: '1px solid #EDE7F6',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: '#F9F5FF',
                              borderRadius: '8px',
                            }}
                          >
                            <People
                              sx={{
                                fontSize: 22,
                                mr: 1.5,
                                color: '#8C4FED',
                                backgroundColor: '#F1E7FF',
                                borderRadius: '6px',
                                p: 0.5,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#5E35B1',
                              }}
                            >
                              Usos Totais
                            </Typography>
                          </Box>
                          <Controller
                            name="maxUses"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type="number"
                                variant="outlined"
                                size="small"
                                inputProps={{ min: 1 }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#F9F5FF',
                                  },
                                }}
                              />
                            )}
                          />
                        </Paper>
                      </Grid>

                      {/* Linha 2 */}
                      {/* Usos por Cliente */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: 'white',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: '1px solid #EDE7F6',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: '#F9F5FF',
                              borderRadius: '8px',
                            }}
                          >
                            <Person
                              sx={{
                                fontSize: 22,
                                mr: 1.5,
                                color: '#8C4FED',
                                backgroundColor: '#F1E7FF',
                                borderRadius: '6px',
                                p: 0.5,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#5E35B1',
                              }}
                            >
                              Usos por Cliente
                            </Typography>
                          </Box>
                          <Controller
                            name="userMaxUses"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type="number"
                                variant="outlined"
                                size="small"
                                inputProps={{ min: 1 }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#F9F5FF',
                                  },
                                }}
                              />
                            )}
                          />
                        </Paper>
                      </Grid>

                      {/* Produtos Aplicáveis */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: 'white',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: '1px solid #EDE7F6',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: '#F9F5FF',
                              borderRadius: '8px',
                            }}
                          >
                            <ShoppingBag
                              sx={{
                                fontSize: 22,
                                mr: 1.5,
                                color: '#8C4FED',
                                backgroundColor: '#F1E7FF',
                                borderRadius: '6px',
                                p: 0.5,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#5E35B1',
                              }}
                            >
                              Produtos Aplicáveis
                            </Typography>
                          </Box>
                          <Controller
                            name="applicableProducts"
                            control={control}
                            render={({ field }) => {
                              // Verifica se os produtos têm IDs válidos
                              const validProducts = productsToUse.filter(
                                (product) =>
                                  product?.id && typeof product.id === 'string', // ou 'number' conforme seu caso
                              );

                              // Filtra apenas produtos com IDs válidos
                              const selectedProducts = validProducts.filter(
                                (product) => field.value?.includes(product.id),
                              );

                              return (
                                <Autocomplete
                                  multiple
                                  options={validProducts}
                                  loading={loading.products}
                                  getOptionLabel={(option) => option.name || ''}
                                  value={selectedProducts}
                                  onChange={(_, newValue) => {
                                    // Garante que só envia IDs válidos
                                    const validIds = newValue
                                      .map((product) => product?.id)
                                      .filter((id) => id !== undefined);

                                    field.onChange(validIds);
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.id === value.id &&
                                    !!option.id &&
                                    !!value.id
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      size="small"
                                      placeholder={
                                        loading.products
                                          ? 'Carregando produtos...'
                                          : 'Selecione produtos'
                                      }
                                      error={!!error.products}
                                      helperText={error.products}
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: '8px',
                                          backgroundColor: '#F9F5FF',
                                        },
                                      }}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <>
                                            {loading.products ? (
                                              <CircularProgress
                                                color="inherit"
                                                size={20}
                                              />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </>
                                        ),
                                      }}
                                    />
                                  )}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                      // Gera chave única mesmo para IDs undefined
                                      const uniqueKey = option.id
                                        ? `chip-${option.id}-${index}`
                                        : `chip-${index}-${Date.now()}`;

                                      return (
                                        <Chip
                                          {...getTagProps({ index })}
                                          key={uniqueKey}
                                          label={
                                            option.name || 'Produto sem nome'
                                          }
                                          size="small"
                                          sx={{
                                            backgroundColor: '#F1E7FF',
                                            color: '#5E35B1',
                                            mr: 0.5,
                                            mb: 0.5,
                                          }}
                                        />
                                      );
                                    })
                                  }
                                  renderOption={(
                                    props,
                                    option,
                                    { selected },
                                  ) => {
                                    // Gera chave única para MenuItem
                                    const uniqueKey = option.id
                                      ? `menu-item-${option.id}`
                                      : `menu-item-${Date.now()}-${Math.random()}`;

                                    return (
                                      <MenuItem
                                        {...props}
                                        key={uniqueKey}
                                        sx={{
                                          '&.Mui-selected': {
                                            backgroundColor:
                                              '#F9F5FF !important',
                                          },
                                        }}
                                      >
                                        <Checkbox
                                          checked={selected}
                                          sx={{
                                            color: '#8C4FED',
                                            '&.Mui-checked': {
                                              color: '#5E35B1',
                                            },
                                          }}
                                        />
                                        <ListItemText
                                          primary={
                                            option.name || 'Produto sem nome'
                                          }
                                          primaryTypographyProps={{
                                            variant: 'body2',
                                            color: '#2D2D2D',
                                          }}
                                        />
                                      </MenuItem>
                                    );
                                  }}
                                  noOptionsText={
                                    error.products
                                      ? 'Erro ao carregar produtos'
                                      : 'Nenhum produto disponível'
                                  }
                                />
                              );
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Categorias Aplicáveis */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: '14px',
                            backgroundColor: 'white',
                            height: '100%',
                            boxShadow: '0 4px 12px rgba(140, 79, 237, 0.08)',
                            border: '1px solid #EDE7F6',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(140, 79, 237, 0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1,
                              backgroundColor: '#F9F5FF',
                              borderRadius: '8px',
                            }}
                          >
                            <Category
                              sx={{
                                fontSize: 22,
                                mr: 1.5,
                                color: '#8C4FED',
                                backgroundColor: '#F1E7FF',
                                borderRadius: '6px',
                                p: 0.5,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#5E35B1',
                              }}
                            >
                              Categorias Aplicáveis
                            </Typography>
                          </Box>
                          <Controller
                            name="applicableCategories"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                multiple
                                options={categoriesToUse}
                                loading={loading.categories}
                                getOptionLabel={(option) => option.name || ''}
                                value={categoriesToUse.filter((c) =>
                                  field.value?.includes(c.id),
                                )}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue.map((v) => v.id));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    placeholder={
                                      loading.categories
                                        ? 'Carregando categorias...'
                                        : 'Selecione categorias'
                                    }
                                    error={!!error.categories}
                                    helperText={error.categories}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#F9F5FF',
                                      },
                                    }}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <>
                                          {loading.categories ? (
                                            <CircularProgress
                                              color="inherit"
                                              size={20}
                                            />
                                          ) : null}
                                          {params.InputProps.endAdornment}
                                        </>
                                      ),
                                    }}
                                  />
                                )}
                                renderTags={(value, getTagProps) =>
                                  value.map((option, index) => (
                                    <Chip
                                      {...getTagProps({ index })}
                                      key={option.id}
                                      label={option.name}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#F1E7FF',
                                        color: '#5E35B1',
                                        mr: 0.5,
                                        mb: 0.5,
                                      }}
                                    />
                                  ))
                                }
                                renderOption={(props, option, { selected }) => (
                                  <MenuItem {...props}>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                    />
                                    <ListItemText
                                      primary={option.name}
                                      primaryTypographyProps={{
                                        variant: 'body2',
                                      }}
                                    />
                                  </MenuItem>
                                )}
                                noOptionsText={
                                  error.categories
                                    ? 'Erro ao carregar categorias'
                                    : 'Nenhuma categoria disponível'
                                }
                              />
                            )}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {/* Step 3: Review */}
              {activeStep === 2 && (
                <Grid item xs={12} sx={{ maxWidth: '90%', mx: 'auto', py: 3 }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StyledCard
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 4px 24px rgba(140, 79, 237, 0.15)',
                      }}
                    >
                      {/* Cabeçalho */}
                      <Box
                        sx={{
                          mb: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <CheckCircle
                          sx={{
                            fontSize: 40,
                            color: '#8C4FED',
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#8C4FED',
                          }}
                        >
                          Resumo do Cupom
                        </Typography>
                      </Box>

                      {/* Primeira linha de blocos */}
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        {/* Bloco Código */}
                        <Grid item xs={12} md={3}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <LocalOffer
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Código
                              </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {previewData?.code}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Bloco Desconto */}
                        <Grid item xs={12} md={3}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Percent
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Desconto
                              </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {previewData?.discount}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Bloco Validade */}
                        <Grid item xs={12} md={3}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <CalendarToday
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Válido até
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {previewData?.validUntil}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Bloco Status */}
                        <Grid item xs={12} md={3}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: `4px solid ${
                                previewData?.status === 'Ativo'
                                  ? '#4CAF50'
                                  : '#F44336'
                              }`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              backgroundColor:
                                previewData?.status === 'Ativo'
                                  ? 'rgba(76, 175, 80, 0.08)'
                                  : 'rgba(244, 67, 54, 0.08)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              {previewData?.status === 'Ativo' ? (
                                <CheckCircle
                                  color="success"
                                  sx={{ mr: 1.5, fontSize: 24 }}
                                />
                              ) : (
                                <Cancel
                                  color="error"
                                  sx={{ mr: 1.5, fontSize: 24 }}
                                />
                              )}
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Status
                              </Typography>
                            </Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color:
                                  previewData?.status === 'Ativo'
                                    ? '#4CAF50'
                                    : '#F44336',
                              }}
                            >
                              {previewData?.status}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Segunda linha de blocos */}
                      <Grid container spacing={3}>
                        {/* Bloco Usos */}
                        <Grid item xs={12} md={4}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <People
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Usos disponíveis
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {previewData?.usesLeft}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Bloco Usos por cliente */}
                        <Grid item xs={12} md={4}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Person
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Usos por cliente
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {previewData?.userMaxUses}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Bloco Aplicação */}
                        <Grid item xs={12} md={4}>
                          <Paper
                            sx={{
                              p: 3,
                              height: '100%',
                              borderRadius: 3,
                              borderLeft: '4px solid #8C4FED',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <ShoppingBag
                                color="primary"
                                sx={{ mr: 1.5, fontSize: 24 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                Aplicação
                              </Typography>
                            </Box>

                            {/* Lógica simplificada para mostrar apenas quantidades */}
                            {watch('applicableProducts')?.length > 0 ||
                            watch('applicableCategories')?.length > 0 ? (
                              <Box>
                                {watch('applicableProducts')?.length > 0 && (
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {watch('applicableProducts').length}{' '}
                                    produto(s) selecionado(s)
                                  </Typography>
                                )}

                                {watch('applicableCategories')?.length > 0 && (
                                  <Typography variant="body1">
                                    {watch('applicableCategories').length}{' '}
                                    categoria(s) selecionada(s)
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Typography variant="body1">
                                Aplicável a todos os produtos
                              </Typography>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Mensagem final */}
                      <Box
                        sx={{
                          mt: 4,
                          p: 3,
                          backgroundColor: '#FAF7FF',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #EDE7F6',
                        }}
                      >
                        <Info
                          sx={{
                            color: '#5E35B1',
                            fontSize: 24,
                            mr: 2,
                          }}
                        />
                        <Typography variant="body1">
                          Após a criação, você poderá editar todas as
                          configurações deste cupom, exceto o código.
                        </Typography>
                      </Box>
                    </StyledCard>
                  </motion.div>
                </Grid>
              )}
              {/* Step 4: Review */}
              {activeStep === 3 && (
                <Grid item xs={12} sx={{ textAlign: 'center', my: 8 }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                      {submitStatus === 'success' ? (
                        <>
                          <CheckCircle
                            sx={{
                              fontSize: 80,
                              color: '#4CAF50',
                              mb: 3,
                            }}
                          />
                          <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                          >
                            Cupom criado com sucesso!
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                          >
                            O cupom {previewData?.code} foi criado e está{' '}
                            {previewData?.status.toLowerCase()}. Você pode
                            gerenciá-lo a qualquer momento na área de cupons.
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Cancel
                            sx={{
                              fontSize: 80,
                              color: '#F44336',
                              mb: 3,
                            }}
                          />
                          <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                          >
                            Erro ao criar cupom
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                          >
                            Não foi possível concluir o cadastro do cupom. Por
                            favor, tente novamente.
                          </Typography>
                        </>
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          justifyContent: 'center',
                        }}
                      >
                        <SecondaryButton
                          onClick={onCancel}
                          size="large"
                          sx={{ px: 4 }}
                        >
                          Voltar para Cupons
                        </SecondaryButton>
                        {activeStep === 3 && submitStatus === 'success' && (
                          <PrimaryButton
                            onClick={() => {
                              reset(); // Reseta o formulário
                              setActiveStep(0); // Volta para o primeiro passo
                              setSubmitStatus(null);
                            }}
                            size="large"
                            sx={{ mt: 2, px: 4 }}
                            startIcon={<LocalOffer />}
                          >
                            Criar Novo Cupom
                          </PrimaryButton>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              )}
            </Grid>

            {/* Actions */}
            <Box
              sx={{
                flexShrink: 0,
                px: { xs: 2, md: 4 },
                py: 2,
                backgroundColor: theme.palette.background.default,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SecondaryButton
                    onClick={activeStep === 0 ? onCancel : handleBack}
                    startIcon={<ArrowBack />}
                    size="large"
                  >
                    {activeStep === 0 ? 'Cancelar' : 'Voltar'}
                  </SecondaryButton>
                </motion.div>
                {activeStep < steps.length - 1 ? (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PrimaryButton
                      onClick={
                        activeStep === 2 ? handleFinalSubmit : handleNext
                      }
                      disabled={!isValid || isSubmitting}
                      size="large"
                      sx={{ color: '#fff !important' }}
                    >
                      {activeStep === steps.length - 2
                        ? 'Finalizar'
                        : 'Próximo'}
                    </PrimaryButton>
                  </motion.div>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CouponCreator;
