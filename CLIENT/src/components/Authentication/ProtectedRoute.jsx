import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/Authentication/UseAuth';
import styles from './ProtectedRoute.module.scss';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.protectedRouteBody}>
        {' '}
        {/* Aplicando a classe específica */}
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

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/authentication/login" replace />
  );
};

export default ProtectedRoute;
