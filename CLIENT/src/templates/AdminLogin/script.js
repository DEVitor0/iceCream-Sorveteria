import { useEffect, useCallback } from 'react';

import styles from './adminForm.module.scss';

export const AdminLoginScript = () => {
  const showErrorMessage = useCallback((message) => {
    const form = document.querySelector('#form');

    if (!form) return;

    const existingMessage = Array.from(form.children).find((child) =>
      child.classList.contains(styles.errorMessage),
    );

    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(styles.errorMessage);
    const messageText = document.createElement('p');
    messageText.textContent = message;

    messageDiv.appendChild(messageText);
    form.appendChild(messageDiv);
  }, []);

  const checkInputIsEmpty = useCallback(
    (input) => {
      if (!input || !input.value) {
        showErrorMessage('Preencha todos os campos para enviar');
        return false;
      }
      return true;
    },
    [showErrorMessage],
  );

  const emailIsValid = useCallback(
    (emailInput) => {
      if (
        !emailInput ||
        emailInput.value.indexOf('@') === -1 ||
        emailInput.value.indexOf('.') === -1
      ) {
        showErrorMessage('Endereço de email inválido');
        return false;
      }
      return true;
    },
    [showErrorMessage],
  );

  const passwordIsValid = useCallback(
    (passwordInput) => {
      if (passwordInput && passwordInput.value.length > 25) {
        showErrorMessage('Senha muito longa');
        return false;
      }
      return true;
    },
    [showErrorMessage],
  );

  useEffect(() => {
    const form = document.querySelector('#form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.querySelector('input[type="text"]#email');
      const passwordInput = document.querySelector(
        'input[type="password"]#senha',
      );

      const isEmailValid = emailIsValid(emailInput);
      const isPasswordValid = passwordIsValid(passwordInput);
      const isEmailEmpty = checkInputIsEmpty(emailInput);
      const isPasswordEmpty = checkInputIsEmpty(passwordInput);

      if (emailInput && emailInput.value.length > 35) {
        showErrorMessage('Endereço de email muito longo');
      }

      if (passwordInput && passwordInput.value.length > 25) {
        showErrorMessage('Senha muito longa');
      }

      if (
        isEmailValid &&
        isPasswordValid &&
        isEmailEmpty &&
        isPasswordEmpty &&
        emailInput.value.length <= 35 &&
        passwordInput.value.length <= 25
      ) {
        form.submit();
      }
    });
  }, [checkInputIsEmpty, emailIsValid, passwordIsValid, showErrorMessage]);

  return null;
};
