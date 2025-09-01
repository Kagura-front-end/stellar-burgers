import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  publicOrdersActions,
  selectPublicOrders,
  selectPublicTotals,
  selectPublicReadyNumbers,
  selectPublicPendingNumbers,
} from '../../services/orders/publicOrders.slice';
import { OrdersList } from '../../components/orders-list/orders-list';
import { FeedInfoUI } from '../../components/ui/feed-info/feed-info';

const FEED_WS = 'wss://norma.nomoreparties.space/orders/all';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(publicOrdersActions.connect(FEED_WS));

    return () => {
      dispatch(publicOrdersActions.disconnect());
    };
  }, []);

  // ✅ memoized selectors (no warnings)
  const orders = useAppSelector(selectPublicOrders);
  const totals = useAppSelector(selectPublicTotals);
  const ready = useAppSelector(selectPublicReadyNumbers);
  const pending = useAppSelector(selectPublicPendingNumbers);

  const location = useLocation();
  const navigate = useNavigate();
  const openOrder = (num: number | string) =>
    navigate(`/feed/${num}`, { state: { background: location } });

  return (
    <main style={{ display: 'flex', gap: 40, maxWidth: 1240, margin: '0 auto' }}>
      <section style={{ flex: '0 0 608px', minWidth: 0 }}>
        <h1 className='text text_type_main-large' style={{ margin: '40px 0 20px' }}>
          Лента заказов
        </h1>
        <OrdersList orders={orders} onClick={openOrder} />
      </section>

      <section style={{ flex: '1 1 auto', maxWidth: 580, minWidth: 0 }}>
        <FeedInfoUI feed={totals} readyOrders={ready} pendingOrders={pending} />
      </section>
    </main>
  );
};

export default FeedPage;
