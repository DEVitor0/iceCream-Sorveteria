export const fetchCsrfToken = async () => {
  try {
    const response = await fetch('http://localhost:8443/csrf-token', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Erro ao buscar CSRF token:', error);
    return null;
  }
};
