import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './media/theme/index';
import './styles/scss/global-style.scss';

import { Home } from './templates/Home';
import Dashboard from './templates/dashboard/index';
/* import Billing from '../src/templates/billing';
import SignIn from '../src/templates/authentication/sign-in';
import SignUp from '../src/templates/authentication/sign-up'; */
import CadastrarProduto from './templates/Produtos/Register/index';
import IconProvider from './contexts/IconsContext/IconProvider/index';
import { SoftUIControllerProvider } from './contexts/Reducer/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <IconProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Dashboard"
              element={
                <SoftUIControllerProvider>
                  <Dashboard />
                </SoftUIControllerProvider>
              }
            />
            <Route
              path="/Dashboard/cadastrar"
              element={
                <SoftUIControllerProvider>
                  <CadastrarProduto />
                </SoftUIControllerProvider>
              }
            />
          </Routes>
        </IconProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
