import { Box, Typography, Chip, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';

const COLUMN_CONFIG = [
  { key: 'code', label: 'Código', flex: '20%' },
  { key: 'status', label: 'Status', flex: '15%' },
  { key: 'uses', label: 'Usos', flex: '15%' },
  { key: 'type', label: 'Tipo', flex: '10%' },
  { key: 'value', label: 'Valor', flex: '15%' },
  { key: 'expire', label: 'Validade', flex: '15%' },
  { key: 'actions', label: 'Ações', flex: '10%' },
];

const CouponList = ({ coupons, filter }) => {
  const filtered = coupons.filter((c) => {
    if (filter === 'active')
      return c.isActive && new Date(c.expirationDate) > new Date();
    if (filter === 'expired') return new Date(c.expirationDate) <= new Date();
    if (filter === 'used') return c.currentUses >= c.maxUses;
    return true;
  });

  if (!filtered.length) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        Nenhum cupom encontrado
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto', p: 1 }}>
      {/* Linha de cabeçalho */}
      <Box
        display="flex"
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}
      >
        {COLUMN_CONFIG.map((col) => (
          <Typography
            key={col.key}
            variant="subtitle2"
            fontWeight="bold"
            sx={{ flexBasis: col.flex, textAlign: 'center' }}
          >
            {col.label}
          </Typography>
        ))}
      </Box>

      {/* Linhas de dados */}
      {filtered.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            display="flex"
            width="100%"
            justifyContent="space-around"
            alignItems="center"
            sx={{
              py: 1,
              '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' },
            }}
          >
            <Typography
              sx={{
                flexBasis: '20%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {c.code}
            </Typography>

            <Box sx={{ flexBasis: '15%', textAlign: 'center' }}>
              <CouponStatus status={getCouponStatus(c)} />
            </Box>

            <Typography sx={{ flexBasis: '15%', textAlign: 'center' }}>
              {c.currentUses} / {c.maxUses}
            </Typography>

            <Typography sx={{ flexBasis: '10%', textAlign: 'center' }}>
              {c.discountType === 'percentage' ? '%' : 'R$'}
            </Typography>

            <Typography
              sx={{
                flexBasis: '15%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {c.discountType === 'percentage'
                ? `${c.discountValue}%`
                : `R$ ${c.discountValue.toFixed(2)}`}
            </Typography>

            <Typography sx={{ flexBasis: '15%', textAlign: 'center' }}>
              {c.discountType === 'percentage'
                ? `${c.discountValue}%`
                : `R$ ${c.discountValue.toFixed(2)}`}
            </Typography>

            <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>
              <IconButton href={`/coupons/edit/${c.id}`} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </motion.div>
      ))}
    </Paper>
  );
};

const CouponStatus = ({ status }) => {
  const iconMap = {
    expired: <ErrorIcon fontSize="small" />,
  };

  const colorMap = {
    active: 'success',
    expired: 'error',
    used: 'warning',
    inactive: 'default',
  };

  const labelMap = {
    active: 'Ativo',
    expired: 'Expirado',
    used: 'Usado',
    inactive: 'Inativo',
  };

  return (
    <Chip
      icon={iconMap[status]}
      label={labelMap[status]}
      color={colorMap[status]}
      size="small"
      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
    />
  );
};

const getCouponStatus = (c) => {
  if (!c.isActive) return 'inactive';
  if (c.currentUses >= c.maxUses) return 'used';
  if (new Date(c.expirationDate) <= new Date()) return 'expired';
  return 'active';
};

export default CouponList;
