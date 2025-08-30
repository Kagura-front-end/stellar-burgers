import type { TOrder } from '@utils-types';

export type OrdersListUIProps = {
  orders: TOrder[];
  /** optional, used by containers to push modal routes */
  onClick?: (num: string | number) => void;
};
