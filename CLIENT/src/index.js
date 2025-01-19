import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/scss/global-style.scss';

import { Home } from './templates/Home';
import AdminLogin from './templates/AdminLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-panel" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
