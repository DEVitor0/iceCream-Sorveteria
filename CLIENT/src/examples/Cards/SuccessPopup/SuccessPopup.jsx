import styles from './SuccessPopup.module.scss';

function SuccessPopup({ message, onClose }) {
  return (
    <div className={styles.successPopup}>
      <span className={styles.successIcon}>✅</span>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );
}

export default SuccessPopup;
