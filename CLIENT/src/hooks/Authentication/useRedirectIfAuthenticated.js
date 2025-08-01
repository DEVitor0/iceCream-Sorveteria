import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim());
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = getCookie('jwt');

        if (!token) {
          return;
        }

        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        navigate('/Dashboard');
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);
};

export default useRedirectIfAuthenticated;
