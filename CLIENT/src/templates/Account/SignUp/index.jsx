import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../media/icons/fontawesome';
import image from '../../../utils/imageManager/imageManager';
import Form from '../../../components/Account/form';
import { fetchCsrfToken } from '../../../utils/csrf/csurfValidation';
import {
  validateFields,
  showErrorMessage,
} from '../../../utils/formValidations/formValidation';
import { phoneIsValid } from '../../../utils/formValidations/signupValidations';
import styles from '../../../styles/scss/Account/account.module.scss';

const SignUp = () => {
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

  const internalHandleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value; // Corrigido: acessa event.target
    const password = event.target.senha.value; // Corrigido: acessa event.target
    const phone = event.target.phone.value; // Corrigido: acessa event.target

    if (!validateFields(email, password, styles)) {
      return;
    }

    if (!phoneIsValid(phone, styles)) {
      return;
    }

    if (!csrfToken) {
      showErrorMessage('CSRF Token não encontrado!', styles);
      return;
    }

    console.log('Token CSRF sendo enviado no cabeçalho:', csrfToken);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorMessage(error.message || 'Erro ao realizar cadastro.', styles);
        return;
      }

      const result = await response.json();
      if (result.redirectUrl) {
        navigate(result.redirectUrl);
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      showErrorMessage('Erro interno. Tente novamente mais tarde.', styles);
    }
  };

  return (
    <Form
      title="Registrar"
      linkText="Login/"
      route="/entrar"
      emailPlaceholder="Digite seu email"
      passwordPlaceholder="Digite sua senha"
      forgetPasswordText="Esqueceu a senha ?"
      submitButtonText="Cadastrar-se"
      internalHandleSubmit={internalHandleSubmit}
      icons={{
        envelop: (
          <FontAwesomeIcon icon={icons.envelop} data-testid="svg-inline--fa" />
        ),
        phone: (
          <FontAwesomeIcon icon={icons.phone} data-testid="svg-inline--fa" />
        ),
        lock: (
          <FontAwesomeIcon icon={icons.lock} data-testid="svg-inline--fa" />
        ),
      }}
      image={{ person: image.person }}
      isLoginForm={true}
    ></Form>
  );
};

export default SignUp;
