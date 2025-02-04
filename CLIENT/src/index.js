import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/scss/global-style.scss';

import { Home } from './templates/Home';
import Login from './templates/Account/LogIn';
import SignUp from './templates/Account/SignUp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/registrar" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
