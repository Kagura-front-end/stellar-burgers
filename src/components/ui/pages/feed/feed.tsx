import { FC } from 'react';
import { OrdersListUI, FeedInfoUI } from '@ui';
import type { TOrder } from '@utils-types';

type FeedTotals = {
  total: number;
  totalToday: number;
};

type Props = {
  orders: TOrder[];
  feed: FeedTotals;
  readyOrders: number[];
  pendingOrders: number[];
};

export const Feed: FC<Props> = ({ orders, feed, readyOrders, pendingOrders }) => (
  <>
    <OrdersListUI orders={orders} />
    <FeedInfoUI feed={feed} readyOrders={readyOrders} pendingOrders={pendingOrders} />
  </>
);
