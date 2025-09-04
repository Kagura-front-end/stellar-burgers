import { FC } from 'react';
import { OrdersListUI } from '@ui';
import type { TOrder } from '@utils-types';

type Props = {
  orders: TOrder[];
};

export const ProfileOrders: FC<Props> = ({ orders }) => <OrdersListUI orders={orders} />;

export default ProfileOrders;
