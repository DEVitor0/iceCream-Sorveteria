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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <IconProvider>
          <Routes>
            <Route path="/" element={<Home />} />
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
                  <SoftUIControllerProvider>
                    <RegisterProducts />
                  </SoftUIControllerProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Dashboard/editar-produtos"
              element={
                <ProtectedRoute>
                  <SoftUIControllerProvider>
                    <EditProduct />
                  </SoftUIControllerProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </IconProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
