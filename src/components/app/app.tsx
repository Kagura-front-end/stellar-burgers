import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import styles from './app.module.css';

import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';

// guard
import ProtectedRoute from './ProtectedRoute';

// 🔹 redux hooks + thunk to bootstrap auth
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUser } from '../../services/user/user.slice';
import { Preloader } from '@ui';

// simple local 404 fallback (use your real page later if you have it)
const NotFound = () => <div style={{ padding: 24 }}>Страница не найдена</div>;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // when clicking from a list, links should pass: state={{ background: location }}
  const state = location.state as { background?: Location } | undefined;

  const onClose = () => navigate(-1);

  // 🔹 auth bootstrap
  const dispatch = useAppDispatch();
  const checked = useAppSelector((s) => s.user.isAuthChecked);

  useEffect(() => {
    // tries to get current user (using tokens if any)
    dispatch(fetchUser());
  }, [dispatch]);

  // 🔹 block UI until we know whether the user is authenticated
  if (!checked) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Main content. If there's a background, render that behind the modal */}
      <Routes location={state?.background ?? location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* unauth-only */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* authed */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* full-page fallbacks when opened directly */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* Modal layer on top when background exists */}
      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={onClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={onClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
}
