import React, { createContext, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const ApiContext = createContext();

const MAX_RETRIES = 3; // Máximo de tentativas
const RETRY_DELAY = 1000; // Delay base em milissegundos
const RETRY_JITTER = 500; // Aleatoriedade para evitar picos de requisições

export const ApiProvider = ({ children }) => {
  // Memoize a instância do Axios para evitar recriação desnecessária
  const axiosInstance = useMemo(() => axios.create(), []);

  useEffect(() => {
    // Interceptor de REQUISIÇÕES
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Ignora retentativas em endpoints críticos (ex: CSRF)
        if (config.url?.includes('/csrf-token')) {
          config._noRetry = true; // Marca para não retentar
        }

        // Inicializa o contador de retentativas
        if (!config._retry) {
          config._retry = 0;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Interceptor de RESPOSTAS
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Se a requisição foi marcada para não retentar, rejeita imediatamente
        if (originalRequest._noRetry) {
          return Promise.reject(error);
        }

        // Verifica se o erro é 429 e se ainda há tentativas
        if (
          error.response?.status === 429 &&
          originalRequest._retry < MAX_RETRIES
        ) {
          originalRequest._retry += 1;

          // Calcula delay com jitter para evitar sincronização de retentativas
          const delay =
            RETRY_DELAY * Math.pow(2, originalRequest._retry) +
            Math.random() * RETRY_JITTER;

          await new Promise((resolve) => setTimeout(resolve, delay));

          const newConfig = { ...originalRequest };
          return axiosInstance(newConfig);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return (
    <ApiContext.Provider value={axiosInstance}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
