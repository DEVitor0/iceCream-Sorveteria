import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/scss/Account/account.module.scss';

export const CaptchaValidation = () => {
  const [captchaImage, setCaptchaImage] = useState('');
  const [input, setInput] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCaptcha = async () => {
      const response = await fetch('/captcha');
      const { image } = await response.json();
      setCaptchaImage(image);
    };
    loadCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/validate-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captchaToken: state.captchaToken,
          captchaText: input,
          ...state.originalData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(data.redirectUrl);
      } else {
        alert('CAPTCHA inválido! Tente novamente.');
        setInput('');
      }
    } catch (error) {
      alert('Erro ao validar CAPTCHA');
    }
  };

  return (
    <div className={styles.account}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.captchaForm}>
          <img
            src={captchaImage}
            alt="CAPTCHA"
            className={styles.captchaImage}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite o texto acima"
            className={styles.captchaInput}
          />
          <button type="submit" className={styles.submitButton}>
            Validar
          </button>
        </form>
      </main>
    </div>
  );
};
