import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import theme from './media/theme/index';
import './styles/scss/global-style.scss';

import { Home } from './templates/Home';
import Dashboard from './templates/dashboard/index';
import RegisterProducts from './templates/dashboard/pages/Products/Register/index';
import EditProduct from './templates/dashboard/pages/Products/Edit/EditProduct';
import SignIn from './templates/authentication/sign-in/index';
import TwoFAScreen from './templates/authentication/TwoFAScreen/TwoFAScreen';

import IconProvider from './contexts/IconsContext/IconProvider/index';
import { SoftUIControllerProvider } from './contexts/Reducer/index';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import { ApiProvider } from './contexts/RequestCSRFToken/ApiContextCSRFToken';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <IconProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ApiProvider>
                <Home />
              </ApiProvider>
            }
          />
          <Route
            path="/authentication/login"
            element={
              <SoftUIControllerProvider>
                <SignIn />
              </SoftUIControllerProvider>
            }
          />
          <Route
            path="/validate-2fa"
            element={
              <SoftUIControllerProvider>
                <TwoFAScreen />
              </SoftUIControllerProvider>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <SoftUIControllerProvider>
                  <Dashboard />
                </SoftUIControllerProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Dashboard/cadastrar"
            element={
              <ProtectedRoute>
                <ApiProvider>
                  <SoftUIControllerProvider>
                    <RegisterProducts />
                  </SoftUIControllerProvider>
                </ApiProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Dashboard/editar-produtos"
            element={
              <ProtectedRoute>
                <ApiProvider>
                  <SoftUIControllerProvider>
                    <EditProduct />
                  </SoftUIControllerProvider>
                </ApiProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </IconProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
