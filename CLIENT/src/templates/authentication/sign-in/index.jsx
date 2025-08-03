import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';
import ErrorPopup from '../../../examples/Cards/ErrorPopup';
import PreventClosePopup from '../../../utils/PreventClosePopup/PreventClosePopup';
import useRedirectIfAuthenticated from '../../../hooks/Authentication/useRedirectIfAuthenticated';

// -------------------------------------------------------------------------------- //
//                                  Estilos Aprimorados                             //
// -------------------------------------------------------------------------------- //

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5; // Cor de fundo mais neutra e moderna
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); // Sombra mais sutil
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); // Sombra que cresce ao passar o mouse
  }
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6a6a6a;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: block; // Garante que a label ocupe toda a largura
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid ${(props) => (props.error ? '#ff4d4f' : '#e0e0e0')};
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 1.25rem;
  background-color: #f9f9f9;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    outline: none;
    border-color: #007aff; // Cor de foco mais vibrante
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2); // Sombra suave no foco
  }
`;

const RememberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #555;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #007aff; // Altera a cor do checkbox
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #007aff; // Cor de botão primária
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  &:hover {
    background-color: #0063cc;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    background-color: #a3ccf1;
    cursor: not-allowed;
    transform: none;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6a6a6a;
`;

const LinkStyled = styled(Link)`
  color: #007aff;
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
  margin-bottom: 1.5rem;
  text-align: center;
`;

// -------------------------------------------------------------------------------- //
//                                 Componente SignIn                                //
// -------------------------------------------------------------------------------- //

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
      try {
        const token = await fetchCsrfToken();
        if (token) setCsrfToken(token);
        else throw new Error('Falha ao obter o token CSRF.');
      } catch (err) {
        console.error('Erro ao buscar token CSRF:', err);
        setError('Não foi possível iniciar a sessão. Tente novamente.');
      }
    };
    getCsrfToken();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsFormDirty(true);
    // Limpar erro específico ao começar a digitar
    if (setter === setEmail) setEmailError(false);
    if (setter === setPassword) setPasswordError(false);
  };

  const validateFields = () => {
    let isValid = true;
    setEmailError(false);
    setPasswordError(false);
    setError('');

    if (!email) {
      setEmailError(true);
      setError('O campo de email é obrigatório.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setError('O email inserido não é válido.');
      isValid = false;
    }

    if (!password) {
      setPasswordError(true);
      setError('O campo de senha é obrigatório.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setError('A senha deve ter no mínimo 6 caracteres.');
      isValid = false;
    }

    if (email.length > 35 || password.length > 25) {
      setError('Campos excedem o tamanho máximo permitido.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!csrfToken) {
        throw new Error('Token CSRF ausente. Tente recarregar a página.');
      }

      const response = await fetch(
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

      if (response.ok) {
        localStorage.setItem('email', email);
        navigate('/validate-2fa');
      } else {
        const data = await response.json();
        setError(
          data.message || 'Credenciais inválidas. Verifique seu email e senha.',
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        'Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PreventClosePopup hasUnsavedChanges={() => isFormDirty} />
      <Card>
        <Title>Bem-vindo de volta</Title>
        <Subtitle>Insira seu e-mail e senha para continuar</Subtitle>
        <form onSubmit={handleSubmit} noValidate>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div>
            <Label htmlFor="email-input">Email</Label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              error={emailError}
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password-input">Senha</Label>
            <Input
              id="password-input"
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              error={passwordError}
              autoComplete="current-password"
            />
          </div>

          <RememberContainer>
            <Checkbox
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <Label htmlFor="remember-me">Lembrar-me</Label>
          </RememberContainer>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <Footer>
            Não possui uma conta?{' '}
            <LinkStyled to="/authentication/registrar">Cadastre-se</LinkStyled>
          </Footer>
        </form>
      </Card>
    </PageContainer>
  );
}

export default SignIn;
