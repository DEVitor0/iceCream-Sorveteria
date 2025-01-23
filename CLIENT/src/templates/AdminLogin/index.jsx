import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../media/icons/fontawesome';
import image from '../../utils/imageManager/imageManager';

import styles from './adminForm.module.scss';
import { AdminLoginScript } from './script';

export const AdminLogin = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Buscar o token CSRF do cookie
    const csrfTokenFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrfToken='))
      ?.split('=')[1];

    if (csrfTokenFromCookie) {
      setCsrfToken(csrfTokenFromCookie); // Define o token CSRF no estado
      console.log('Token CSRF recebido do cookie:', csrfTokenFromCookie); // Log para debug
    } else {
      console.error('Token CSRF não encontrado nos cookies');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.senha.value;

    // Verifique se os campos não estão vazios antes de enviar
    if (!email || !password) {
      console.error('Email e senha são obrigatórios!');
      return; // Impede o envio se os campos estiverem vazios
    }

    try {
      const response = await fetch('/api/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken, // Envia o token CSRF no cabeçalho
        },
        credentials: 'include', // Inclui os cookies (se necessário para CSRF)
        body: JSON.stringify({ username: email, password: password }), // Use os nomes corretos no corpo
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro de login:', error.message || 'Erro desconhecido');
        return;
      }

      const result = await response.json();
      console.log('Login bem-sucedido:', result);
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
    }
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
            onSubmit={handleSubmit}
          >
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
                required
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
                required
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
      <AdminLoginScript />
    </div>
  );
};

export default AdminLogin;
