import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './SuccessPopup.module.scss';

function SuccessPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Fecha após 3s (coincide com o fim da animação)
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.successPopup}>
      <CheckCircleIcon
        className={styles.successIcon}
        fontSize="large"
        color="success"
      />
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );
}

export default SuccessPopup;
