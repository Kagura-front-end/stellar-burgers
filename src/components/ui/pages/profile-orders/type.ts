import type { TOrder } from '@utils-types';

export type OrdersListUIProps = {
  orders: TOrder[];
  onClick?: (num: string | number) => void;
};
