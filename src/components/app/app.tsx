import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import styles from './app.module.css';

import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import Feed from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';

import IngredientDetailsPage from '../../pages/full-screen/ingredient-details-page';
import OrderInfoPage from '../../pages/full-screen/order-info-page';
import ProfileOrderInfoPage from '../../pages/full-screen/profile-order-info-page';

import { RequireAuth, OnlyUnAuth } from '../protected-route/ProtectedRoute';

import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUser, userActions } from '../../services/user/user.slice';
import { Preloader } from '@ui';
import { getCookie } from '../../utils/cookie';

function OrderModal() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  return (
    <Modal title='' onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
}

const NotFound = () => <div style={{ padding: 24 }}>Страница не найдена</div>;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | undefined;
  const onClose = () => navigate(-1);

  const dispatch = useAppDispatch();
  const checked = useAppSelector((s) => s.user.isAuthChecked);

  useEffect(() => {
    const hasAccess = getCookie('accessToken');
    const hasRefresh = localStorage.getItem('refreshToken');

    if (hasAccess || hasRefresh) {
      dispatch(fetchUser());
    } else {
      dispatch(userActions.resetUser());
    }
  }, [dispatch]);

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

      {/* Base routes (full pages). If there's a background, render against it */}
      <Routes location={state?.background ?? location}>
        {/* Public */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Full-screen versions (no modal) */}
        <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
        <Route path='/feed/:number' element={<OrderInfoPage />} />

        {/* Auth-only full-screen */}
        <Route element={<RequireAuth />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/profile/orders/:number' element={<ProfileOrderInfoPage />} />
        </Route>

        {/* Auth gates for non-auth users */}
        <Route element={<OnlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* Background-modal routes: rendered only when navigated from a background page */}
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
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route element={<RequireAuth />}>
            <Route path='/profile/orders/:number' element={<OrderModal />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}
