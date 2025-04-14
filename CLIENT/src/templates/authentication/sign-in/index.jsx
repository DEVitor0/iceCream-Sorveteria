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
import ErrorPopup from '../../../examples/Cards/ErrorPopup/index';
import PreventClosePopup from '../../../utils/PreventClosePopup/PreventClosePopup';
import useRedirectIfAuthenticated from '../../../hooks/Authentication/useRedirectIfAuthenticated';
import { CircularProgress } from '@mui/material';

const validateFields = (
  email,
  password,
  setError,
  setEmailError,
  setPasswordError,
) => {
  let isValid = true;

  if (!email) {
    setEmailError(true);
    setError('Preencha o campo de email!');
    isValid = false;
  } else {
    setEmailError(false);
  }

  if (!password) {
    setPasswordError(true);
    setError('Preencha o campo de senha!');
    isValid = false;
  } else {
    setPasswordError(false);
  }

  if (password.length < 6) {
    setPasswordError(true);
    setError('A senha deve ter no mínimo 6 caracteres.');
    isValid = false;
  }

  if (email.length > 35 || password.length > 25) {
    setError('Campos excedem o tamanho máximo!');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setEmailError(true);
    setError('Endereço de email inválido.');
    isValid = false;
  }

  return isValid;
};

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useRedirectIfAuthenticated();

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

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    if (
      !validateFields(
        email,
        password,
        setError,
        setEmailError,
        setPasswordError,
      )
    ) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8443/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        localStorage.setItem('email', email);
        navigate('/validate-2fa');
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || 'Credenciais inválidas. Tente novamente.',
        );
      }
    } catch (error) {
      setError('Erro na conexão com o servidor. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={iceCreamImage}
    >
      <PreventClosePopup hasUnsavedChanges={() => isFormDirty} />
      <SoftBox component="form" role="form" onSubmit={handleSubmit} noValidate>
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
            required={false}
            error={emailError}
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
            required={false}
            error={passwordError}
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
          <SoftButton
            variant="gradient"
            color="info"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar'
            )}
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
