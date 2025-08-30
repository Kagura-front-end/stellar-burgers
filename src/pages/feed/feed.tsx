import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  publicOrdersActions,
  selectPublicOrders,
  selectPublicTotals,
} from '../../services/orders/publicOrders.slice';
import { OrdersListUI, FeedInfoUI, Preloader } from '@ui';
import type { TOrder } from '@utils-types';

const WS_PUBLIC = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const orders = useAppSelector(selectPublicOrders);
  const totals = useAppSelector(selectPublicTotals);

  useEffect(() => {
    dispatch(publicOrdersActions.connect(WS_PUBLIC));
    return () => {
      dispatch(publicOrdersActions.disconnect());
    };
  }, [dispatch]);

  const openOrder = (num: number | string) => {
    navigate(`/feed/${num}`, { state: { background: location } });
  };

  if (!orders) return <Preloader />;

  // Prepare data for FeedInfoUI
  const readyOrders = orders
    .filter((o: TOrder) => o.status === 'done')
    .map((o) => o.number)
    .slice(0, 10);

  const pendingOrders = orders
    .filter((o: TOrder) => o.status === 'pending')
    .map((o) => o.number)
    .slice(0, 10);

  const feed = { total: totals.total, totalToday: totals.totalToday };

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
      <OrdersListUI orders={orders} onClick={openOrder} />
      <FeedInfoUI feed={feed} readyOrders={readyOrders} pendingOrders={pendingOrders} />
    </main>
  );
};
