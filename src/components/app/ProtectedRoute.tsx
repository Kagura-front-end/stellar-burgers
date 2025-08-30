import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';

/**
 * onlyUnAuth = true  → внутрь пускаем только НЕавторизованных (login/register и т.п.)
 * onlyUnAuth = false → внутрь пускаем только авторизованных (profile, profile/orders и т.п.)
 */
type Props = PropsWithChildren<{ onlyUnAuth?: boolean }>;

export default function ProtectedRoute({ onlyUnAuth = false, children }: Props) {
  const location = useLocation();

  // Аккуратно определяем, залогинен ли пользователь.
  // 1) если есть user в сторе (как в большинстве стартовых китов)
  // 2) если есть токен в localStorage (fallback)
  const isAuth =
    useAppSelector((s: any) => Boolean(s.user?.user)) ||
    Boolean(localStorage.getItem('accessToken'));

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
