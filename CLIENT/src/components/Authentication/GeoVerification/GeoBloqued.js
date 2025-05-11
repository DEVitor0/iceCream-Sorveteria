import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const GeoBlocked = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* Ícone de localização com divider - Agora responsivo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              color: '#52478C',
              mr: { xs: 2, md: 3 },
              width: { xs: 100, sm: 120, md: 140 }, // Tamanhos aumentados
              height: { xs: 100, sm: 120, md: 140 },
              '& svg': {
                width: '100%',
                height: '100%',
              },
            }}
          >
            <LocationOnIcon />
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: '#52478C',
              borderWidth: 2,
              height: { xs: 140, md: 200 },
              borderRadius: 2,
              background:
                'linear-gradient(to bottom, rgba(82,71,140,0.2), #52478C, rgba(82,71,140,0.2))',
              boxShadow: '0 2px 8px rgba(82,71,140,0.3)',
            }}
          />
        </Box>

        {/* Conteúdo de texto */}
        <Box sx={{ flex: 1 }}>
          {/* Título */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1F2937',
              mb: { xs: 2, md: 2.5 },
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Seu endereço IP foi bloqueado
          </Typography>

          {/* Mensagem */}
          <Typography
            variant="body1"
            sx={{
              color: '#6B7280',
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.7,
              maxWidth: '90%',
            }}
          >
            Seu endereço foi bloqueado por considerar-se um acesso suspeito por
            nossa plataforma. Contate um administrador para desbloquear seu
            endereço.
          </Typography>

          {/* Botão */}
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#52478C',
              color: '#fff',
              px: { xs: 4, md: 5 },
              py: { xs: 1.5, md: 1.75 },
              borderRadius: 1.5,
              fontWeight: 600,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              textTransform: 'none',
              boxShadow: '0 3px 10px rgba(82,71,140,0.3)',
              '&:hover': {
                bgcolor: '#463A75',
                color: '#fff',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(82,71,140,0.4)',
              },
              transition: 'all 0.2s ease',
              minWidth: 180,
            }}
          >
            Voltar à página principal
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default GeoBlocked;
