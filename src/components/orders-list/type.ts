import { TOrder } from '@utils-types';

export type OrdersListProps = {
  orders: TOrder[];
  onClick?: (num: string | number) => void;
  showStatus?: boolean;

};
