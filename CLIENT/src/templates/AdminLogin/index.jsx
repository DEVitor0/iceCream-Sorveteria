import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../media/icons/fontawesome';
import image from '../../utils/imageManager/imageManager';

import styles from './adminForm.module.scss';

// Exporta a função para exibir mensagens de erro
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

// Exporta a função para validar o email
export const emailIsValid = (email) => {
  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    showErrorMessage('Endereço de email inválido');
    return false;
  }
  return true;
};

// Exporta a função para validar a senha
export const passwordIsValid = (password) => {
  if (password && password.length > 25) {
    showErrorMessage('Senha muito longa');
    return false;
  }
  return true;
};

// Exporta a função de submit para testes, recebendo os parâmetros necessários
export const handleSubmit = async (event, csrfToken, navigate) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.senha.value;

  // Validações
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

  // Verifica se o CSRF token foi obtido antes de enviar a requisição
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

    // Redireciona para a página principal após login bem-sucedido
    const result = await response.json();
    if (result.redirectUrl) {
      navigate(result.redirectUrl);
    }
  } catch (error) {
    console.error('Erro ao enviar a requisição:', error);
    showErrorMessage('Erro interno. Tente novamente mais tarde.');
  }
};

export const AdminLogin = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // Busca o token CSRF ao montar o componente
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

  // Wrapper interno para usar a função exportada handleSubmit
  const internalHandleSubmit = async (event) => {
    await handleSubmit(event, csrfToken, navigate);
  };

  return (
    <div className={styles.adminForm}>
      <main className={styles.main}>
        <div className={styles.loginForm}>
          <div className={styles.loginForm__title}>
            <Link to="/home">Home/</Link> Login
          </div>
          <form
            id="form"
            method="post"
            className={styles.loginForm__form}
            onSubmit={internalHandleSubmit}
            data-testid="form"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div className={styles.loginForm__inputBox}>
              <FontAwesomeIcon
                icon={icons.envelop}
                data-testid="svg-inline--fa"
                className={styles.loginForm__inputBox__icons}
              />
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Digite seu email"
                autoComplete="email"
              />
            </div>
            <div className={styles.loginForm__inputBox}>
              <FontAwesomeIcon
                icon={icons.lock}
                data-testid="svg-inline--fa"
                className={styles.loginForm__inputBox__icons}
              />
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
            </div>
            <div className={styles.loginForm__forgetPassword}>
              <p>Esqueceu a senha ?</p>
            </div>
            <div className={styles.loginForm__inputBox}>
              <input type="submit" value="Entrar" />
            </div>
          </form>
        </div>
        <div className={styles.loginImg}>
          <img src={image.person} alt="teste" width="100%" />
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
