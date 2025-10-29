import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, IconButton, styled } from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import Socials from '../components/Socials';

// Configuração da fonte Poppins
const fontStyle = {
  fontFamily: '"Poppins", sans-serif',
};

const HorizontalContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f9f5ff 0%, #f0e8ff 100%)',
  ...fontStyle,
});

const FormSection = styled(motion.div)({
  flex: 1,
  padding: '4rem',
  maxWidth: '600px',
});

const VisualSection = styled(motion.div)({
  flex: 1,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #8C4FED 0%, #6a30d6 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  ...fontStyle,
});

const StepIndicator = styled(motion.div)({
  position: 'absolute',
  top: '2rem',
  left: '2rem',
  display: 'flex',
  gap: '0.5rem',
});

const StepDot = styled(motion.div)(({ active }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: active ? 'white' : 'rgba(255,255,255,0.3)',
  cursor: 'pointer',
}));

// Input customizado
const CustomInput = styled(motion.input)({
  width: '100%',
  padding: '1rem',
  marginBottom: '1.5rem',
  border: '2px solid #e0d0ff',
  borderRadius: '12px',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  ...fontStyle,
  '&:focus': {
    borderColor: '#8C4FED',
    boxShadow: '0 0 0 3px rgba(140, 79, 237, 0.2)',
  },
});

// Checkbox customizado
const CustomCheckbox = styled(Box)(({ checked }) => ({
  width: 20,
  height: 20,
  borderRadius: 4,
  border: '2px solid #8C4FED',
  backgroundColor: checked ? '#8C4FED' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
  transition: 'all 0.2s ease',
  '&:after': {
    content: '""',
    display: checked ? 'block' : 'none',
    width: 12,
    height: 12,
    backgroundImage:
      'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
}));

export default function HorizontalSignUp() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      }
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (step === 3) {
      if (!formData.password.trim()) {
        newErrors.password = 'Senha é obrigatória';
      }
      if (!acceptedTerms) {
        newErrors.terms = 'Você deve aceitar os termos e condições';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <HorizontalContainer>
      <FormSection
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <motion.h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#8C4FED',
              marginBottom: '0.5rem',
              ...fontStyle,
            }}
          >
            Crie sua conta
          </motion.h1>
          <motion.p
            style={{
              textAlign: 'left',
              color: '#666',
              ...fontStyle,
            }}
          >
            Já possui uma conta?{' '}
            <a
              href="https://allowing-llama-seemingly.ngrok-free.app/authentication/login"
              style={{
                color: '#8C4FED',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Faça login aqui
            </a>
          </motion.p>
        </Box>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CustomInput
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleChange('name')}
                onKeyPress={handleKeyPress}
                whileFocus={{ scale: 1.01 }}
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ff4757',
                    fontSize: '0.9rem',
                    marginTop: '-1rem',
                    marginBottom: '1rem',
                  }}
                >
                  {errors.name}
                </motion.p>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#8C4FED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    ...fontStyle,
                  }}
                >
                  Continuar <ArrowForward />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CustomInput
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange('email')}
                onKeyPress={handleKeyPress}
                whileFocus={{ scale: 1.01 }}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ff4757',
                    fontSize: '0.9rem',
                    marginTop: '-1rem',
                    marginBottom: '1rem',
                  }}
                >
                  {errors.email}
                </motion.p>
              )}

              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'none',
                    color: '#8C4FED',
                    border: '2px solid #8C4FED',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    ...fontStyle,
                  }}
                  whileHover={{ background: '#f5f0ff' }}
                >
                  Voltar
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: '#8C4FED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    ...fontStyle,
                  }}
                  whileHover={{ background: '#7d45e0' }}
                >
                  Continuar <ArrowForward />
                </motion.button>
              </Box>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ position: 'relative' }}>
                <CustomInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange('password')}
                  onKeyPress={handleKeyPress}
                  whileFocus={{ scale: 1.01 }}
                  style={{ paddingRight: '4.5rem' }}
                />
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '0.7rem',
                    color: '#8C4FED',
                    padding: '0.5rem',
                    '& svg': {
                      fontSize: '1.5rem',
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ff4757',
                    fontSize: '0.9rem',
                    marginTop: '-1rem',
                    marginBottom: '1rem',
                  }}
                >
                  {errors.password}
                </motion.p>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  cursor: 'pointer',
                  ...fontStyle,
                }}
                onClick={() => {
                  setAcceptedTerms(!acceptedTerms);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: '' });
                  }
                }}
              >
                <CustomCheckbox checked={acceptedTerms} />
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.9rem',
                    ml: 1,
                  }}
                >
                  Eu aceito os termos e condições
                </Box>
              </Box>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ff4757',
                    fontSize: '0.9rem',
                    marginTop: '-1.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {errors.terms}
                </motion.p>
              )}

              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'none',
                    color: '#8C4FED',
                    border: '2px solid #8C4FED',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    ...fontStyle,
                  }}
                  whileHover={{ background: '#f5f0ff' }}
                >
                  Voltar
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: '#8C4FED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    ...fontStyle,
                  }}
                  whileHover={{ background: '#7d45e0' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Finalizar cadastro
                </motion.button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '2rem' }}
          >
            <Socials />
          </motion.div>
        )}
      </FormSection>

      <VisualSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StepIndicator>
          {[1, 2, 3].map((i) => (
            <StepDot
              key={i}
              active={i <= step}
              onClick={() => setStep(i)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </StepIndicator>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          <motion.h2
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              marginBottom: '1rem',
              ...fontStyle,
            }}
          >
            {step === 1 && 'Bem-vindo!'}
            {step === 2 && 'Seus dados'}
            {step === 3 && 'Segurança'}
          </motion.h2>

          <motion.p
            style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              ...fontStyle,
            }}
          >
            {step === 1 && 'Estamos felizes por você querer se juntar a nós.'}
            {step === 2 && 'Precisamos do seu email para contato.'}
            {step === 3 && 'Crie uma senha segura para proteger sua conta.'}
          </motion.p>
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </VisualSection>
    </HorizontalContainer>
  );
}
