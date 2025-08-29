import { createBrowserRouter } from 'react-router-dom';
import App from './app';
import ProtectedRoute from './ProtectedRoute';

import {
  ConstructorPage,
  Login,
  Profile,
  Feed,
  ForgotPassword,
  ResetPassword,
  Register,
  NotFound404,
  ProfileOrders,
} from '@pages';
import { IngredientDetails } from '@components';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ConstructorPage /> },
      {
        path: 'login',
        element: (
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        ),
      },
      { path: 'feed', element: <Feed /> },
      { path: 'ingredients/:id', element: <IngredientDetails /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/orders',
        element: (
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound404 /> },
    ],
  },
]);
