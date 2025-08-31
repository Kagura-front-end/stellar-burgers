import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { publicOrdersActions } from '../../services/orders/publicOrders.slice';
import {
  loadPublicFeed,
  selectPublicOrders,
  selectPublicReadyNumbers,
  selectPublicPendingNumbers,
  selectPublicTotal,
  selectPublicTotalToday,
} from '../../services/orders/publicOrders.slice';

// keep OrdersListUI and Preloader from @ui…
import { OrdersListUI, Preloader } from '@ui';
// …but import FeedInfoUI directly from the UI folder (default export)
import FeedInfoUI from '../../components/ui/feed-info/feed-info';

const WS_PUBLIC = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // WS + HTTP fallback/prefill
  useEffect(() => {
    dispatch(publicOrdersActions.connect(WS_PUBLIC));
    dispatch(loadPublicFeed()); // prefill quickly

    const id = setInterval(() => dispatch(loadPublicFeed()), 15000);

    return () => {
      clearInterval(id);
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

  // Show loader only while first fetch is pending AND we have no data yet
  const hasAnyData = orders.length > 0 || total > 0 || totalToday > 0;

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
      {!hasAnyData ? (
        <Preloader />
      ) : (
        <>
          <OrdersListUI orders={orders} onClick={openOrder} />
          <FeedInfoUI
            feed={{ total, totalToday }}
            readyOrders={readyOrders}
            pendingOrders={pendingOrders}
          />
        </>
      )}
    </main>
  );
};

export default Feed;
