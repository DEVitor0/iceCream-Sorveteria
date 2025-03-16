import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';
import SoftInput from '../../../components/Dashboard/SoftInput';
import SoftButton from '../../../components/Dashboard/SoftButton';
import ErrorPopup from '../../../examples/ErrorPopup/index';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';

function TwoFAScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(null);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) {
        setCsrfToken(token);
      }
    };
    getCsrfToken();
  }, []);

  useEffect(() => {
    const isCodeComplete = code.every((digit) => digit !== '');
    if (isCodeComplete) {
      submitButtonRef.current.click();
    }
  }, [code]);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1].focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');

    try {
      const response = await fetch('http://localhost:8443/validate-2fa', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          email: localStorage.getItem('email'),
          code: fullCode,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          navigate('/Dashboard');
        }, 100);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Código inválido. Tente novamente.');
      }
    } catch (error) {
      setError('Erro na conexão com o servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <SoftBox
      component="form"
      role="form"
      onSubmit={handleSubmit}
      noValidate
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={3}
    >
      {error && <ErrorPopup message={error} onClose={() => setError('')} />}
      <SoftBox
        bgcolor="background.paper"
        borderRadius="12px"
        boxShadow={3}
        p={4}
        width="100%"
        maxWidth="400px"
        textAlign="center"
      >
        <SoftTypography
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          mb={3}
        >
          Autenticação de Dois Fatores
        </SoftTypography>
        <SoftTypography variant="body2" color="text.secondary" mb={4}>
          Insira o código de 6 dígitos enviado para o seu e-mail.
        </SoftTypography>
        <SoftBox display="flex" justifyContent="space-between" gap={2} mb={4}>
          {code.map((digit, index) => (
            <SoftInput
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputRef={(el) => (inputRefs.current[index] = el)}
              maxLength="1"
              sx={{
                width: '40px',
                height: '60px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                border: '2px solid',
                borderColor: focusedIndex === index ? '#9B8AE6' : 'divider',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  borderColor: '#9B8AE6',
                  boxShadow: '0 0 0 3px rgba(155, 138, 230, 0.2)',
                },
              }}
            />
          ))}
        </SoftBox>
        <SoftButton
          variant="gradient"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
          ref={submitButtonRef}
        >
          Validar Código
        </SoftButton>
      </SoftBox>
    </SoftBox>
  );
}

export default TwoFAScreen;
