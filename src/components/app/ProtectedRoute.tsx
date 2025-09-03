import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIsAuth } from '../../services/user/user.slice';

const UNAUTH_ROUTES = new Set(['/login', '/register', '/forgot-password', '/reset-password']);

/** Pages that require an authenticated user (e.g. /profile, /profile/orders) */
export function RequireAuth() {
  const isAuth = useAppSelector(selectIsAuth);
  const isAuthChecked = useAppSelector((s) => (s.user as any)?.isAuthChecked ?? true);
  const location = useLocation();

  if (!isAuthChecked) return null;
  if (!isAuth) {
    if (location.pathname === '/login') return null;
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Pages that must be hidden from authenticated users (e.g. /login, /register) */
export function OnlyUnAuth() {
  const isAuth = useAppSelector(selectIsAuth);
  const isAuthChecked = useAppSelector((s) => (s.user as any)?.isAuthChecked ?? true);
  const location = useLocation();

  if (!isAuthChecked) return null;

  if (isAuth) {
    const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
    let target = from ?? '/';

    if (UNAUTH_ROUTES.has(target)) target = '/';

    if (target === location.pathname) return <Navigate to='/' replace />;

    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
