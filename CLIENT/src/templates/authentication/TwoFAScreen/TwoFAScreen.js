import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';
import SoftInput from '../../../components/Dashboard/SoftInput';
import SoftButton from '../../../components/Dashboard/SoftButton';
import ErrorPopup from '../../../examples/ErrorPopup/index';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';

function TwoFAScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) {
        setCsrfToken(token);
      }
    };
    getCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8443/validate-2fa', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email: localStorage.getItem('email'), code }),
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
    <SoftBox component="form" role="form" onSubmit={handleSubmit} noValidate>
      {error && <ErrorPopup message={error} onClose={() => setError('')} />}
      <SoftBox mb={2}>
        <SoftTypography component="label" variant="caption" fontWeight="bold">
          Código 2FA
        </SoftTypography>
        <SoftInput
          type="text"
          placeholder="Insira o código 2FA"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </SoftBox>
      <SoftBox mt={4} mb={1}>
        <SoftButton variant="gradient" color="info" fullWidth type="submit">
          Validar Código
        </SoftButton>
      </SoftBox>
    </SoftBox>
  );
}

export default TwoFAScreen;
