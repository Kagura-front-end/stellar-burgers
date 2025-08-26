import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAppSelector } from '../../services/hooks';

type Props = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export default function ProtectedRoute({ onlyUnAuth = false, children }: Props) {
  const user = useAppSelector((s) => s.user.user);
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as any)?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
