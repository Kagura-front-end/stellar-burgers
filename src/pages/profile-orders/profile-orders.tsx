import { FC, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    dispatch(profileOrdersActions.connect());

    return () => {
      dispatch(profileOrdersActions.disconnect());
    };
  }, [dispatch]);

  const orders = useAppSelector(selectProfileOrders);
  const connected = useAppSelector(selectProfileConnected);
  const error = useAppSelector(selectProfileError);

  const openOrder = (num: number | string) =>
    navigate(`/profile/orders/${num}`, { state: { background: location } });

  // Still initializing the socket and we have no data nor errors yet
  if (!connected && !error && orders.length === 0) {
    return <Preloader />;
  }

  if (error === 'no-token') {
    return (
      <p className='text text_type_main-default' style={{ padding: 24 }}>
        Не удалось открыть поток заказов: отсутствует токен авторизации.
      </p>
    );
  }

  return orders.length ? (
    <OrdersList orders={orders} onClick={openOrder} />
  ) : (
    <p className='text text_type_main-default' style={{ padding: 24 }}>
      Заказов пока нет.
    </p>
  );
};
