import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIsAuth } from '../../services/user/user.slice';

/**
 * onlyUnAuth = true  → внутрь пускаем только НЕавторизованных (login/register и т.п.)
 * onlyUnAuth = false → внутрь пускаем только авторизованных (profile, profile/orders и т.п.)
 */
type Props = PropsWithChildren<{ onlyUnAuth?: boolean }>;

export default function ProtectedRoute({ onlyUnAuth = false, children }: Props) {
  const location = useLocation();
  const isAuth = useAppSelector(selectIsAuth);
  const isAuthChecked = useAppSelector((s) => s.user.isAuthChecked);

  // Ждем завершения проверки авторизации
  if (!isAuthChecked) return null;

  // Хотим страницу только для НЕавторизованных (login/register), а пользователь уже залогинен:
  if (onlyUnAuth && isAuth) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Хотим страницу только для авторизованных (profile, профильные заказы), а пользователь НЕ залогинен:
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
