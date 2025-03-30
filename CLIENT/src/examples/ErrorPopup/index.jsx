import React, { useEffect, useState } from 'react';
import styles from './ErrorPopup.module.scss';

function ErrorPopup({ message, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${styles.errorPopup} ${isExiting ? styles.exiting : ''}`}
      style={{ fontFamily: 'Poppins, Montserrat, sans-serif' }}
    >
      <span className={styles.errorIcon}>
        <span className="material-symbols-outlined">warning</span>
      </span>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );
}

export default ErrorPopup;
