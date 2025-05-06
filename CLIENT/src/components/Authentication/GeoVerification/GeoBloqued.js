import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const GeoBlocked = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h4" gutterBottom color="error.main">
        Acesso Restrito
      </Typography>
      <Typography variant="body1" paragraph>
        {state?.error ||
          'Este conteúdo está disponível apenas para acessos originados do Brasil'}
      </Typography>

      {state?.detectedCountry && (
        <Typography variant="body2" color="text.secondary">
          País detectado: {state.detectedCountry}
        </Typography>
      )}

      {state?.clientIp && (
        <Typography variant="caption" color="text.secondary">
          IP: {state.clientIp}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate('/')}
      >
        Voltar à página inicial
      </Button>
    </Box>
  );
};

export default GeoBlocked;
