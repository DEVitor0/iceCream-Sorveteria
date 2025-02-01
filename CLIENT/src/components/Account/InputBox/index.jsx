import React from 'react';
import styles from '../../../styles/scss/Account/account.module.scss';

const InputBox = ({
  icon,
  type,
  id,
  name,
  placeholder,
  autoComplete,
  value,
}) => {
  return (
    <div className={styles.loginForm__inputBox}>
      {icon && <div className={styles.loginForm__inputBox__icons}>{icon}</div>}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
      />
    </div>
  );
};

export default InputBox;
