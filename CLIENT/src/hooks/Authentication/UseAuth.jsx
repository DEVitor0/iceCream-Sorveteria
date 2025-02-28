import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/Dashboard', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.redirected) {
          window.location.href = response.url;
        } else if (response.ok) {
          setIsAuthenticated(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthenticated, loading };
};

export default useAuth;
