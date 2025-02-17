import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './media/theme/index';
import './styles/scss/global-style.scss';

import { Home } from './templates/Home';
import Login from './templates/Account/LogIn';
import SignUp from './templates/Account/SignUp';
import { SoftUIControllerProvider } from './contexts/Reducer/index';
import Dashboard from './templates/dashboard/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {' '}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registrar" element={<SignUp />} />
          <Route
            path="/Dashboard"
            element={
              <SoftUIControllerProvider>
                <Dashboard />
              </SoftUIControllerProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
