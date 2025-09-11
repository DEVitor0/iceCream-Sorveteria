import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';
import PreventClosePopup from '../../../utils/PreventClosePopup/PreventClosePopup';
import useRedirectIfAuthenticated from '../../../hooks/Authentication/useRedirectIfAuthenticated';
import Socials from '../components/Socials/index'; // <-- seu componente de socials

// -------------------------------------------------------------------------------- //
//                                  Estilos Aprimorados                             //
// -------------------------------------------------------------------------------- //

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6153a4 0%, #7c6ecb 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6a6a6a;
  text-align: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid ${(props) => (props.error ? '#ff4d4f' : '#e0e0e0')};
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 1.25rem;
  background-color: #fafafa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6153a4;
    box-shadow: 0 0 0 3px rgba(97, 83, 164, 0.2);
  }
`;

const RememberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #6153a4;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #6153a4;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4e4291;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #b7aedc;
    cursor: not-allowed;
    transform: none;
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6a6a6a;
`;

const LinkStyled = styled(Link)`
  color: #6153a4;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

// -------------------------------------------------------------------------------- //
//                                 Componente SignIn                                //
// -------------------------------------------------------------------------------- //

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  useRedirectIfAuthenticated();

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const token = await fetchCsrfToken();
        if (token) setCsrfToken(token);
      } catch {
        setError('Não foi possível iniciar a sessão.');
      }
    };
    getCsrfToken();
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsFormDirty(true);
    if (setter === setEmail) setEmailError(false);
    if (setter === setPassword) setPasswordError(false);
  };

  const validateFields = () => {
    let valid = true;
    setEmailError(false);
    setPasswordError(false);
    setError('');

    if (!email) {
      setEmailError(true);
      setError('Email obrigatório');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setError('Email inválido');
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      setError('Senha obrigatória');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setError('Senha deve ter pelo menos 6 caracteres');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      if (!csrfToken) throw new Error('Token CSRF ausente');
      const res = await fetch(
        'https://allowing-llama-seemingly.ngrok-free.app/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (res.ok) {
        localStorage.setItem('email', email);
        navigate('/validate-2fa');
      } else {
        const data = await res.json();
        setError(data.message || 'Credenciais inválidas');
      }
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PreventClosePopup hasUnsavedChanges={() => isFormDirty} />
      <Card>
        <Title>Bem-vindo de volta</Title>
        <Subtitle>Entre com sua conta ou use um login social</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit} noValidate>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            error={emailError}
          />

          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            error={passwordError}
          />

          <RememberContainer>
            <Checkbox
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <Label htmlFor="remember">Lembrar-me</Label>
          </RememberContainer>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Aqui entra o seu componente Socials */}
        <Socials />

        <Footer>
          Não possui uma conta?{' '}
          <LinkStyled to="/authentication/registrar">Cadastre-se</LinkStyled>
        </Footer>
      </Card>
    </PageContainer>
  );
}

export default SignIn;
