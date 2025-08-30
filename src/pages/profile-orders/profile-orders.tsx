import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  profileOrdersActions,
  selectProfileOrders,
} from '../../services/orders/profileOrders.slice';
import { OrdersListUI, Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const raw = localStorage.getItem('accessToken') || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  const wsUrl = `wss://norma.nomoreparties.space/orders?token=${token}`;

  const orders = useAppSelector(selectProfileOrders);

  useEffect(() => {
    if (token) dispatch(profileOrdersActions.connect(wsUrl));
    return () => {
      dispatch(profileOrdersActions.disconnect());
    };
  }, [dispatch, wsUrl, token]);

  const openOrder = (num: number | string) => {
    navigate(`/profile/orders/${num}`, { state: { background: location } });
  };

  if (!orders) return <Preloader />;

  return <OrdersListUI orders={orders} onClick={openOrder} />;
};
