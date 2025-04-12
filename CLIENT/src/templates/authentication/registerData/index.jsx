import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Paper,
  Divider,
  styled,
  Autocomplete,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { fetchAddressByCEP } from '../../../utils/fetchAddressByCEP/cepService';
import HeaderBar from '../../../components/Home/screens/navbar/header/index';
import { useSnackbar } from 'notistack';
import ErrorPopup from '../../../examples/Cards/ErrorPopup/index';
import SuccessPopup from '../../../examples/Cards/SuccessPopup/SuccessPopup';

const PurplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(140, 79, 237, 0.2)',
  background: 'linear-gradient(145deg, #ffffff, #f5edff)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: '#8C4FED',
  },
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const estadosBrasileiros = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' },
];

const RegisterDatas = () => {
  const [formData, setFormData] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [errors, setErrors] = useState({
    cep: false,
    logradouro: false,
    numero: false,
    bairro: false,
    cidade: false,
    estado: false,
  });

  const [loading, setLoading] = useState({
    cep: false,
    submit: false,
  });

  const [cepValid, setCepValid] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleCepSearch = async () => {
    const cleanedCEP = formData.cep.replace(/\D/g, '');
    if (cleanedCEP.length !== 8) return;

    setLoading((prev) => ({ ...prev, cep: true }));
    setCepValid(null);

    try {
      const addressData = await fetchAddressByCEP(cleanedCEP);

      setFormData((prev) => ({
        ...prev,
        logradouro: addressData.logradouro || '',
        bairro: addressData.bairro || '',
        cidade: addressData.cidade || '',
        estado: addressData.estado || '',
        cep: addressData.cep || cleanedCEP,
      }));

      setCepValid(true);
      enqueueSnackbar('CEP encontrado!', { variant: 'success' });
    } catch (error) {
      setCepValid(false);
      enqueueSnackbar('CEP não encontrado. Preencha manualmente.', {
        variant: 'error',
      });
    } finally {
      setLoading((prev) => ({ ...prev, cep: false }));
    }
  };

  useEffect(() => {
    const cleanedCEP = formData.cep.replace(/\D/g, '');
    if (cleanedCEP.length === 8) {
      handleCepSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.cep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cep') {
      const formattedValue = formatCEP(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (value.trim() === '' && name !== 'complemento') {
      setErrors((prev) => ({ ...prev, [name]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleEstadoChange = (event, value) => {
    const sigla = value ? value.sigla : '';
    setFormData((prev) => ({ ...prev, estado: sigla }));
    setErrors((prev) => ({ ...prev, estado: sigla === '' }));
  };

  const formatCEP = (cep) => {
    const digits = cep.replace(/\D/g, '');
    return digits
      .slice(0, 8)
      .replace(/(\d{5})(\d{0,3})/, (match, p1, p2) =>
        p2 ? `${p1}-${p2}` : p1,
      );
  };

  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8443/csrf-token', {
          credentials: 'include',
        });
        const { csrfToken } = await response.json();
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('Erro ao buscar token CSRF:', error);
        enqueueSnackbar('Erro ao configurar segurança', { variant: 'error' });
      }
    };

    fetchCsrfToken();
  }, [enqueueSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));

    const formErrors = {
      cep: formData.cep.replace(/\D/g, '').length !== 8,
      logradouro: formData.logradouro.trim() === '',
      numero: formData.numero.trim() === '',
      bairro: formData.bairro.trim() === '',
      cidade: formData.cidade.trim() === '',
      estado: formData.estado.trim() === '',
    };

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error)) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', {
        variant: 'error',
      });
      setLoading((prev) => ({ ...prev, submit: false }));
      return;
    }

    if (!csrfToken) {
      enqueueSnackbar('Sistema de segurança não carregado. Tente novamente.', {
        variant: 'error',
      });
      setLoading((prev) => ({ ...prev, submit: false }));
      return;
    }

    try {
      console.log('[FRONT] Enviando requisição para /address', {
        formData,
        csrfToken,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
      });
      const response = await fetch('http://localhost:8443/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include', // Isso é essencial para enviar cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('[FRONT] Resposta bem-sucedida:', data);

      console.log('[FRONT] Resposta recebida - status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[FRONT] Erro na resposta:', errorData);
        throw new Error(data.message || 'Erro ao cadastrar endereço');
      }

      enqueueSnackbar('Endereço cadastrado com sucesso!', {
        variant: 'success',
      });

      setFormData({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      });
      setCepValid(null);
    } catch (error) {
      console.error('[FRONT] Erro na requisição:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      enqueueSnackbar(error.message || 'Erro ao cadastrar endereço', {
        variant: 'error',
      });

      // Se o erro for de CSRF, atualize o token
      if (error.message.includes('CSRF')) {
        const newResponse = await fetch('http://localhost:8443/csrf-token', {
          credentials: 'include',
        });
        const { csrfToken: newToken } = await newResponse.json();
        setCsrfToken(newToken);
      }
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <>
      <HeaderBar />
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(85vh - 64px)',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <PurplePaper>
            <Box textAlign="center" mb={4}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="#8C4FED"
                  gutterBottom
                >
                  <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Cadastrar Endereço
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Preencha seus dados de endereço para continuar
                </Typography>
              </motion.div>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 1fr' },
                  gap: 3,
                }}
              >
                <motion.div
                  variants={itemVariants}
                  sx={{ gridColumn: '1 / -1' }}
                >
                  <TextField
                    fullWidth
                    label="CEP"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    error={errors.cep}
                    helperText={errors.cep && 'CEP inválido'}
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                        alignItems: 'center',
                        display: 'flex',
                      },
                      inputProps: {
                        style: {
                          padding: '0',
                          margin: '0',
                          lineHeight: '1.5',
                          textAlign: 'left',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& input': {
                          width: '100%',
                          paddingLeft: '14px',
                        },
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: '1rem',
                      },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    required
                  />
                  <AnimatePresence>
                    {cepValid === true && (
                      <SuccessPopup
                        message="CEP válido encontrado!"
                        onClose={() => setCepValid(null)}
                      />
                    )}
                    {cepValid === false && (
                      <ErrorPopup
                        message="CEP não encontrado. Preencha manualmente."
                        onClose={() => setCepValid(null)}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  sx={{ gridColumn: '1 / -1' }}
                >
                  <TextField
                    fullWidth
                    label="Rua/Avenida"
                    name="logradouro"
                    value={formData.logradouro}
                    onChange={handleChange}
                    error={errors.logradouro}
                    helperText={errors.logradouro && 'Campo obrigatório'}
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Número"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    error={errors.numero}
                    helperText={errors.numero && 'Campo obrigatório'}
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    placeholder="Ex: Casa 1, Apt 302, Bloco B"
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    error={errors.bairro}
                    helperText={errors.bairro && 'Campo obrigatório'}
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    error={errors.cidade}
                    helperText={errors.cidade && 'Campo obrigatório'}
                    variant="outlined"
                    InputProps={{
                      style: {
                        padding: '14px',
                        height: '56px',
                        fontSize: '1rem',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      sx: {
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    }}
                    required
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 2,
                    alignItems: 'center',
                    gridColumn: { md: 'span 2' },
                  }}
                >
                  <Autocomplete
                    options={estadosBrasileiros}
                    getOptionLabel={(option) =>
                      option ? `${option.nome} (${option.sigla})` : ''
                    }
                    value={
                      estadosBrasileiros.find(
                        (e) => e.sigla === formData.estado,
                      ) || null
                    }
                    onChange={handleEstadoChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estado"
                        error={errors.estado}
                        helperText={errors.estado && 'Selecione um estado'}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            padding: '14px',
                            height: '56px',
                            fontSize: '1rem',
                          },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                          sx: {
                            transform: 'translate(14px, 10px) scale(1)',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)',
                            },
                          },
                        }}
                        required
                      />
                    )}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={loading.submit}
                    variant="contained"
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      height: '36px',
                      minWidth: '100%',
                      padding: '0 24px',
                      background:
                        'linear-gradient(45deg, #8C4FED 0%, #6C3BEB 100%)',
                      color: 'white !important',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(140, 79, 237, 0.2)',
                      textTransform: 'none',
                      fontSize: '1rem',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background:
                          'linear-gradient(45deg, #7B45E0 0%, #5B30D0 100%)',
                        boxShadow: '0 6px 10px rgba(140, 79, 237, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&.Mui-disabled': {
                        background: '#E0E0E0',
                        color: '#9E9E9E',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading.submit ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                </motion.div>
              </Box>
            </form>
          </PurplePaper>
        </motion.div>
      </Container>
    </>
  );
};

export default RegisterDatas;
