import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  styled,
  Divider,
} from '@mui/material';
import { Download, InsertDriveFileOutlined } from '@mui/icons-material';
import { fetchCsrfToken } from '../../../../utils/csrf/csurfValidation';
import VerticalMenu from '../../components/DashboardBar/VerticalMenu/index';

// Componente estilizado
const ExportCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)',
  },
  maxWidth: '800px',
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#7B3AED',
  color: 'white',
  padding: '10px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '14px',
  minWidth: '140px',
  '&:hover': {
    backgroundColor: '#6A2ECD',
    boxShadow: '0px 4px 12px rgba(123, 58, 237, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#E0D0FF',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F3EBFF',
  borderRadius: '10px',
  padding: theme.spacing(2.5), // era 2
  marginRight: theme.spacing(1), // opcional: aumentar espaço entre ícone e texto
  color: '#7B3AED',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ExportDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const token = await fetchCsrfToken();
        if (token) setCsrfToken(token);
      } catch (err) {
        console.error('Erro ao obter CSRF token:', err);
        setError('Falha na segurança. Recarregue a página.');
      }
    };
    getCsrfToken();
  }, []);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!csrfToken) {
        const newToken = await fetchCsrfToken();
        if (!newToken) throw new Error('Falha ao obter token de segurança');
        setCsrfToken(newToken);
      }

      const response = await fetch(
        'https://allowing-llama-seemingly.ngrok-free.app/api/analytics/export',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-CSRF-Token': csrfToken,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Falha ao exportar dados');
      }

      const blob = await response.blob();
      saveAs(blob, 'analytics_export.xlsx');
      setSuccess(true);
    } catch (err) {
      console.error('Erro na exportação:', err);
      setError(err.message || 'Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <VerticalMenu />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: '600',
            color: '#3E3E3E',
            mb: 4,
          }}
        >
          Exportar Relatórios
        </Typography>

        <ExportCard elevation={0}>
          <IconContainer>
            <InsertDriveFileOutlined sx={{ fontSize: '36px !important' }} />
          </IconContainer>

          <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>
              Relatório de todo o período
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Exporte todos os dados analíticos em um arquivo Excel organizado
            </Typography>
          </Box>

          <DownloadButton
            variant="contained"
            onClick={handleExport}
            disabled={loading || !csrfToken}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Download />
              )
            }
          >
            {loading ? 'Gerando...' : 'Exportar'}
          </DownloadButton>
        </ExportCard>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Download iniciado com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExportDataPage;
