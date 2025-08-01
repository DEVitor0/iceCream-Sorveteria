import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGeo } from '../../../contexts/GeoContext/GeoContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const GeoProtectedRoute = ({ children, adminOnly = false }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { allowed, loading, setAllowed } = useGeo();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkGeo = async () => {
      try {
        console.log('Iniciando verificação geográfica...');
        const response = await axios.get('/api/verify-geo', {
          withCredentials: true,
        });

        if (response.data.allowed) {
          setAllowed(true);
          console.log('Acesso geográfico permitido');
        } else {
          throw new Error('Acesso não permitido');
        }
      } catch (err) {
        console.error('Falha na verificação geográfica:', err);
        setAllowed(false);

        enqueueSnackbar('Acesso restrito ao Brasil', {
          variant: 'error',
          preventDuplicate: true,
        });

        navigate('/geo-blocked', {
          state: {
            from: location,
            error: 'Acesso permitido apenas do Brasil',
            clientIp: err.response?.data?.clientIp,
          },
          replace: true,
        });
      }
    };

    checkGeo();
  }, [location, navigate, enqueueSnackbar, setAllowed]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verificando permissões de acesso...
        </Typography>
      </Box>
    );
  }

  return allowed ? children : null;
};

export default GeoProtectedRoute;
