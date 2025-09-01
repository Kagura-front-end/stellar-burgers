// src/pages/profile-orders/profile-orders.tsx
import { FC, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  profileOrdersActions,
  selectProfileOrders,
  selectProfileConnected,
  selectProfileError,
} from '../../services/orders/profileOrders.slice';
import { OrdersList } from '../../components/orders-list/orders-list';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const orders = useAppSelector(selectProfileOrders);
  const connected = useAppSelector(selectProfileConnected);
  const error = useAppSelector(selectProfileError);

  // Simple auth guard
  const raw = localStorage.getItem('accessToken') || '';
  const hasToken = Boolean(raw);
  if (!hasToken) return <Navigate to='/login' replace state={{ from: location }} />;

  // Connect once
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    dispatch(profileOrdersActions.connect()); // ← no args
    return () => {
      dispatch(profileOrdersActions.disconnect());
    };
  }, [dispatch]);

  const openOrder = (num: number | string) =>
    navigate(`/profile/orders/${num}`, { state: { background: location } });

  if (!connected && !error) return <Preloader />;
  if (error) return <p className='text text_type_main-default'>Ошибка: {error}</p>;
  if (!orders || orders.length === 0)
    return (
      <main style={{ maxWidth: 1240, margin: '0 auto' }}>
        <h1 className='text text_type_main-large' style={{ margin: '40px 0 20px' }}>
          Мои заказы
        </h1>
        <p className='text text_type_main-default text_color_inactive'>У вас пока нет заказов.</p>
      </main>
    );

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto' }}>
      <h1 className='text text_type_main-large' style={{ margin: '40px 0 20px' }}>
        Мои заказы
      </h1>
      <OrdersList orders={orders} onClick={openOrder} />
    </main>
  );
};

export default ProfileOrders;
