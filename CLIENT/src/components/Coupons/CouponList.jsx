import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Badge,
  Skeleton,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LocalOffer as DiscountIcon,
  Event as CalendarIcon,
  People as UsersIcon,
  CheckCircle as ActiveIcon,
  Warning as ExpiredIcon,
  Block as InactiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CouponCard = ({
  coupon = {},
  onEdit,
  onDelete,
  onCopy,
  loading = false,
}) => {
  const theme = useTheme();

  // Paleta de cores ajustada
  const palette = {
    primary: '#7942D6',
    primaryLight: '#9A6AE3',
    primaryLighter: '#F5F0FF',
    white: '#FFFFFF',
    background: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    grey: '#E0E0E0',
    textPrimary: '#212121',
    textSecondary: '#757575',
    hoverIcon: '#F0E5FF', // Nova cor para hover dos ícones
  };

  // Valores padrão para evitar erros
  const safeCoupon = {
    discountType: 'percentage',
    discountValue: 0,
    currentUses: 0,
    maxUses: 1,
    expirationDate: new Date(),
    createdAt: new Date(),
    code: '',
    status: 'inactive',
    _id: '',
    ...coupon,
  };

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        if (onCopy) onCopy(code); // Chama a função do pai
      })
      .catch((err) => console.error('Falha ao copiar código: ', err));
  };

  // Formatação dos dados
  const formattedDiscount =
    safeCoupon.discountType === 'fixed'
      ? `R$${Number(safeCoupon.discountValue || 0).toFixed(2)}`
      : `${safeCoupon.discountValue || 0}%`;

  const formattedDate = (date) => {
    try {
      return format(new Date(date || new Date()), 'dd/MM/yyyy', {
        locale: ptBR,
      });
    } catch {
      return '--/--/----';
    }
  };

  const usagePercentage = Math.min(
    100,
    (Number(safeCoupon.currentUses) / Number(safeCoupon.maxUses || 1)) * 100,
  );

  // Configurações de status
  const statusConfig = {
    active: {
      icon: <ActiveIcon />,
      label: 'Ativo',
      color: palette.success,
      bgColor: '#E8F5E9',
    },
    expired: {
      icon: <ExpiredIcon />,
      label: 'Expirado',
      color: palette.warning,
      bgColor: '#FFF8E1',
    },
    used: {
      icon: <InactiveIcon />,
      label: 'Usado',
      color: palette.error,
      bgColor: '#FFEBEE',
    },
    inactive: {
      icon: <InactiveIcon />,
      label: 'Inativo',
      color: palette.textSecondary,
      bgColor: palette.grey,
    },
  };

  const status = statusConfig[safeCoupon.status] || statusConfig.inactive;

  if (loading) {
    return (
      <Card
        sx={{
          mb: 3,
          borderRadius: '12px',
          p: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height={120} />
      </Card>
    );
  }

  return (
    <Card
      component={motion.div}
      whileHover={{
        y: -4,
        boxShadow: '0 6px 16px rgba(121, 66, 214, 0.2)',
      }}
      sx={{
        height: '100%',
        width: 'calc(50% - 12px)', // Metade do espaço menos metade do gap
        minWidth: '350px', // Largura mínima razoável
        maxWidth: '500px', // Largura máxima elegante
        borderRadius: '12px',
        background: palette.background,
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flexShrink: 0,
        flexGrow: 1, // Permite crescer até o máximo
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '6px',
          bgcolor: palette.primary,
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
        },
        '@media (max-width: 900px)': {
          width: '100%', // Em telas menores vira uma coluna
          maxWidth: 'none',
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar
                  sx={{
                    bgcolor: status.color,
                    width: 24,
                    height: 24,
                    border: `2px solid ${palette.background}`,
                  }}
                >
                  {status.icon}
                </Avatar>
              }
            >
              <Avatar
                sx={{
                  bgcolor: palette.primary,
                  width: 44,
                  height: 44,
                  boxShadow: '0 2px 8px rgba(121, 66, 214, 0.3)',
                }}
              >
                <DiscountIcon sx={{ color: palette.white, fontSize: 22 }} />
              </Avatar>
            </Badge>

            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: palette.textPrimary }}
              >
                {safeCoupon.code || 'Código não disponível'}
              </Typography>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                {status.label}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Chip
              label={formattedDiscount}
              sx={{
                bgcolor: palette.primaryLighter,
                color: palette.primary,
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: `1px solid ${palette.primaryLight}`,
              }}
            />
          </Box>
        </Box>

        {/* Barra de progresso */}
        <Box
          sx={{
            height: '6px',
            bgcolor: palette.grey,
            borderRadius: '4px',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${usagePercentage}%`,
              height: '100%',
              bgcolor: palette.primary,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }}
          />
        </Box>

        {/* Informações principais */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <UsersIcon sx={{ color: palette.primary }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: palette.textSecondary }}
              >
                Usos
              </Typography>
              <Typography
                fontWeight="medium"
                sx={{ color: palette.textPrimary }}
              >
                {safeCoupon.currentUses}/{safeCoupon.maxUses}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarIcon sx={{ color: palette.primary }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: palette.textSecondary }}
              >
                Validade
              </Typography>
              <Typography
                fontWeight="medium"
                sx={{ color: palette.textPrimary }}
              >
                {formattedDate(safeCoupon.expirationDate)}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarIcon sx={{ color: palette.primary }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: palette.textSecondary }}
              >
                Criado em
              </Typography>
              <Typography
                fontWeight="medium"
                sx={{ color: palette.textPrimary }}
              >
                {formattedDate(safeCoupon.createdAt)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Ações */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${palette.grey}`,
          }}
        >
          <Tooltip title="Copiar código">
            <IconButton
              onClick={() => handleCopy(safeCoupon.code)}
              sx={{
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: palette.primary,
                  '& .MuiSvgIcon-root': {
                    color: palette.hoverIcon,
                  },
                },
              }}
            >
              <CopyIcon
                sx={{
                  color: palette.primary,
                  transition: 'color 0.2s ease',
                }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton
              onClick={() => onEdit(safeCoupon)}
              sx={{
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: palette.primary,
                  '& .MuiSvgIcon-root': {
                    color: palette.hoverIcon,
                  },
                },
              }}
            >
              <EditIcon
                sx={{
                  color: palette.primary,
                  transition: 'color 0.2s ease',
                }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton
              onClick={() => onDelete(safeCoupon._id)}
              sx={{
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: palette.error,
                  '& .MuiSvgIcon-root': {
                    color: palette.white,
                  },
                },
              }}
            >
              <DeleteIcon
                sx={{
                  color: palette.error,
                  transition: 'color 0.2s ease',
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const CouponList = ({
  coupons = [],
  filter = 'all',
  emptyMessage = <Typography>Nenhum cupom encontrado</Typography>,
  onEdit,
  onDelete,
  onCopy,
  loading = false,
}) => {
  // Filtra os cupons baseado no status e no filtro selecionado
  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === 'all') return true;

    const status =
      coupon.currentUses >= coupon.maxUses
        ? 'used'
        : new Date(coupon.expirationDate) <= new Date()
        ? 'expired'
        : coupon.isActive
        ? 'active'
        : 'inactive';

    return filter === status;
  });

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={18} sm={12} key={i}>
            <CouponCard loading />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (filteredCoupons.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {emptyMessage}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px', // Espaço entre os cards
        justifyContent: 'center', // Centraliza quando não preenche a linha
        padding: 2,
        '& > *': {
          flex: '1 1 auto', // Flexibilidade controlada
        },
      }}
    >
      {filteredCoupons.map((coupon) => (
        <CouponCard
          key={coupon._id}
          coupon={coupon}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      ))}
    </Box>
  );
};

export default CouponList;
