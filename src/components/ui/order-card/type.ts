import type { TOrder } from '@utils-types';

export type OrderCardUIProps = {
  order: TOrder;
  /** Optional click handler used when wrapping with Link-less layouts (stories, tests) */
  onClick?: () => void;
};
