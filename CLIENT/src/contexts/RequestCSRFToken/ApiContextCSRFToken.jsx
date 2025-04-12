import React, { createContext, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const ApiContext = createContext();

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RETRY_JITTER = 500;

export const ApiProvider = ({ children }) => {
  const axiosInstance = useMemo(() => axios.create(), []);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (config.url?.includes('/csrf-token')) {
          config._noRetry = true;
        }

        if (!config._retry) {
          config._retry = 0;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest._noRetry) {
          return Promise.reject(error);
        }

        if (
          error.response?.status === 429 &&
          originalRequest._retry < MAX_RETRIES
        ) {
          originalRequest._retry += 1;

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
