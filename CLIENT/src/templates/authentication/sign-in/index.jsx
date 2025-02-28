import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';
import SoftInput from '../../../components/Dashboard/SoftInput';
import SoftButton from '../../../components/Dashboard/SoftButton';
import CoverLayout from '../components/CoverLayout/index';
import iceCreamImage from '../../../media/images/dashboard/icecreams/loginIceCream.jpg';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';
import ErrorPopup from '../../../examples/ErrorPopup/index';
import PreventClosePopup from '../../../utils/PreventClosePopup/PreventClosePopup';

const validateFields = (email, password, setError) => {
  if (!email || !password) {
    setError('Preencha todos os campos!');
    return false;
  }

  if (email.length > 35 || password.length > 25) {
    setError('Campos excedem o tamanho máximo!');
    return false;
  }

  if (!email.includes('@') || !email.includes('.')) {
    setError('Endereço de email inválido');
    return false;
  }

  return true;
};

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) setCsrfToken(token);
    };
    getCsrfToken();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsFormDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields(email, password, setError)) return;

    try {
      const response = await fetch('http://localhost:8443/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        // Redireciona imediatamente após login bem-sucedido
        navigate('/Dashboard'); // Alterado para usar navigate
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Falha ao autenticar');
      }
    } catch (error) {
      setError('Erro na conexão com o servidor');
    }
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={iceCreamImage}
    >
      <PreventClosePopup hasUnsavedChanges={() => isFormDirty} />
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        {error && <ErrorPopup message={error} onClose={() => setError('')} />}
        <SoftBox mb={2}>
          <SoftTypography component="label" variant="caption" fontWeight="bold">
            Email
          </SoftTypography>
          <SoftInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange(setEmail)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftTypography component="label" variant="caption" fontWeight="bold">
            Password
          </SoftTypography>
          <SoftInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword)}
          />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth type="submit">
            Sign in
          </SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{' '}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
