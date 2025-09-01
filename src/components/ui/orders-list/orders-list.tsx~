import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { OrdersListUIProps } from './type';
import { OrderCardUI } from '@ui';
import styles from './orders-list.module.css';

export const OrdersList: FC<OrdersListUIProps> = ({ orders, onClick }) => {
  const location = useLocation();

  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order._id} className={styles.item}>
          <Link
            to={`${order.number}`}
            state={{ background: location }}
            className={styles.link}
            onClick={() => onClick?.(order.number)}
          >
            <OrderCardUI order={order} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default OrdersList;
