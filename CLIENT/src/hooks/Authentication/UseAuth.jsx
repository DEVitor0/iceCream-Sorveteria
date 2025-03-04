import { useState, useEffect } from 'react';
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

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('jwt');

        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        setIsAuthenticated(true);
        setUser({
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        });
      } catch (error) {
        document.cookie =
          'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        navigate('/authentication/login');
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      checkAuth();
    }, 100);
  }, [navigate]);

  return { isAuthenticated, user, loading };
};

export default useAuth;
