import React from 'react';
import styles from './ErrorPopup.module.scss';

function ErrorPopup({ message, onClose }) {
  return (
    <div className={styles.errorPopup}>
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
