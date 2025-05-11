import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalOffer as DiscountIcon,
  Event as CalendarIcon,
  People as UsersIcon,
  CheckCircle as ActiveIcon,
  Warning as ExpiredIcon,
  Block as UsedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CouponStatusChip = ({ status }) => {
  const theme = useTheme();

  const statusConfig = {
    active: {
      icon: <ActiveIcon fontSize="small" />,
      label: 'Ativo',
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
    },
    expired: {
      icon: <ExpiredIcon fontSize="small" />,
      label: 'Expirado',
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
    },
    used: {
      icon: <UsedIcon fontSize="small" />,
      label: 'Usado',
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
    },
    inactive: {
      icon: <UsedIcon fontSize="small" />,
      label: 'Inativo',
      color: theme.palette.grey[500],
      bgColor: theme.palette.grey[200],
    },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      sx={{
        color: config.color,
        backgroundColor: config.bgColor,
        fontWeight: 600,
        px: 1,
        borderRadius: 1,
      }}
      size="small"
    />
  );
};

const CouponCard = ({ coupon, onEdit, onDelete, onCopy }) => {
  const theme = useTheme();
  const status =
    coupon.currentUses >= coupon.maxUses
      ? 'used'
      : new Date(coupon.expirationDate) <= new Date()
      ? 'expired'
      : coupon.isActive
      ? 'active'
      : 'inactive';

  const formattedDate = (date) =>
    format(parseISO(new Date(date).toISOString()), 'dd/MM/yyyy', {
      locale: ptBR,
    });

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -4 }}
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: theme.shadows[2],
        borderLeft: `4px solid ${
          status === 'active'
            ? theme.palette.success.main
            : status === 'expired'
            ? theme.palette.warning.main
            : status === 'used'
            ? theme.palette.error.main
            : theme.palette.grey[500]
        }`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                width: 36,
                height: 36,
              }}
            >
              <DiscountIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {coupon.code}
            </Typography>
          </Box>
          <CouponStatusChip status={status} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Desconto
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {coupon.discountValue}
              {coupon.discountType === 'percentage' ? '%' : 'R$'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Usos
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {coupon.currentUses} / {coupon.maxUses}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Criado em
            </Typography>
            <Typography variant="body2">
              {formattedDate(coupon.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Expira em
            </Typography>
            <Typography variant="body2">
              {formattedDate(coupon.expirationDate)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
        >
          <Tooltip title="Copiar código">
            <IconButton onClick={() => onCopy(coupon.code)} size="small">
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(coupon)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton onClick={() => onDelete(coupon._id)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const CouponList = ({
  coupons,
  filter,
  emptyMessage,
  onEdit,
  onDelete,
  onCopy,
}) => {
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

  if (filteredCoupons.length === 0) {
    return emptyMessage;
  }

  return (
    <Box>
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
