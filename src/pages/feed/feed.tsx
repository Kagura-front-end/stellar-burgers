import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrdersListUI, FeedInfoUI, Preloader } from '@ui';
import { getFeedsApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

const POLL_MS = 3000;

export const Feed: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState<TOrder[] | null>(null);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);

  // HTTP polling (fallback to canonical)
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const load = async () => {
      try {
        const data = await getFeedsApi();
        if (cancelled) return;
        setOrders(data.orders);
        setTotal(data.total);
        setTotalToday(data.totalToday);
      } catch {
        // keep previous values on error
      }
    };

    load();
    timer = window.setInterval(load, POLL_MS);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const readyOrders = useMemo(
    () =>
      orders
        ? orders
            .filter((o) => o.status === 'done')
            .slice(0, 20)
            .map((o) => o.number)
        : [],
    [orders],
  );

  const pendingOrders = useMemo(
    () =>
      orders
        ? orders
            .filter((o) => o.status !== 'done')
            .slice(0, 20)
            .map((o) => o.number)
        : [],
    [orders],
  );

  const openOrder = useCallback(
    (num: number | string) => {
      navigate(`/feed/${num}`, { state: { background: location } });
    },
    [navigate, location],
  );

  if (!orders) return <Preloader />;

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

export default Feed;
