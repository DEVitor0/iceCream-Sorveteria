import { React, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import { AnimatePresence } from 'framer-motion';
import theme from './media/theme/index';
import './styles/scss/global-style.scss';

// Components
import { Home } from './templates/Home';
import Carrinho from './templates/Cart/cart';
import SignIn from './templates/authentication/sign-in/index';
import SignUp from './templates/authentication/sign-up/index';
import RegisterDatas from './templates/authentication/registerData/index';
import Dashboard from './templates/dashboard/index';
import RegisterProducts from './templates/dashboard/pages/Products/Register/index';
import EditProduct from './templates/dashboard/pages/Products/Edit/EditProduct';
import OrdersPage from './templates/dashboard/pages/Sales/Lançamento';
import TwoFAScreen from './templates/authentication/TwoFAScreen/TwoFAScreen';
import OrderHistoryPage from 'templates/dashboard/pages/Sales/History';
import EmailSenderPage from './templates/dashboard/pages/User/SendMailsToClient/EmailSenderPage';
import ClientsAdminPage from './templates/dashboard/pages/User/TableOfClients/ClientsAdminPage';

import GeoBlocked from './components/Authentication/GeoVerification/GeoBloqued';
import GeoProtectedRoute from 'components/Authentication/GeoVerification/GeoProtectedRoute';

// Contexts
import IconProvider from './contexts/IconsContext/IconProvider/index';
import ImageProvider from './contexts/ImagesContext/ImageProvider/index';
import { SoftUIControllerProvider } from './contexts/Reducer/index';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import { ApiProvider } from './contexts/RequestCSRFToken/ApiContextCSRFToken';
import { GeoProvider } from './contexts/GeoContext/GeoContext';

const CouponsPage = lazy(() =>
  import('./templates/dashboard/pages/Sales/Coupon/CouponsPage'),
);
const EditCouponPage = lazy(() =>
  import('./templates/dashboard/pages/Sales/Coupon/EditCouponPage'),
);
const CreateCouponPage = lazy(() =>
  import('./templates/dashboard/pages/Sales/Coupon/CreateCouponPage'),
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <SoftUIControllerProvider>
      <GeoProvider>
        <IconProvider>
          <ImageProvider>
            <ApiProvider>
              <BrowserRouter basename="/">
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
                    path="/carrinho"
                    element={
                      <ApiProvider>
                        <Carrinho />
                      </ApiProvider>
                    }
                  />
                  <Route
                    path="/authentication/registrar"
                    element={
                      <SoftUIControllerProvider>
                        <ImageProvider>
                          <SignUp />
                        </ImageProvider>
                      </SoftUIControllerProvider>
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
                  <Route path="/geo-blocked" element={<GeoBlocked />} />
                  <Route
                    path="/authentication/registrar/dados"
                    element={
                      <ProtectedRoute authType="register">
                        <SoftUIControllerProvider>
                          <ImageProvider>
                            <RegisterDatas />
                          </ImageProvider>
                        </SoftUIControllerProvider>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                        >
                          <SoftUIControllerProvider>
                            <Dashboard />
                          </SoftUIControllerProvider>
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/cadastrar"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <ApiProvider>
                            <SoftUIControllerProvider>
                              <RegisterProducts />
                            </SoftUIControllerProvider>
                          </ApiProvider>
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/editar-produtos"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <ApiProvider>
                            <SoftUIControllerProvider>
                              <EditProduct />
                            </SoftUIControllerProvider>
                          </ApiProvider>
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Vendas/Cupom"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <SoftUIControllerProvider>
                            <AnimatePresence mode="wait">
                              <CouponsPage key="coupons-page" />
                            </AnimatePresence>
                          </SoftUIControllerProvider>
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Vendas/Cupom/Criar"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <AnimatePresence mode="wait">
                            <SoftUIControllerProvider>
                              <CreateCouponPage />
                            </SoftUIControllerProvider>
                          </AnimatePresence>
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Vendas/Cupom/Editar/:couponId"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <EditCouponPage />
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Vendas/Lançamento"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <OrdersPage />
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Vendas/Histórico"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <OrderHistoryPage />
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Clientes/Email"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <EmailSenderPage />
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                  <Route
                    path="/Dashboard/Clientes/Histórico"
                    element={
                      <GeoProtectedRoute adminOnly>
                        <ProtectedRoute
                          authType="login"
                          requiredRoles={['admin', 'moder']}
                          geoRestricted={true}
                        >
                          <ClientsAdminPage />
                        </ProtectedRoute>
                      </GeoProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </ApiProvider>
          </ImageProvider>
        </IconProvider>
      </GeoProvider>
    </SoftUIControllerProvider>
  </ThemeProvider>,
);
