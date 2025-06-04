import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAuth = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          'https://allowing-llama-seemingly.ngrok-free.app/auth/verify',
          {
            credentials: 'include',
          },
        );

        if (response.ok) {
          const userData = await response.json();
          setState({
            isAuthenticated: true,
            user: userData,
            loading: false,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, [location.pathname]);

  return state;
};

export default useAuth;
