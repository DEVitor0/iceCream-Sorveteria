import styles from '../../../styles/scss/Account/account.module.scss';

const LoginImage = ({ src, alt }) => {
  return (
    <div className={styles.loginImg}>
      <img src={src} alt={alt} width="100%" />
    </div>
  );
};

export default LoginImage;
