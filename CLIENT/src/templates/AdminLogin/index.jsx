import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../media/icons/fontawesome';
import image from '../../utils/imageManager/imageManager';

import styles from './adminForm.module.scss';
import { AdminLoginScript } from './script';

export const AdminLogin = () => {
  return (
    <div className={styles.adminForm}>
      <main className={styles.main}>
        <div className={styles.loginForm}>
          <div className={styles.loginForm__title}>
            <Link to="/home">Home/</Link> Login
          </div>
          <form id="form" method="post" className={styles.loginForm__form}>
            <div className={styles.loginForm__inputBox}>
              <FontAwesomeIcon
                icon={icons.envelop}
                data-testid="svg-inline--fa"
                className={styles.loginForm__inputBox__icons}
              />
              <input
                type="text"
                id="email"
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
      <AdminLoginScript />
    </div>
  );
};

export default AdminLogin;
