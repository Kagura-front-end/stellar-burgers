import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';

export const RequireAuth: FC = () => {
  const location = useLocation();
  const isChecked = useAppSelector((s) => s.user.isAuthChecked);
  const user = useAppSelector((s) => s.user.user);

  if (!isChecked) return null;
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export const OnlyUnAuth: FC = () => {
  const location = useLocation();
  const isChecked = useAppSelector((s) => s.user.isAuthChecked);
  const user = useAppSelector((s) => s.user.user);

  if (!isChecked) return null;
  if (user) {
    const from = (location.state as { from?: Location } | undefined)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};
