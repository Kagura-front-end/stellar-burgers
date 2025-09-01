// src/components/app/ProtectedRoute.tsx
import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIsAuth } from '../../services/user/user.slice';

/**
 * onlyUnAuth = true  → pages for NOT-authenticated users only (/login, /register)
 * onlyUnAuth = false → pages for authenticated users only (/profile, /profile/orders)
 */
type Props = PropsWithChildren<{ onlyUnAuth?: boolean }>;

export default function ProtectedRoute({ onlyUnAuth = false, children }: Props) {
  const location = useLocation();

  // Use store truth only; do not infer auth from token to avoid flip-flops
  const isAuth = useAppSelector(selectIsAuth);
  const isAuthChecked = useAppSelector((s) => (s.user as any)?.isAuthChecked ?? true);

  // wait until auth check is complete (render nothing or a loader if you prefer)
  if (!isAuthChecked) return null;

  // Un-auth-only pages (e.g. /login) while user IS auth → send them away.
  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
    const target = from ?? '/';

    // Avoid redirecting to the current path (infinite loop in dev)
    if (target === location.pathname) {
      return <Navigate to='/' replace />;
    }
    return <Navigate to={target} replace />;
  }

  // Auth-only pages while user is NOT auth → go to /login with "from"
  if (!onlyUnAuth && !isAuth) {
    // If we are already on /login for some reason, don’t redirect again.
    if (location.pathname === '/login') return null;
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
