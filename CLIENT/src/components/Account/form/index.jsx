import React from 'react';
import styles from '../../../styles/scss/Account/account.module.scss';
import { Link } from 'react-router-dom';
import InputBox from '../InputBox';
import LoginImage from '../LoginImage';

const Form = ({
  title,
  linkText,
  route,
  emailPlaceholder,
  passwordPlaceholder,
  forgetPasswordText,
  submitButtonText,
  internalHandleSubmit,
  icons,
  image,
  isLoginForm,
}) => {
  return (
    <div className={styles.account}>
      <main className={styles.main}>
        <div className={styles.loginForm}>
          <div className={styles.loginForm__header}>
            <div className={styles.loginForm__title}>
              <Link to={route}>{linkText}</Link> {title}
            </div>
          </div>
          <form
            id="form"
            method="post"
            className={styles.loginForm__form}
            onSubmit={internalHandleSubmit}
            data-testid="form"
          >
            <InputBox
              icon={icons.envelop}
              type="text"
              id="email"
              name="email"
              placeholder={emailPlaceholder}
              autoComplete="email"
            />

            {isLoginForm && (
              <InputBox
                icon={icons.phone}
                type="tel"
                id="phone"
                name="phone"
                placeholder="Digite seu telefone"
                autoComplete="tel"
              />
            )}

            <InputBox
              icon={icons.lock}
              type="password"
              id="senha"
              name="senha"
              placeholder={passwordPlaceholder}
              autoComplete="current-password"
            />

            {!isLoginForm && (
              <div className={styles.loginForm__forgetPassword}>
                <p>{forgetPasswordText}</p>
              </div>
            )}

            <InputBox type="submit" value={submitButtonText} />
          </form>
        </div>
        <LoginImage src={image.person} alt="pessoa e um sorvete" />
      </main>
    </div>
  );
};

export default Form;
