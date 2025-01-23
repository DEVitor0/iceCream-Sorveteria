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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // eslint-disable-next-line no-unused-vars
      const form = document.querySelector('#form');
      const emailInput = document.querySelector('input[type="text"]#email');
      const passwordInput = document.querySelector(
        'input[type="password"]#senha',
      );

      const isEmailValid = emailIsValid(emailInput);
      const isPasswordValid = passwordIsValid(passwordInput);
      const isEmailEmpty = checkInputIsEmpty(emailInput);
      const isPasswordEmpty = checkInputIsEmpty(passwordInput);

      if (
        isEmailValid &&
        isPasswordValid &&
        isEmailEmpty &&
        isPasswordEmpty &&
        emailInput.value.length <= 35 &&
        passwordInput.value.length <= 25
      ) {
        try {
          const response = await fetch('/api/validate-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: emailInput.value,
              password: passwordInput.value,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            alert('Login realizado com sucesso!');
          } else {
            showErrorMessage(result.message || 'Erro ao realizar login.');
          }
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
          showErrorMessage('Erro interno. Tente novamente mais tarde.');
        }
      }
    },
    [checkInputIsEmpty, emailIsValid, passwordIsValid, showErrorMessage],
  );

  useEffect(() => {
    const form = document.querySelector('#form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
    return () => {
      if (form) {
        form.removeEventListener('submit', handleSubmit);
      }
    };
  }, [handleSubmit]);

  return null;
};
