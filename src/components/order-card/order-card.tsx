import { FC, memo } from 'react';
import { OrderCardUI } from '@ui';
import type { TOrder } from '@utils-types';

type Props = {
  order: TOrder;
  onClick?: () => void;
};

export const OrderCard: FC<Props> = memo(({ order, onClick }) => (
  <OrderCardUI order={order} onClick={onClick} />
));

export default OrderCard;
