// eslint-disable-next-line no-unused-vars
import styles from '../../styles/scss/Account/account.module.scss';

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch('/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Erro ao buscar token CSRF:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Token CSRF recebido:', data.csrfToken);
    return data.csrfToken;
  } catch (error) {
    console.error('Erro ao buscar token CSRF:', error);
    return null;
  }
};
