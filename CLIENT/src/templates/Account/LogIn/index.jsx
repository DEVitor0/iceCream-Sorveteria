import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../media/icons/fontawesome';
import image from '../../../utils/imageManager/imageManager';
import Form from '../../../components/Account/form';
import {
  validateFields,
  showErrorMessage,
} from '../../../utils/formValidations/formValidation';
import styles from '../../../styles/scss/Account/account.module.scss';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';

export const Login = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('/csrf-token', {
        credentials: 'include',
        cache: 'no-store', // Evita cache problemático
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()).csrfToken;
    } catch (error) {
      console.error('CSRF Error:', error);
      return null;
    }
  };

  // Use useCallback para evitar loops
  const getCsrfToken = useCallback(async () => {
    const token = await fetchCsrfToken();
    token && setCsrfToken(token);
  }, []);

  useEffect(() => {
    getCsrfToken();
  }, [getCsrfToken]);

  const internalHandleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('senha');

    // Resetar mensagens de erro
    form.querySelectorAll('.error-message').forEach((el) => el.remove());

    if (!validateFields(email, password, styles)) return;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Caso específico de CAPTCHA requerido
        if (data.requiresCaptcha) {
          navigate(data.redirectTo || '/validate-captcha', {
            state: {
              captchaToken: data.captchaToken,
              email, // Preserva email para autopreenchimento
            },
          });
          return;
        }

        // Erros de validação comuns
        showErrorMessage(data.message || 'Credenciais inválidas', styles);
        return;
      }

      // Login bem-sucedido
      if (data.redirectUrl) {
        navigate(data.redirectUrl);
      } else {
        navigate('/'); // Fallback
      }
    } catch (error) {
      console.error('[DEBUG] Erro completo:', error);
      showErrorMessage(
        error.message || 'Falha na comunicação com o servidor',
        styles,
      );
    }
  };

  return (
    <Form
      title="Login"
      linkText="Registrar/"
      route="/cadastrar"
      emailPlaceholder="Digite seu email"
      passwordPlaceholder="Digite sua senha"
      forgetPasswordText="Esqueceu a senha ?"
      submitButtonText="Entrar"
      internalHandleSubmit={internalHandleSubmit}
      icons={{
        envelop: (
          <FontAwesomeIcon icon={icons.envelop} data-testid="svg-inline--fa" />
        ),
        lock: (
          <FontAwesomeIcon icon={icons.lock} data-testid="svg-inline--fa" />
        ),
      }}
      image={{ person: image.person }}
    />
  );
};

export default Login;
