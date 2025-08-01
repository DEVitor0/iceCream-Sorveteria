export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(
      'https://allowing-llama-seemingly.ngrok-free.app/csrf-token',
      {
        credentials: 'include',
      },
    );
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Erro ao buscar CSRF token:', error);
    return null;
  }
};
