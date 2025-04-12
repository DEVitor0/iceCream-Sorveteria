import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/Authentication/UseAuth';
import styles from './ProtectedRoute.module.scss';

const ProtectedRoute = ({ children, authType = 'login' }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
  });

  const location = useLocation();
  const { loading: loadingFromHook } = useAuth();

  useEffect(() => {
    // Função para verificar autenticação via API
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8443/auth/verify', {
          credentials: 'include', // Isso envia os cookies
        });

        if (response.ok) {
          setAuthState({
            loading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            loading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, [location.pathname]);

  const isLoading = authState.loading || loadingFromHook;

  if (isLoading) {
    console.log('[ProtectedRoute] Exibindo tela de carregamento');
    return (
      <div className={styles.protectedRouteBody}>
        <div className={styles.loadingMessage}>
          Carregando
          <div className={styles.loadingDots}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        </div>
        <div className={styles.icecream}>
          <div className={styles.head}>
            <div className={styles.bite}></div>
            <div className={styles.bite}></div>
            <div className={styles.stripContainer}>
              <div className={styles.strip}></div>
              <div className={styles.strip}></div>
            </div>
            <div className={styles.eyeContainer}>
              <div className={styles.eye}></div>
              <div className={styles.eye}></div>
            </div>
            <div className={styles.mouth}>
              <div className={styles.tongue}></div>
            </div>
            <div className={styles.mltContainer}>
              <div className={styles.drip}></div>
              <div className={styles.drip}></div>
              <div className={styles.drip}></div>
              <div className={styles.drip}></div>
            </div>
          </div>
          <div className={styles.stick}></div>
          <div className={styles.shadow}></div>
          <div className={styles.puddle}></div>
        </div>
      </div>
    );
  }

  if (authType === 'register') {
    if (authState.isAuthenticated) {
      return children;
    }
    return <Navigate to="/authentication/registrar" replace />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/authentication/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
