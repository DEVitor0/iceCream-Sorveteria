import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../media/icons/fontawesome';
import image from '../../../utils/imageManager/imageManager';
import Form from '../../../components/Account/form';

import styles from '../../../styles/scss/Account/account.module.scss';

export const showErrorMessage = (message) => {
  const form = document.querySelector('#form');
  if (!form) return;

  const existingMessage = Array.from(form.children).find((child) =>
    child.classList.contains(styles.errorMessage),
  );

  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement('div');
  messageDiv.classList.add(styles.errorMessage);
  const messageText = document.createElement('p');
  messageText.textContent = message;

  messageDiv.appendChild(messageText);
  form.appendChild(messageDiv);
};

export const emailIsValid = (email) => {
  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    showErrorMessage('Endereço de email inválido');
    return false;
  }
  return true;
};

export const passwordIsValid = (password) => {
  if (password && password.length > 25) {
    showErrorMessage('Senha muito longa');
    return false;
  }
  return true;
};

export const handleSubmit = async (event, csrfToken, navigate) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.senha.value;

  if (!email || !password) {
    showErrorMessage('Preencha todos os campos!');
    return;
  }

  if (!emailIsValid(email) || !passwordIsValid(password)) {
    return;
  }

  if (email.length > 35 || password.length > 25) {
    showErrorMessage('Campos excedem o tamanho máximo!');
    return;
  }

  if (!csrfToken) {
    showErrorMessage('CSRF Token não encontrado!');
    return;
  }

  console.log('Token CSRF sendo enviado no cabeçalho:', csrfToken);

  try {
    const response = await fetch('/api/validate-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ username: email, password: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      showErrorMessage(error.message || 'Erro ao realizar login.');
      return;
    }

    const result = await response.json();
    if (result.redirectUrl) {
      navigate(result.redirectUrl);
    }
  } catch (error) {
    console.error('Erro ao enviar a requisição:', error);
    showErrorMessage('Erro interno. Tente novamente mais tarde.');
  }
};

export const Login = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Erro ao buscar token CSRF:', response.statusText);
          return;
        }

        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('Token CSRF recebido:', data.csrfToken);
      } catch (error) {
        console.error('Erro ao buscar token CSRF:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const internalHandleSubmit = async (event) => {
    await handleSubmit(event, csrfToken, navigate);
  };

  return (
    <Form
      title="Login"
      linkText="Entrar/"
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
