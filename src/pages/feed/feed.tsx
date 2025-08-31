import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { publicOrdersActions } from '../../services/orders/publicOrders.slice';
import {
  selectPublicOrders,
  selectPublicReadyNumbers,
  selectPublicPendingNumbers,
  selectPublicTotal,
  selectPublicTotalToday,
} from '../../services/orders/publicOrders.slice';
import { OrdersListUI, FeedInfoUI, Preloader } from '@ui';

const WS_PUBLIC = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(publicOrdersActions.connect(WS_PUBLIC));
    return () => {
      dispatch(publicOrdersActions.disconnect());
    };
  }, [dispatch]);

  const orders = useAppSelector(selectPublicOrders);
  const readyOrders = useAppSelector(selectPublicReadyNumbers);
  const pendingOrders = useAppSelector(selectPublicPendingNumbers);
  const total = useAppSelector(selectPublicTotal);
  const totalToday = useAppSelector(selectPublicTotalToday);

  const openOrder = (num: number | string) => {
    navigate(`/feed/${num}`, { state: { background: location } });
  };

  // Optional: show loader until we have at least some data
  if (!orders || orders.length === 0) return <Preloader />;

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
      <OrdersListUI orders={orders} onClick={openOrder} />
      <FeedInfoUI
        feed={{ total, totalToday }}
        readyOrders={readyOrders}
        pendingOrders={pendingOrders}
      />
    </main>
  );
};
