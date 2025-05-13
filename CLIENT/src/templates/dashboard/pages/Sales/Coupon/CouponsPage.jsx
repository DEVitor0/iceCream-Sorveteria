import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Add, FilterList, Search, Sort, Refresh } from '@mui/icons-material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import DoneAll from '@mui/icons-material/DoneAll';
import Warning from '@mui/icons-material/Warning';
import Block from '@mui/icons-material/Block';
import TextField from '@mui/material/TextField';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import CouponList from '../../../../../components/Coupons/CouponList';
import useCoupons from '../../../../../hooks/Coupons/useCoupons';

const StatCard = ({ value, label, color, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'active':
        return <TrendingUp sx={{ color }} />;
      case 'used':
        return <DoneAll sx={{ color }} />;
      case 'expired':
        return <Warning sx={{ color }} />;
      default:
        return <Block sx={{ color }} />;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        height: '100%',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {label}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: `${color}20`,
            }}
          >
            {getIcon()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const CouponsPage = () => {
  const { coupons, loading, error, refreshCoupons } = useCoupons();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const filteredCoupons = (coupons || []).filter((coupon) => {
    // Filtro por status
    const statusMatch =
      filter === 'all' ||
      (filter === 'active' && coupon.status === 'active') ||
      (filter === 'used' && coupon.status === 'used') ||
      (filter === 'expired' && coupon.status === 'expired') ||
      (filter === 'inactive' && coupon.status === 'inactive');

    // Filtro por busca
    const searchMatch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.discountValue.toString().includes(searchQuery);

    return statusMatch && searchMatch;
  });

  const statusCounts = (coupons || []).reduce(
    (acc, coupon) => {
      acc[coupon.status]++; // Usamos o status que calculamos no hook
      return acc;
    },
    { active: 0, expired: 0, used: 0, inactive: 0 },
  );

  const handleEditCoupon = (coupon) => {
    navigate(`/Dashboard/Vendas/Cupom/Editar/${coupon._id}`);
  };

  const handleDeleteCoupon = async (couponId) => {
    // Implemente a lógica de exclusão aqui
    console.log('Deletar cupom:', couponId);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarMessage('Código copiado com sucesso!');
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <VerticalMenu />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '95%',
            margin: '30px auto 30px auto',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <DashboardNavbar />
        </Box>

        <Container
          maxWidth="xl"
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #8C4FED 0%, #6E3AC9 100%)',
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: '#fff' }}
                  >
                    Gerenciar Cupons
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, color: '#fff' }}
                  >
                    {(coupons || []).length} cupons cadastrados
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#8C4FED',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                  onClick={() => navigate('/Dashboard/Vendas/Cupom/Criar')}
                >
                  Novo Cupom
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              mb: 4,
            }}
          >
            <Grid
              container
              spacing={0} // Removemos o espaçamento padrão do Grid
              sx={{
                width: '100%',
                marginLeft: 0,
                display: 'flex',
                justifyContent: 'space-between', // Distribui o espaço uniformemente
              }}
            >
              <Grid item xs={12} sm={3} sx={{ flex: 1, minWidth: 0, p: 1 }}>
                <StatCard
                  value={statusCounts.active}
                  label="Ativos"
                  color="#4CAF50"
                  icon="active"
                  sx={{
                    height: '100%',
                    minHeight: '120px', // Altura mínima aumentada
                    borderRadius: '12px',
                    boxShadow: 1, // Adiciona sombra para melhor visualização
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} sx={{ flex: 1, minWidth: 0, p: 1 }}>
                <StatCard
                  value={statusCounts.used}
                  label="Usados"
                  color="#FF9800"
                  icon="used"
                  sx={{
                    height: '100%',
                    minHeight: '120px',
                    borderRadius: '12px',
                    boxShadow: 1,
                    ml: 2, // Margem entre os cards
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} sx={{ flex: 1, minWidth: 0, p: 1 }}>
                <StatCard
                  value={statusCounts.expired}
                  label="Expirados"
                  color="#F44336"
                  icon="expired"
                  sx={{
                    height: '100%',
                    minHeight: '120px',
                    borderRadius: '12px',
                    boxShadow: 1,
                    ml: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} sx={{ flex: 1, minWidth: 0, p: 1 }}>
                <StatCard
                  value={statusCounts.inactive}
                  label="Inativos"
                  color="#9E9E9E"
                  icon="inactive"
                  sx={{
                    height: '100%',
                    minHeight: '120px',
                    borderRadius: '12px',
                    boxShadow: 1,
                    ml: 2,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Controles de Filtro e Busca */}
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <Search sx={{ mr: 1, color: 'action.active' }} />
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar cupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    sx={{
                      color: '#344767',
                      borderRadius: 3,
                      border: '1px solid #A3A3A3 !important',
                    }}
                  >
                    Filtros
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Sort />}
                    sx={{
                      color: '#344767',
                      borderRadius: 3,
                      border: '1px solid #A3A3A3 !important',
                    }}
                  >
                    Ordenar
                  </Button>
                  <IconButton
                    onClick={refreshCoupons}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: '#8C4FED',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#7B44D8',
                        color: '#fefefe',
                      },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </Box>

              <Tabs
                value={filter}
                onChange={(e, newValue) => setFilter(newValue)}
                sx={{ mt: 2 }}
                indicatorColor="secondary"
                textColor="secondary"
              >
                <Tab label="Todos" value="all" />
                <Tab label={`Ativos (${statusCounts.active})`} value="active" />
                <Tab label={`Usados (${statusCounts.used})`} value="used" />
                <Tab
                  label={`Expirados (${statusCounts.expired})`}
                  value="expired"
                />
                <Tab
                  label={`Inativos (${statusCounts.inactive})`}
                  value="inactive"
                />
              </Tabs>
            </CardContent>
          </Card>

          {/* Lista de Cupons */}
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
                style={{ width: '100%', maxWidth: '1200px' }}
              >
                <CouponList
                  coupons={filteredCoupons}
                  filter={filter}
                  emptyMessage={
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <Typography variant="h6" color="textSecondary">
                        Nenhum cupom encontrado
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() =>
                          navigate('/Dashboard/Vendas/Cupom/Criar')
                        }
                      >
                        Criar Primeiro Cupom
                      </Button>
                    </Box>
                  }
                  onEdit={handleEditCoupon}
                  onDelete={handleDeleteCoupon}
                  onCopy={handleCopyCode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CouponsPage;
