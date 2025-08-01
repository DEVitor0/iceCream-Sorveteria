import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/Authentication/UseAuth';
import styles from './ProtectedRoute.module.scss';

const ProtectedRoute = ({ children, authType = 'login' }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    token: null,
    isAuthenticated: false,
  });

  const location = useLocation();
  const { isAuthenticated: isAuthFromHook, loading: loadingFromHook } =
    useAuth();

  useEffect(() => {
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const checkAuth = () => {
      const token = getCookie('jwt');
      console.log('Token encontrado:', token);

      if (token) {
        setAuthState({
          loading: false,
          token,
          isAuthenticated: true,
        });
        return;
      }

      setTimeout(() => {
        const finalToken = getCookie('jwt');
        console.log('Token após delay:', finalToken);

        setAuthState({
          loading: false,
          token: finalToken,
          isAuthenticated: !!finalToken || isAuthFromHook,
        });
      }, 50);
    };

    checkAuth();
  }, [location.pathname, isAuthFromHook]);

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
    console.log(`[ProtectedRoute][Registro] Estado:`, authState);

    if (authState.token) {
      console.log('[ProtectedRoute][Registro] Acesso permitido via cookie');
      return children;
    }

    console.log('[ProtectedRoute][Registro] Redirecionando para registro');
    return <Navigate to="/authentication/registrar" replace />;
  }

  if (!authState.isAuthenticated) {
    console.log('[ProtectedRoute] Redirecionando para login');
    return <Navigate to="/authentication/login" replace />;
  }

  if (
    authState.isAuthenticated &&
    location.pathname === '/authentication/login'
  ) {
    console.log('[ProtectedRoute] Redirecionando para Dashboard');
    return <Navigate to="/Dashboard" replace />;
  }

  console.log('[ProtectedRoute] Acesso permitido');
  return children;
};

export default ProtectedRoute;
