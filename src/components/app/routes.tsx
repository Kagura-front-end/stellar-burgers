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
} from '@pages';
import { IngredientDetails } from '@components';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ConstructorPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'feed', element: <Feed /> },
      { path: 'ingredients/:id', element: <IngredientDetails /> }, // ← add this
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound404 /> },
    ],
  },
]);
