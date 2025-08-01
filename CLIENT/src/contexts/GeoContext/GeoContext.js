import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [state, setState] = useState({
    allowed: false,
    loading: false,
    error: null,
  });

  const setAllowed = useCallback((value) => {
    setState((prev) => ({ ...prev, allowed: value }));
  }, []);

  const verifyLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data } = await axios.get('/api/verify-geo', {
        withCredentials: true,
        timeout: 10000,
      });

      if (!data.allowed) {
        throw new Error(data.message || 'Acesso geográfico não permitido');
      }

      setState({ allowed: true, loading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Não foi possível verificar a localização';

      setState({
        allowed: false,
        loading: false,
        error: message,
      });

      if (error.response?.data?.errorType === 'GEO_BLOCKED') {
        return false;
      }

      return false;
    }
  }, []);

  return (
    <GeoContext.Provider
      value={{
        ...state,
        verifyLocation,
        setAllowed,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = () => {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo deve ser usado dentro de um GeoProvider');
  }
  return context;
};
